import { isNull } from "../utils/common.js";
import { matchesConditionalLogic } from "../utils/conditional-logic.js";
import { isObject, setProperty } from "../utils/object.js";
import { isString } from "../utils/string.js";
export function dbToJsType(type) {
  return type ? type === "TEXT" ? "string" : type === "BOOLEAN" ? "boolean" : "number" : "unknown";
}
export function resolveFieldPopulation(population) {
  return population ? {
    type: isString(population.type) ? { js: population.type, ts: population.type } : {
      js: population.type.js,
      ts: population.type.ts || population.type.js
    },
    populator: population.populator
  } : false;
}
export function defineField(definition) {
  return {
    name: definition.name,
    type: isString(definition.type) ? {
      js: definition.type,
      ts: definition.type,
      db: definition.type === "boolean" ? "BOOLEAN" : definition.type === "number" ? "DECIMAL" : "TEXT"
    } : {
      js: definition.type.js,
      ts: definition.type.ts || definition.type.js,
      db: definition.type.db || (definition.type.js === "boolean" ? "BOOLEAN" : definition.type.js === "number" ? "DECIMAL" : "TEXT")
    },
    default: definition.default || (() => null),
    vueComponent: definition.vueComponent,
    vuePreviewComponent: definition.vuePreviewComponent ?? "",
    options: definition.options,
    sanitizers: definition.sanitizers || [],
    conditionalLogicMatcher: definition.conditionalLogicMatcher || (({ conditionalLogic, definition: definition2, input, name, options }) => {
      if (!matchesConditionalLogic(input, name, conditionalLogic)) {
        setProperty(input, name, definition2.default({ definition: definition2, name, options }));
        return false;
      }
      return true;
    }),
    validators: definition.validators || [],
    population: resolveFieldPopulation(definition.population),
    extractKeywords: definition.extractKeywords || (({ value }) => isObject(value) ? JSON.stringify(value) : isNull(value) ? "" : String(value)),
    serialize: definition.serialize ?? null,
    deserialize: definition.deserialize ?? null,
    inputMeta: {
      type: definition.inputMeta?.type || ((context) => isString(context.definition.type) ? context.definition.type : (isString(context.definition.type.ts) ? context.definition.type.ts : context.definition.type.ts(context)) || context.definition.type.js),
      required: definition.inputMeta?.required || (() => false),
      codeComment: definition.inputMeta?.codeComment || (() => "")
    }
  };
}
