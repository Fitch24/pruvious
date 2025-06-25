import { isArray } from "./array.js";
import { isUndefined } from "./common.js";
import { getProperty, isObject } from "./object.js";
import { isString } from "./string.js";
export function matchesConditionalLogic(input, fieldPath, conditionalLogic) {
  for (const [key, condition] of Object.entries(conditionalLogic)) {
    if (key === "$every") {
      if (!condition.every((rule) => matchesConditionalLogic(input, fieldPath, rule))) {
        return false;
      }
    } else if (key === "$some") {
      if (!condition.some((rule) => matchesConditionalLogic(input, fieldPath, rule))) {
        return false;
      }
    } else {
      const dependencyPath = new URL(
        key.replace(/(?<!^|\.)\./gim, "/"),
        `http://_/${fieldPath.replaceAll(".", "/")}`
      ).pathname.slice(1).replaceAll("/", ".").replace(/\.$/, "");
      const dependencyValue = getProperty(input, dependencyPath);
      if (isUndefined(dependencyValue)) {
        throw new Error(`The field '${dependencyPath}' is required in the input`);
      }
      if (isObject(condition)) {
        for (const [operator, value] of Object.entries(condition)) {
          let preparedValue = dependencyValue;
          if (operator === "gt" || operator === "gte" || operator === "lt" || operator === "lte") {
            if (isArray(dependencyValue)) {
              preparedValue = dependencyValue.length;
            } else if (typeof dependencyValue !== typeof value) {
              return false;
            }
          } else if (operator === "regexp" && !isString(dependencyValue)) {
            return false;
          }
          if (operator === "eq" && preparedValue !== value || operator === "ne" && preparedValue === value || operator === "gt" && preparedValue <= value || operator === "gte" && preparedValue < value || operator === "lt" && preparedValue >= value || operator === "lte" && preparedValue > value || operator === "regexp" && !new RegExp(value.toString()).test(preparedValue)) {
            return false;
          }
        }
      } else if (dependencyValue !== condition) {
        return false;
      }
    }
  }
  return true;
}
export async function resolveConditionalLogic(record, fields, fieldNamePrefix = "") {
  const resolved = {};
  for (const [fieldName, declaration] of Object.entries(fields)) {
    try {
      resolved[fieldNamePrefix + fieldName] = declaration.additional?.conditionalLogic ? matchesConditionalLogic(record, fieldNamePrefix + fieldName, declaration.additional.conditionalLogic) : true;
      if (declaration.type === "block" && getProperty(record, fieldNamePrefix + fieldName)?.name) {
        const { blocks } = await import("#pruvious/blocks");
        const blockData = getProperty(record, fieldNamePrefix + fieldName);
        Object.assign(
          resolved,
          await resolveConditionalLogic(
            record,
            blocks[blockData.name].fields,
            `${fieldNamePrefix + fieldName}.fields.`
          )
        );
        if (blockData.slots) {
          const slots = blockData.slots;
          for (const slotName of Object.keys(slots)) {
            for (let i = 0; i < slots[slotName].length; i++) {
              Object.assign(
                resolved,
                await resolveConditionalLogic(
                  record,
                  { block: { type: "block", options: {}, additional: {} } },
                  `${fieldNamePrefix + fieldName}.slots.${slotName}.${i}.`
                )
              );
            }
          }
        }
      } else if (declaration.type === "repeater") {
        for (let i = 0; i < getProperty(record, fieldNamePrefix + fieldName).length; i++) {
          Object.assign(
            resolved,
            await resolveConditionalLogic(
              record,
              declaration.options.subfields,
              `${fieldNamePrefix + fieldName}.${i}.`
            )
          );
        }
      }
    } catch (e) {
      resolved[fieldNamePrefix + fieldName] = false;
    }
  }
  return resolved;
}
