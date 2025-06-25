import { defaultSanitizer } from "../../sanitizers/default.js";
import { uniqueArraySanitizer } from "../../sanitizers/unique-array.js";
import { isArray } from "../../utils/array.js";
import { isNumber } from "../../utils/number.js";
import { isKeyOf } from "../../utils/object.js";
import { isString, titleCase } from "../../utils/string.js";
import { unifyLiteralStrings } from "../../utils/typescript.js";
import { arrayValidator } from "../../validators/array.js";
import { requiredValidator } from "../../validators/required.js";
import { defineField } from "../field.definition.js";
export default defineField({
  name: "checkboxes",
  type: {
    js: "object",
    ts: ({ options }) => {
      if (options.overrideType) {
        return options.overrideType;
      }
      const choiceValues = options.choices ? Object.keys(options.choices) : [];
      return choiceValues.length ? "(" + unifyLiteralStrings(...choiceValues) + ")[]" : "never";
    }
  },
  default: ({ options }) => options.default ?? [],
  vueComponent: void 0,
  options: {
    choices: {
      type: "Record<string, string>",
      description: "A key-value object containing permissible choices, where the key represents the choice value, and the value represents the corresponding checkbox label.",
      required: true
    },
    required: {
      type: "boolean",
      description: [
        "Indicates whether the field input is mandatory, meaning it must be present during creation, and at least one value must be selected.",
        "",
        "@default false"
      ],
      default: () => false
    },
    label: {
      type: "string",
      description: [
        "The field label displayed in the UI.",
        "",
        "By default, it is automatically generated based on the property name assigned to the field.",
        "Example: 'availableSizes' => 'Available sizes'"
      ],
      default: ({ name }) => titleCase(name, false)
    },
    default: {
      type: "string[]",
      description: ["The default field value.", "", "@default []"]
    },
    name: {
      type: "string",
      description: [
        "A string that specifies the `name` for the input controls.",
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
    sortable: {
      type: "boolean",
      description: ["Indicates whether the checkboxes are sortable.", "", "@default false"],
      default: () => false
    },
    overrideType: {
      type: "string",
      description: [
        "A **stringified** TypeScript type used for overriding the automatically generated field value type.",
        "This is particularly handy when field types are unavailable during the initial field declaration.",
        "",
        "Note: This feature is only applicable when declaring the field in a collection."
      ]
    }
  },
  sanitizers: [
    (context) => context.options.required ? context.value : defaultSanitizer(context),
    uniqueArraySanitizer,
    ({ value }) => value.map((v) => isNumber(v) ? v.toString() : v)
  ],
  validators: [
    {
      onCreate: true,
      onUpdate: true,
      validator: (context) => context.options.required && requiredValidator(context)
    },
    arrayValidator,
    ({ __, language, options, value }) => {
      for (const v of value) {
        if (!isString(v)) {
          throw new Error(__(language, "pruvious-server", "Selected values must be strings"));
        } else if (!isKeyOf(options.choices, v)) {
          throw new Error(__(language, "pruvious-server", "Invalid value: '$value'", { value: v }));
        }
      }
    }
  ],
  extractKeywords: ({ options, value }) => isArray(value) ? value.map((v) => {
    const l = options.choices[v]?.trim();
    return l === v ? l : l ? `${l} ${v}` : v;
  }).filter(Boolean).sort().join(" ") : "",
  inputMeta: {
    required: ({ options }) => !!options.required,
    codeComment: ({ options }) => options.description || ""
  }
});
export function vueField(options, additional) {
  return String;
}
export function vueSubfield(options, additional) {
  return String;
}
