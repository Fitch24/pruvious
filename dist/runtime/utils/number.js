import { isNumber as _isNumber } from "@antfu/utils";
export function countDecimals(value) {
  return value.toString().split(".")[1]?.length || 0;
}
export function isInteger(value) {
  return isRealNumber(value) && Number.isInteger(value);
}
export const isNumber = _isNumber;
export function isPositiveInteger(value) {
  return isRealNumber(value) && isInteger(value) && value > 0;
}
export function isRealNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
