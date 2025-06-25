import {
  isBoolean as _isBoolean,
  isDate as _isDate,
  isNull as _isNull,
  isRegExp as _isRegExp,
  isUndefined as _isUndefined,
  isDef
} from "@antfu/utils";
export const isBoolean = _isBoolean;
export const isDate = _isDate;
export const isDefined = isDef;
export const isNull = _isNull;
export const isFile = (value) => value instanceof File;
export const isRegExp = _isRegExp;
export const isUndefined = _isUndefined;
