import { defaultSanitizer } from "../../sanitizers/default.js";
import { numericSanitizer } from "../../sanitizers/numeric.js";
import { isArray } from "../../utils/array.js";
import { isNull } from "../../utils/common.js";
import { isNumber, isRealNumber } from "../../utils/number.js";
import { isObject } from "../../utils/object.js";
import { isString, titleCase } from "../../utils/string.js";
import { unifyLiteralStrings } from "../../utils/typescript.js";
import { requiredValidator } from "../../validators/required.js";
import { defineField } from "../field.definition.js";
export default defineField({
  name: "size",
  type: {
    js: "object",
    ts: ({ options }) => {
      const inputs = options.inputs ?? { width: {}, height: {} };
      return `{ ${Object.entries(inputs).map(
        ([key, input]) => `${key}: { value: number` + (isArray(input.units) ? `; unit: ${unifyLiteralStrings(...input.units)}` : "") + ` }`
      ).join(", ")} }`;
    }
  },
  default: ({ options }) => options.default ?? "",
  vueComponent: void 0,
  options: {
    required: {
      type: "boolean",
      description: ["Specifies that the field input is mandatory during creation.", "", "@default false"],
      default: () => false
    },
    label: {
      type: "string",
      description: [
        "The field label displayed in the UI.",
        "",
        "By default, it is automatically generated based on the property name assigned to the field.",
        "Example: 'imageSize' => 'Image size'"
      ],
      default: ({ name }) => titleCase(name, false)
    },
    inputs: {
      type: "Record<string, SizeInput>",
      description: [
        "A record of subfields that make up the field.",
        "The keys of the record are used as the subfield names.",
        "",
        "@default { width: {}, height: {} }"
      ],
      default: () => ({ width: {}, height: {} })
    },
    default: {
      type: "Record<string, { value: number; unit?: string }>",
      description: [
        "The default field value.",
        "",
        "By default, all defined size `inputs` are set to their `min` value and first unit in the a `units` array."
      ],
      default: ({ options }) => {
        const inputs = options.inputs ?? { width: {}, height: {} };
        return Object.keys(inputs).reduce((acc, key) => {
          acc[key] = inputs[key].default ?? { value: inputs[key].min ?? 0, unit: inputs[key].units?.[0] };
          return acc;
        }, {});
      }
    },
    name: {
      type: "string",
      description: [
        "A string that specifies the base `name` for the input controls.",
        "",
        "If not specified, the `name` attribute will be automatically generated."
      ]
    },
    description: {
      type: "string | string[]",
      description: [
        "A brief descriptive text displayed in code comments and in a tooltip at the upper right corner of the field.",
        "",
        "Use an array to handle line breaks."
      ]
    },
    syncable: {
      type: "boolean",
      description: ["Whether the size values can be synchronized in the field UI.", "", "@default false"],
      default: () => false
    }
  },
  sanitizers: [
    (context) => context.options.required ? context.value : defaultSanitizer(context),
    ({ options, value }) => {
      const inputs = options.inputs ?? { width: {}, height: {} };
      if (isString(value) || isNumber(value)) {
        const numeric = numericSanitizer({ value });
        if (isRealNumber(numeric)) {
          return Object.keys(inputs).reduce((acc, key) => {
            acc[key] = { value: numeric };
            return acc;
          }, {});
        }
      } else if (isObject(value)) {
        return Object.keys(value).reduce((acc, key) => {
          const numeric = numericSanitizer({ value: value[key] });
          acc[key] = isRealNumber(numeric) ? { value: numeric } : value[key];
          return acc;
        }, {});
      }
      return value;
    }
  ],
  validators: [
    {
      onCreate: true,
      onUpdate: true,
      validator: (context) => context.options.required && requiredValidator(context)
    },
    ({ __, language, options, value }) => {
      const inputs = options.inputs ?? { width: {}, height: {} };
      if (!isNull(value) && (!isObject(value) || JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(Object.keys(inputs).sort()) || Object.values(value).some(
        (input) => !isObject(input) || Object.keys(input).some((key) => key !== "value" && key !== "unit")
      ))) {
        throw new Error(__(language, "pruvious-server", "Invalid input type"));
      }
    },
    ({ __, language, options, value }) => {
      const inputs = options.inputs ?? { width: {}, height: {} };
      for (const [key, input] of Object.entries(value)) {
        const def = inputs[key];
        if (!isRealNumber(input.value)) {
          throw new Error(
            __(language, "pruvious-server", "The '$name' value must be numeric", {
              name: __(language, "pruvious-dashboard", inputs[key].label ?? titleCase(key))
            })
          );
        } else if (input.value < (def.min ?? 0)) {
          throw new Error(
            __(language, "pruvious-server", "The '$name' value must be greater than or equal to $min", {
              name: __(language, "pruvious-dashboard", inputs[key].label ?? titleCase(key)),
              min: def.min ?? 0
            })
          );
        } else if (input.value > (def.max ?? Number.MAX_SAFE_INTEGER)) {
          throw new Error(
            __(language, "pruvious-server", "The '$name' value must be less than or equal to $max", {
              name: __(language, "pruvious-dashboard", inputs[key].label ?? titleCase(key)),
              max: def.max ?? Number.MAX_SAFE_INTEGER
            })
          );
        } else if (def.units?.length && (!input.unit || !def.units.includes(input.unit))) {
          throw new Error(
            __(language, "pruvious-server", "Invalid '$name' unit", {
              name: __(language, "pruvious-dashboard", inputs[key].label ?? titleCase(key))
            })
          );
        }
      }
    }
  ],
  inputMeta: {
    required: ({ options }) => !!options.required,
    codeComment: ({ options }) => options.description || ""
  }
});
export function vueField(options, additional) {
  return Object;
}
export function vueSubfield(options, additional) {
  return Object;
}
