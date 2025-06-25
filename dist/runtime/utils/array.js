import { toArray as _toArray, uniq } from "@antfu/utils";
import { clearObject, getProperty } from "./object.js";
import { extractKeywords, isString } from "./string.js";
export const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
export function clearArray(array) {
  return clearObject(array);
}
export function compareArrays(array1, array2) {
  const l1 = uniq(array1).length;
  const l2 = uniq(array2).length;
  return l1 === l2 && l1 === intersectArrays(array1, array2).length;
}
export function diffArrays(array1, array2) {
  return uniq(array1.filter((item) => !array2.includes(item)).concat(array2.filter((item) => !array1.includes(item))));
}
export function intersectArrays(array1, array2) {
  return uniq(array1.filter((value) => array2.includes(value)));
}
export function isArray(array) {
  return Array.isArray(array);
}
export function last(array) {
  return array[array.length - 1];
}
export function searchByKeywords(array, keywords, props) {
  const extractedKeywords = (isString(keywords) ? extractKeywords(keywords) : keywords).map(
    (keyword) => keyword.toLowerCase()
  );
  return array.map((item) => {
    let value = "";
    let score = 0;
    if (isString(props)) {
      value = getProperty(item, props).toLowerCase();
    } else if (isArray(props)) {
      value = props.map((prop) => getProperty(item, prop)).join(" ").toLowerCase();
    } else {
      value = item;
    }
    if (extractedKeywords.length) {
      for (const keyword of extractedKeywords) {
        const index = value.indexOf(keyword);
        if (index === -1) {
          score = 0;
          break;
        } else {
          score += keyword.length / (index + 1);
        }
      }
    } else {
      score = 0.1;
    }
    return { item, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ item }) => item);
}
export function sortNatural(array) {
  return array.sort((a, b) => collator.compare(a, b));
}
export function sortNaturalByProp(array, prop) {
  return array.sort((a, b) => collator.compare(a[prop] ?? "", b[prop] ?? ""));
}
export const toArray = _toArray;
export function next(el, array, prop) {
  const index = prop ? array.findIndex((_el) => _el[prop] === el[prop]) : array.indexOf(el);
  return index === -1 ? array[0] : nth(array, index + 1);
}
export function nth(array, n) {
  return array[nthIndex(array, n)];
}
export function nthIndex(array, n) {
  n = n % array.length;
  n += n < 0 ? array.length : 0;
  return n;
}
export function prev(el, array, prop) {
  const index = prop ? array.findIndex((_el) => _el[prop] === el[prop]) : array.indexOf(el);
  return index === -1 ? last(array) : nth(array, index - 1);
}
export const uniqueArray = uniq;
