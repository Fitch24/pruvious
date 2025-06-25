import {
  primaryLanguage,
  supportedLanguages
} from "#pruvious";
import { collections, fields } from "#pruvious/server";
import { getQuery } from "h3";
import { Op } from "sequelize";
import { dbToJsType } from "../fields/field.definition.js";
import { booleanishSanitizer } from "../sanitizers/booleanish.js";
import { numericSanitizer } from "../sanitizers/numeric.js";
import { isArray, uniqueArray } from "../utils/array.js";
import { isBoolean, isDefined, isUndefined } from "../utils/common.js";
import { getDatabaseDialect } from "../utils/database.js";
import { isInteger, isPositiveInteger, isRealNumber } from "../utils/number.js";
import { deepClone } from "../utils/object.js";
import { parseQSArray, parseWhereTokens, tokenize } from "../utils/query-string.js";
import { __ } from "../utils/server/translate-string.js";
import { extractKeywords, isString } from "../utils/string.js";
export const defaultMultiQueryStringParams = Object.freeze({
  group: [],
  limit: void 0,
  offset: void 0,
  order: [],
  populate: false,
  select: [],
  where: { [Op.and]: [] },
  search: {}
});
export const defaultSingleQueryStringParams = Object.freeze({
  language: primaryLanguage,
  populate: false,
  select: []
});
export function getQueryStringParams(event, collection, options) {
  const qs = options?.queryObject ?? getQuery(event) ?? {};
  const collectionDef = isString(collection) ? collections[collection] : collection;
  const isMultiCollection = collectionDef.mode === "multi";
  const errors = [];
  const params = deepClone(
    isMultiCollection ? defaultMultiQueryStringParams : defaultSingleQueryStringParams
  );
  let operation = options?.operation;
  if (!operation) {
    switch (event.method) {
      case "POST":
        operation = "create";
        break;
      case "GET":
        operation = "read";
        break;
      case "PATCH":
        operation = "update";
        break;
      case "DELETE":
        operation = "delete";
        break;
      default:
        throw new Error(__(event, "pruvious-server", "Unable to determine the request operation"));
    }
  }
  if (isDefined(qs.group) && isMultiCollection && operation === "read") {
    params.group = parseQSArray(qs.group)?.filter((fieldName) => {
      if (collectionDef.fields[fieldName]) {
        if (collectionDef.fields[fieldName].additional?.protected) {
          errors.push(
            __(
              event,
              "pruvious-server",
              options?.customErrorMessages?.protectedField ?? "The field '$field' cannot be queried",
              { field: fieldName }
            )
          );
          return false;
        } else {
          return true;
        }
      } else {
        errors.push(
          __(
            event,
            "pruvious-server",
            options?.customErrorMessages?.nonExistentField ?? "The field '$field' does not exist",
            { field: fieldName }
          )
        );
        return false;
      }
    });
  }
  if (isDefined(qs.language) && !isMultiCollection && (operation === "read" || operation === "update")) {
    const language = qs.language && isString(qs.language) ? qs.language : null;
    if (language && supportedLanguages.includes(language)) {
      params.language = language;
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.invalidLanguage ?? "The language code '$language' is not supported",
          { language }
        )
      );
    }
  }
  if (isDefined(qs.limit) && isMultiCollection && operation === "read") {
    const limit = qs.limit && isString(qs.limit) ? +qs.limit : null;
    if (isInteger(limit) && limit >= 0) {
      params.limit = limit;
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.limitNotNonNegativeInteger ?? "The 'limit' parameter must be a non-negative integer"
        )
      );
    }
  }
  if (isDefined(qs.offset) && isMultiCollection && operation === "read") {
    const offset = qs.offset && isString(qs.offset) ? +qs.offset : null;
    if (isInteger(offset) && offset >= 0) {
      params.offset = offset;
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.offsetNotNonNegativeInteger ?? "The 'offset' parameter must be a non-negative integer"
        )
      );
    }
  }
  if (isDefined(qs.order) && isMultiCollection) {
    const order = parseQSArray(qs.order);
    if (order?.length) {
      params.order = order.map((value) => {
        if (value[0] === ":") {
          const splitted = value.slice(1).split(":");
          const structure = splitted[0];
          const direction = resolveOrderDirection(splitted[1] ?? "asc");
          const search = collectionDef.search;
          if (!search) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.notSearchable ?? "This collection is not searchable"
              )
            );
            return false;
          } else if (!search[structure]) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.nonExistentSearchStructure ?? `The search structure '$structure' does not exist`,
                { structure }
              )
            );
            return false;
          } else if (direction === false) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.invalidOrderDirection ?? `The order direction '$direction' is not valid`,
                { direction }
              )
            );
            return false;
          }
          return [`:${structure}`, direction === "asc" ? "ASC NULLS LAST" : "DESC NULLS LAST"];
        } else {
          const splitted = value.split(":");
          const fieldName = splitted[0];
          const direction = resolveOrderDirection(splitted[1] ?? "asc");
          if (!collectionDef.fields[fieldName]) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.nonExistentField ?? `The field '$field' does not exist`,
                { field: fieldName }
              )
            );
            return false;
          } else if (direction === false) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.invalidOrderDirection ?? `The order direction '${direction}' is not valid`,
                { direction }
              )
            );
            return false;
          } else if (collectionDef.fields[fieldName].additional?.protected) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.protectedField ?? `The field '$field' cannot be queried`,
                { field: fieldName }
              )
            );
            return false;
          }
          return [fieldName, direction === "asc" ? "ASC NULLS LAST" : "DESC NULLS LAST"];
        }
      }).filter(Boolean);
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.emptySelect ?? "At least one field must be included in the 'select' parameter"
        )
      );
    }
  }
  if (isDefined(qs.perPage) && isMultiCollection && operation === "read") {
    const perPage = qs.perPage && isString(qs.perPage) ? +qs.perPage : null;
    if (isPositiveInteger(perPage)) {
      if (isDefined(qs.limit)) {
        errors.push(
          __(
            event,
            "pruvious-server",
            options?.customErrorMessages?.perPageUsedWithLimit ?? "Using both 'perPage' and 'limit' parameters simultaneously is not permitted"
          )
        );
      } else {
        params.limit = perPage;
      }
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.perPageNotPositiveInteger ?? "The 'perPage' parameter must be a positive integer"
        )
      );
    }
  }
  if (isDefined(qs.page) && isMultiCollection && operation === "read") {
    const page = qs.page && isString(qs.page) ? +qs.page : null;
    if (isPositiveInteger(page)) {
      if (isUndefined(qs.perPage) && isUndefined(qs.limit)) {
        errors.push(
          __(
            event,
            "pruvious-server",
            options?.customErrorMessages?.pageWithoutPerPageOrLimit ?? "The 'page' parameter requires either 'perPage' or 'limit' to be present"
          )
        );
      } else if (isDefined(qs.offset)) {
        errors.push(
          __(
            event,
            "pruvious-server",
            options?.customErrorMessages?.pageUsedWithOffset ?? "Using both 'page' and 'offset' parameters simultaneously is not permitted"
          )
        );
      } else if (params.limit) {
        params.offset = (page - 1) * params.limit;
      }
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.pageNotPositiveInteger ?? "The 'page' parameter must be a positive integer"
        )
      );
    }
  }
  if (isDefined(qs.populate)) {
    const populate = booleanishSanitizer({ value: qs.populate });
    if (isBoolean(populate)) {
      params.populate = populate;
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.populateNotBooleanish ?? "The 'populate' parameter must be a booleanish value"
        )
      );
    }
  }
  if (isMultiCollection && operation === "read") {
    const search = Object.entries(qs).filter(([key]) => key === "search" || key.startsWith("search:")).map(([key, value]) => [key === "search" ? "default" : key.replace("search:", ""), value]);
    for (const [structure, value] of search) {
      const structures = collectionDef.search;
      if (structures) {
        if (structures[structure]) {
          const keywordsInput = isArray(value) ? value.join(" ") : isString(value) || isRealNumber(value) || isBoolean(value) ? value.toString() : "";
          params.search[structure] = extractKeywords(keywordsInput);
        } else {
          errors.push(
            __(
              event,
              "pruvious-server",
              options?.customErrorMessages?.nonExistentSearchStructure ?? "The search structure '$structure' does not exist",
              { structure }
            )
          );
        }
      } else {
        errors.push(
          __(
            event,
            "pruvious-server",
            options?.customErrorMessages?.notSearchable ?? "This collection is not searchable"
          )
        );
      }
    }
  }
  params.select = Object.keys(collectionDef.fields);
  if (isDefined(qs.select)) {
    const select = parseQSArray(qs.select);
    if (select?.length) {
      const filtered = select.filter((fieldName) => {
        if (fieldName === "*") {
          return true;
        } else if (collectionDef.fields[fieldName]) {
          if (collectionDef.fields[fieldName].additional?.protected) {
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.protectedField ?? `The field '$field' cannot be queried`,
                { field: fieldName }
              )
            );
            return false;
          } else {
            return true;
          }
        } else {
          errors.push(
            __(
              event,
              "pruvious-server",
              options?.customErrorMessages?.nonExistentField ?? `The field '$field' does not exist`,
              { field: fieldName }
            )
          );
          return false;
        }
      });
      if (!filtered.includes("*")) {
        params.select = filtered;
      }
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.emptySelect ?? "At least one field must be included in the 'select' parameter"
        )
      );
    }
    if (!params.select.length) {
      params.select = ["id"];
    }
  }
  if (isDefined(qs.where) && isMultiCollection && operation !== "create") {
    if (qs.where && (isString(qs.where) || isArray(qs.where))) {
      params.where = parseWhere(qs.where, collectionDef, errors, options, event.context.language);
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.invalidWhere ?? "The 'where' parameter is not valid"
        )
      );
    }
  }
  return { params, errors: uniqueArray(errors) };
}
function resolveOrderDirection(value) {
  const v = value.toLowerCase();
  const a = ["a", "asc", "ascending", "u", "up"];
  const d = ["d", "desc", "descending", "down"];
  return a.includes(v) ? "asc" : d.includes(v) ? "desc" : false;
}
function parseWhere(value, collection, errors, options, contextLanguage) {
  const stringValue = isString(value) ? value : value.join(",");
  const tokens = parseWhereTokens([...tokenize(stringValue.split(""))]);
  const where = parseWhereFilters(tokens, collection, errors, options, contextLanguage);
  return { [Op.and]: where };
}
function parseWhereFilters(tokens, collection, errors, options, contextLanguage) {
  const filters = [];
  let token;
  let fieldName;
  let operator;
  let operatorString;
  let expectedValueType;
  let value;
  while (token = tokens.shift()) {
    let clear = false;
    if (isString(token) && token[0] === "," && !fieldName) {
      token = token.slice(1);
    }
    if (isArray(token) && !fieldName || token === "some:" || token === "every:") {
      const rel = token === "some:" ? Op.or : Op.and;
      if (isString(token)) {
        token = tokens.shift();
      }
      if (isArray(token)) {
        filters.push({ [rel]: parseWhereFilters(token, collection, errors, options, contextLanguage) });
      } else {
        errors.push(
          __(
            contextLanguage,
            "pruvious-server",
            options?.customErrorMessages?.invalidWhere ?? "The 'where' parameter is not valid"
          )
        );
      }
    } else if (isString(token) && !fieldName && !operator && !value) {
      if (collection.fields[token]) {
        if (collection.fields[token].additional?.protected) {
          errors.push(
            __(
              contextLanguage,
              "pruvious-server",
              options?.customErrorMessages?.protectedField ?? "The field '$field' cannot be queried",
              { field: token }
            )
          );
          tokens.splice(0, 2);
        } else {
          fieldName = token;
        }
      } else {
        errors.push(
          __(
            contextLanguage,
            "pruvious-server",
            options?.customErrorMessages?.nonExistentField ?? `The field '$field' does not exist`,
            { field: token }
          )
        );
        tokens.splice(0, 2);
      }
    } else if (isArray(token) && fieldName && !operator && !value) {
      if (isString(token[0])) {
        operatorString = token[0];
        const o = operatorString.toLowerCase();
        const type = dbToJsType(fields[collection.fields[fieldName].type]?.type.db);
        let incompatible = false;
        if (o === "=" || o === "eq") {
          operator = Op.eq;
        } else if (o === "!=" || o === "ne") {
          operator = Op.ne;
        } else if (o === ">" || o === "gt") {
          if (type === "string" || type === "number") {
            operator = Op.gt;
            expectedValueType = "numberOrString";
          } else {
            incompatible = true;
          }
        } else if (o === ">=" || o === "gte") {
          if (type === "string" || type === "number") {
            operator = Op.gte;
            expectedValueType = "numberOrString";
          } else {
            incompatible = true;
          }
        } else if (o === "<" || o === "lt") {
          if (type === "string" || type === "number") {
            operator = Op.lt;
            expectedValueType = "numberOrString";
          } else {
            incompatible = true;
          }
        } else if (o === "<=" || o === "lte") {
          if (type === "string" || type === "number") {
            operator = Op.lte;
            expectedValueType = "numberOrString";
          } else {
            incompatible = true;
          }
        } else if (o === "between") {
          if (type === "string" || type === "number") {
            operator = Op.between;
            expectedValueType = "numberOrStringTuple";
          } else {
            incompatible = true;
          }
        } else if (o === "notbetween") {
          if (type === "string" || type === "number") {
            operator = Op.notBetween;
            expectedValueType = "numberOrStringTuple";
          } else {
            incompatible = true;
          }
        } else if (o === "in") {
          operator = Op.in;
          expectedValueType = "array";
        } else if (o === "notin") {
          operator = Op.notIn;
          expectedValueType = "array";
        } else if (o === "like") {
          operator = Op.like;
          expectedValueType = "string";
        } else if (o === "notlike") {
          operator = Op.notLike;
          expectedValueType = "string";
        } else if (o === "ilike") {
          operator = getDatabaseDialect() === "postgres" ? Op.iLike : Op.like;
          expectedValueType = "string";
        } else if (o === "notilike") {
          operator = getDatabaseDialect() === "postgres" ? Op.notILike : Op.notLike;
          expectedValueType = "string";
        } else {
          errors.push(
            __(
              contextLanguage,
              "pruvious-server",
              options?.customErrorMessages?.invalidWhereOperator ?? "The operator '$operator' is not valid",
              { operator: operatorString }
            )
          );
          tokens.splice(0, 1);
          clear = true;
        }
        if (incompatible) {
          errors.push(
            __(
              contextLanguage,
              "pruvious-server",
              options?.customErrorMessages?.incompatibleWhereOperator ?? "Cannot use operator '$operator' on field $field",
              { operator: operatorString, field: fieldName }
            )
          );
          tokens.splice(0, 1);
          clear = true;
        }
      } else {
        errors.push(
          __(
            contextLanguage,
            "pruvious-server",
            options?.customErrorMessages?.invalidWhere ?? "The 'where' parameter is not valid"
          )
        );
        tokens.splice(0, 1);
        clear = true;
      }
    } else if (isArray(token) && fieldName && operator && !value) {
      const type = dbToJsType(fields[collection.fields[fieldName].type]?.type.db);
      const tokenValue = token[0] ?? "";
      let incompatible = !isString(tokenValue);
      if (!incompatible) {
        if (expectedValueType === "array") {
          const array = parseQSArray(tokenValue);
          if (array) {
            if (type === "boolean") {
              value = array.map((el) => {
                const casted = booleanishSanitizer({ value: el });
                if (!isBoolean(casted)) incompatible = true;
                return casted;
              });
            } else if (type === "number") {
              value = array.map((el) => {
                const casted = numericSanitizer({ value: el });
                if (!isRealNumber(casted)) incompatible = true;
                return casted;
              });
            } else {
              value = array;
            }
          } else {
            incompatible = true;
          }
        } else if (expectedValueType === "numberOrString") {
          if (type === "number") {
            value = numericSanitizer({ value: tokenValue });
            incompatible = !isRealNumber(value);
          } else {
            value = tokenValue;
          }
        } else if (expectedValueType === "numberOrStringTuple") {
          const array = parseQSArray(tokenValue);
          if (array?.length === 2) {
            if (type === "number") {
              value = array.map((el) => {
                const casted = numericSanitizer({ value: el });
                if (!isRealNumber(casted)) incompatible = true;
                return casted;
              });
            } else {
              value = array;
            }
          } else {
            incompatible = true;
          }
        } else if (expectedValueType === "string") {
          if (type === "string") {
            value = tokenValue;
          } else {
            incompatible = true;
          }
        } else if (tokenValue.toLowerCase() === "null") {
          value = null;
        } else if (type === "boolean") {
          value = booleanishSanitizer({ value: tokenValue });
          incompatible = !isBoolean(value);
        } else if (type === "number") {
          value = numericSanitizer({ value: tokenValue });
          incompatible = !isRealNumber(value);
        } else {
          value = tokenValue;
        }
      }
      if (incompatible) {
        errors.push(
          __(
            contextLanguage,
            "pruvious-server",
            options?.customErrorMessages?.incompatibleWhereValue ?? "Cannot use value '$value' for operation '$operation' on field '$field'",
            { value: tokenValue, operation: operatorString, field: fieldName }
          )
        );
      } else {
        filters.push({ [fieldName]: { [operator]: value } });
      }
      clear = true;
    } else {
      errors.push(
        __(
          contextLanguage,
          "pruvious-server",
          options?.customErrorMessages?.invalidWhere ?? "The 'where' parameter is not valid"
        )
      );
      clear = true;
    }
    if (clear) {
      fieldName = void 0;
      operator = void 0;
      operatorString = void 0;
      expectedValueType = void 0;
      value = void 0;
    }
  }
  if (fieldName) {
    errors.push(
      __(
        contextLanguage,
        "pruvious-server",
        options?.customErrorMessages?.invalidWhere ?? "The 'where' parameter is not valid"
      )
    );
  }
  return filters;
}
