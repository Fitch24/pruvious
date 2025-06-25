import { collections } from "#pruvious/server";
import { readBody as _readBody, getHeader, readFormData } from "h3";
import { getModuleOption } from "../instances/state.js";
import { isArray, toArray, uniqueArray } from "../utils/array.js";
import { isObject } from "../utils/object.js";
import { __ } from "../utils/server/translate-string.js";
export async function readInputData(event, collection, options) {
  let operation = options?.operation;
  if (!operation) {
    switch (event.method) {
      case "POST":
        operation = "create";
        break;
      case "PATCH":
        operation = "update";
        break;
      default:
        throw new Error(__(event, "pruvious-server", "Unable to determine the request operation"));
    }
  }
  const body = options?.body ?? await pruviousReadBody(event);
  const data = isArray(body) ? [...body] : isObject(body) ? { ...body } : body;
  const errors = [];
  if (operation === "create") {
    if (isArray(data) && data.every(isObject) || isObject(data)) {
      for (const entry of toArray(data)) {
        for (const fieldName of Object.keys(entry)) {
          if (!collections[collection].fields[fieldName] && (fieldName !== "$file" || !getModuleOption("uploads") || collection !== "uploads")) {
            delete entry[fieldName];
            errors.push(
              __(
                event,
                "pruvious-server",
                options?.customErrorMessages?.nonExistentField ?? "The field '$field' does not exist",
                { field: fieldName }
              )
            );
          }
        }
      }
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.notObjectOrArray ?? "The request body must be either an object with key-value pairs or an array containing key-value objects"
        )
      );
    }
  } else if (operation === "update") {
    if (isObject(data)) {
      for (const fieldName of Object.keys(data)) {
        if (!collections[collection].fields[fieldName]) {
          delete data[fieldName];
          errors.push(
            __(
              event,
              "pruvious-server",
              options?.customErrorMessages?.nonExistentField ?? "The field '$field' does not exist",
              { field: fieldName }
            )
          );
        }
      }
    } else {
      errors.push(
        __(
          event,
          "pruvious-server",
          options?.customErrorMessages?.notObject ?? "The request body must be an object with key-value pairs"
        )
      );
    }
  }
  return { data, errors: uniqueArray(errors) };
}
export async function pruviousReadBody(event) {
  const contentType = getHeader(event, "Content-Type") || "";
  if (contentType === "application/json" || contentType.startsWith("application/x-www-form-urlencoded") || contentType.startsWith("text/")) {
    const body = await _readBody(event);
    return isObject(body) || isArray(body) ? body : {};
  }
  try {
    const formData = await readFormData(event);
    const body = {};
    formData.forEach((value, key) => {
      if (!Reflect.has(body, key)) {
        body[key] = value;
        return;
      }
      if (!Array.isArray(body[key])) {
        body[key] = [body[key]];
      }
      body[key].push(value);
    });
    return body;
  } catch {
  }
  return {};
}
