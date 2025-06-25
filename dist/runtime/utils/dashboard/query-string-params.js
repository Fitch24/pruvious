import { ref } from "vue";
import { isArray, toArray } from "../array.js";
import { isObject } from "../object.js";
import { encodeQueryString, parseQSArray, parseWhereTokens, tokenize } from "../query-string.js";
import { isString } from "../string.js";
export const opMap = {
  $eq: "=",
  $ne: "!=",
  $gt: ">",
  $gte: ">=",
  $lt: "<",
  $lte: "<=",
  $between: "between",
  $notBetween: "notbetween",
  $in: "in",
  $notIn: "notin",
  $like: "like",
  $notLike: "notlike",
  $iLike: "ilike",
  $notILike: "notilike"
};
export class QueryStringParams {
  selectOption = ref([]);
  whereOption = ref({ $and: [] });
  searchOption = ref([]);
  orderOption = ref([]);
  pageOption = ref(void 0);
  perPageOption = ref(void 0);
  select(fields) {
    this.selectOption.value = toArray(fields);
    return this;
  }
  resetSelect() {
    this.selectOption.value = [];
    return this;
  }
  where(options) {
    this.whereOption.value = options;
    return this;
  }
  resetWhere() {
    this.whereOption.value = { $and: [] };
    return this;
  }
  search(keywords) {
    this.searchOption.value = toArray(keywords);
    return this;
  }
  resetSearch() {
    this.searchOption.value = [];
    return this;
  }
  order(field) {
    this.orderOption.value = toArray(field);
    return this;
  }
  resetOrder() {
    this.orderOption.value = [];
    return this;
  }
  page(page) {
    this.pageOption.value = page;
    return this;
  }
  resetPage() {
    this.pageOption.value = void 0;
    return this;
  }
  perPage(perPage) {
    this.perPageOption.value = perPage;
    return this;
  }
  resetPerPage() {
    this.perPageOption.value = void 0;
    return this;
  }
  resetAll() {
    return this.resetSelect().resetWhere().resetSearch().resetOrder().resetPage().resetPerPage();
  }
  fromString(queryString) {
    const qs = new URLSearchParams(queryString);
    if (qs.has("select")) {
      this.selectOption.value = parseQSArray(qs.get("select")) ?? [];
    } else {
      this.resetSelect();
    }
    if (qs.has("where")) {
      this.whereOption.value = this.parseWhere(qs.get("where"));
    } else {
      this.resetWhere();
    }
    if (qs.has("search")) {
      this.searchOption.value = parseQSArray(qs.get("search")) ?? [];
    } else {
      this.resetSearch();
    }
    if (qs.has("order")) {
      this.orderOption.value = parseQSArray(qs.get("order")) ?? [];
    } else {
      this.resetOrder();
    }
    if (qs.has("page")) {
      this.pageOption.value = parseInt(qs.get("page"));
    } else {
      this.resetPage();
    }
    if (qs.has("perPage")) {
      this.perPageOption.value = parseInt(qs.get("perPage"));
    } else {
      this.resetPerPage();
    }
    return this;
  }
  toString() {
    const qs = new URLSearchParams();
    if (this.selectOption.value.length) {
      qs.set("select", this.selectOption.value.join(","));
    }
    if (JSON.stringify(this.whereOption.value) !== JSON.stringify({ $and: [] })) {
      qs.set("where", this.stringifyWhere());
    }
    if (this.searchOption.value.length) {
      qs.set("search", this.searchOption.value.join(" "));
    }
    if (this.orderOption.value.length) {
      qs.set("order", this.orderOption.value.join(","));
    }
    if (this.pageOption.value) {
      qs.set("page", this.pageOption.value.toString());
    }
    if (this.perPageOption.value) {
      qs.set("perPage", this.perPageOption.value.toString());
    }
    const qsParams = [];
    for (const [key, value] of qs.entries()) {
      qsParams.push(`${key}=${value}`);
    }
    return encodeQueryString(qsParams.join("&"));
  }
  parseWhere(value) {
    const tokens = parseWhereTokens([...tokenize(value.split(""))]);
    const where = this.parseWhereFilters(tokens);
    return { $and: where };
  }
  parseWhereFilters(tokens) {
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
        const rel = token === "some:" ? "$or" : "$and";
        if (isString(token)) {
          token = tokens.shift();
        }
        if (isArray(token)) {
          filters.push({ [rel]: this.parseWhereFilters(token) });
        }
      } else if (isString(token) && !fieldName && !operator && !value) {
        fieldName = token;
      } else if (isArray(token) && fieldName && !operator && !value) {
        if (isString(token[0])) {
          operatorString = token[0];
          const o = operatorString.toLowerCase();
          if (o === "=" || o === "eq") {
            operator = "$eq";
          } else if (o === "!=" || o === "ne") {
            operator = "$ne";
          } else if (o === ">" || o === "gt") {
            operator = "$gt";
            expectedValueType = "numberOrString";
          } else if (o === ">=" || o === "gte") {
            operator = "$gte";
            expectedValueType = "numberOrString";
          } else if (o === "<" || o === "lt") {
            operator = "$lt";
            expectedValueType = "numberOrString";
          } else if (o === "<=" || o === "lte") {
            operator = "$lte";
            expectedValueType = "numberOrString";
          } else if (o === "between") {
            operator = "$between";
            expectedValueType = "numberOrStringTuple";
          } else if (o === "notbetween") {
            operator = "$notBetween";
            expectedValueType = "numberOrStringTuple";
          } else if (o === "in") {
            operator = "$in";
            expectedValueType = "array";
          } else if (o === "notin") {
            operator = "$notIn";
            expectedValueType = "array";
          } else if (o === "like") {
            operator = "$like";
            expectedValueType = "string";
          } else if (o === "notlike") {
            operator = "$notLike";
            expectedValueType = "string";
          } else if (o === "ilike") {
            operator = "$iLike";
            expectedValueType = "string";
          } else if (o === "notilike") {
            operator = "$notILike";
            expectedValueType = "string";
          } else {
            tokens.splice(0, 1);
            clear = true;
          }
        } else {
          tokens.splice(0, 1);
          clear = true;
        }
      } else if (isArray(token) && fieldName && operator && !value) {
        const tokenValue = token[0] ?? "";
        if (isString(tokenValue)) {
          if (expectedValueType === "array") {
            value = parseQSArray(tokenValue);
          } else if (expectedValueType === "numberOrString") {
            value = tokenValue;
          } else if (expectedValueType === "numberOrStringTuple") {
            value = parseQSArray(tokenValue);
          } else if (expectedValueType === "string") {
            value = tokenValue;
          } else if (tokenValue.toLowerCase() === "null") {
            value = null;
          } else {
            value = tokenValue;
          }
        }
        filters.push({ [fieldName]: { [operator]: value } });
        clear = true;
      } else {
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
    return filters;
  }
  stringifyWhere(whereFilter) {
    const where = [];
    for (const [key, value] of Object.entries(whereFilter ?? this.whereOption.value)) {
      if (key === "$and") {
        where.push("[" + value.map((val) => this.stringifyWhere(val)).join(",") + "]");
      } else if (key === "$or") {
        where.push("some:[" + value.map((val) => this.stringifyWhere(val)).join(",") + "]");
      } else if (isObject(value)) {
        for (const [op, val] of Object.entries(value)) {
          where.push(`${key}[${opMap[op] ?? "="}][${val}]`);
        }
      } else {
        where.push(`${key}[=][${value}]`);
      }
    }
    const whereString = where.join(",");
    return whereString.startsWith("[") && whereString.endsWith("]") ? whereString.slice(1, -1) : whereString;
  }
}
