import {
  deepMerge as _deepMerge,
  isKeyOf as _isKeyOf,
  isObject as _isObject,
  objectPick as _objectPick
} from "@antfu/utils";
import { createDefu } from "defu";
import { deleteProperty as _deleteProperty, getProperty as _getProperty, setProperty as _setProperty } from "dot-prop";
import { isArray } from "./array.js";
import { isString, snakeCase } from "./string.js";
export function clearObject(object) {
  if (isArray(object)) {
    object.splice(0, object.length);
  } else if (object && typeof object === "object") {
    for (const property of Object.getOwnPropertyNames(object)) {
      delete object[property];
    }
  }
  return object;
}
export function deepClone(object) {
  if (object === null || typeof object !== "object") {
    return object;
  }
  if (isArray(object)) {
    return object.map((item) => deepClone(item));
  }
  const clone = {};
  for (const key of Object.getOwnPropertyNames(object)) {
    clone[key] = deepClone(object[key]);
  }
  for (const symbol of Object.getOwnPropertySymbols(object)) {
    clone[symbol] = deepClone(object[symbol]);
  }
  return clone;
}
export const deepMerge = _deepMerge;
export function deleteProperty(object, path) {
  const prop = path.replace(/\.([0-9]+)(\.|$)/gm, "[$1]$2");
  if (prop.endsWith("]")) {
    const index = +prop.slice(prop.lastIndexOf("[") + 1, -1);
    const array = _getProperty(object, prop.slice(0, prop.lastIndexOf("[")));
    if (isArray(array)) {
      array.splice(index, 1);
      return true;
    }
    return false;
  }
  return _deleteProperty(object, prop);
}
export function getProperty(object, path) {
  return _getProperty(object, path.replace(/\.([0-9]+)(\.|$)/gm, "[$1]$2"));
}
export function isKeyOf(object, key) {
  return _isKeyOf(object, key);
}
export const isObject = _isObject;
export const mergeDefaults = createDefu((object, key, value) => {
  if (isArray(object[key])) {
    object[key] = value;
    return true;
  }
});
export function objectOmit(object, keys) {
  const newObject = {};
  for (const key of Object.keys(object)) {
    if (!keys.includes(key)) {
      newObject[key] = object[key];
    }
  }
  return newObject;
}
export const objectPick = _objectPick;
export function setProperty(object, path, value) {
  return _setProperty(object, path.replace(/\.([0-9]+)(\.|$)/gm, "[$1]$2"), value);
}
export function snakeCasePropNames(object) {
  for (const { key, value, parent } of walkObject(object)) {
    if (isString(key)) {
      const snakeKey = snakeCase(key);
      if (snakeKey !== key) {
        ;
        parent[snakeKey] = value;
        delete parent[key];
      }
    }
  }
  return object;
}
export function stringifySymbols(object) {
  if (object === null || typeof object !== "object") {
    return object;
  }
  if (isArray(object)) {
    return object.map((item) => stringifySymbols(item));
  }
  const clone = {};
  for (const key of Object.getOwnPropertyNames(object)) {
    clone[key] = stringifySymbols(object[key]);
  }
  for (const symbol of Object.getOwnPropertySymbols(object)) {
    clone[symbol.toString()] = stringifySymbols(object[symbol]);
  }
  return clone;
}
export function* walkObject(object) {
  if (object !== null && typeof object === "object") {
    if (isArray(object)) {
      for (const [key, value] of object.entries()) {
        yield { key, value, parent: object };
        yield* walkObject(value);
      }
    } else {
      for (const key of Object.getOwnPropertyNames(object)) {
        yield { key, value: object[key], parent: object };
        yield* walkObject(object[key]);
      }
      for (const symbol of Object.getOwnPropertySymbols(object)) {
        yield { key: symbol, value: object[symbol], parent: object };
        yield* walkObject(object[symbol]);
      }
    }
  }
}
