import { booleanishSanitizer } from "../../sanitizers/booleanish.js";
import { defaultSanitizer } from "../../sanitizers/default.js";
import { titleCase } from "../../utils/string.js";
import { booleanValidator } from "../../validators/boolean.js";
import { requiredValidator } from "../../validators/required.js";
import { defineField } from "../field.definition.js";
export default defineField({
  name: "checkbox",
  type: "boolean",
  default: ({ options }) => options.default ?? false,
  vueComponent: void 0,
  options: {
    required: {
      type: "boolean",
      description: [
        "Indicates whether the field input is mandatory, requiring its presence during creation, with the value set to `true`.",
        "",
        "@default false"
      ],
      default: () => false
    },
    label: {
      type: "string",
      description: [
        "Text to display on the right side of the input control.",
        "",
        "By default, it is automatically generated based on the property name assigned to the field.",
        "Example: 'darkMode' => 'Dark mode'"
      ],
      default: ({ name }) => titleCase(name, false)
    },
    default: {
      type: "boolean",
      description: ["The default field value.", "", "@default false"]
    },
    name: {
      type: "string",
      description: [
        "A string that specifies the `name` for the input control.",
        "",
        "If not specified, the `name` attribute will be automatically generated."
      ]
    },
    description: {
      type: "string | string[]",
      description: [
        "A brief descriptive text displayed in code comments and in the tooltip when hovering over the field label.",
        "",
        "Use an array to handle line breaks."
      ]
    }
  },
  sanitizers: [
    (context) => context.options.required ? context.value : defaultSanitizer(context),
    booleanishSanitizer
  ],
  validators: [
    {
      onCreate: true,
      onUpdate: true,
      validator: (context) => context.options.required && requiredValidator(context)
    },
    booleanValidator
  ],
  inputMeta: {
    type: "Booleanish",
    required: ({ options }) => !!options.required,
    codeComment: ({ options }) => options.description || ""
  }
});
