import { primaryLanguage } from "#pruvious";
import { collections, fields } from "#pruvious/server";
import { Op, Sequelize } from "sequelize";
import { cache } from "../instances/cache.js";
import { db, opMap, opMapSqlite } from "../instances/database.js";
import { clearPageCache } from "../plugins/page-cache.js";
import { clearArray, isArray, sortNaturalByProp, toArray, uniqueArray } from "../utils/array.js";
import { isDefined, isNull, isUndefined } from "../utils/common.js";
import { getDatabaseDialect } from "../utils/database.js";
import { isFunction } from "../utils/function.js";
import {
  deepClone,
  deleteProperty,
  getProperty,
  isKeyOf,
  isObject,
  objectOmit,
  objectPick,
  setProperty,
  snakeCasePropNames,
  stringifySymbols,
  walkObject
} from "../utils/object.js";
import { _, __ } from "../utils/server/translate-string.js";
import { camelCase, extractKeywords, isString, snakeCase } from "../utils/string.js";
import { resolveCollectionFieldOptions } from "./field-options.resolver.js";
import { query as _query } from "./query.js";
export class QueryBuilder {
  constructor(collection, contextLanguage = primaryLanguage) {
    this.collection = collection;
    this.contextLanguageOption = contextLanguage;
    this.dialect = getDatabaseDialect();
    this.table = snakeCase(collection);
    this.selectAll();
  }
  dialect;
  table;
  selectedFields = [];
  whereOptions = { [Op.and]: [] };
  searchOptions = {};
  orderOptions = [];
  groupOptions = [];
  offsetOption;
  limitOption;
  populateOption = false;
  fallbackOption = true;
  contextLanguageOption;
  /**
   * Apply query string parameters to the current query.
   *
   * @example
   * ```typescript
   * export default defineEventHandler((event) => {
   *   const qs = getQueryStringParams(event, 'products')
   *
   *   if (qs.errors.length) {
   *     setResponseStatus(event, 400)
   *     return qs.errors.join('\n')
   *   }
   *
   *   return query('products').applyQueryStringParams(qs.params).all()
   * })
   * ```
   */
  applyQueryStringParams(params) {
    if (isKeyOf(params, "select")) this.selectedFields = uniqueArray(params.select);
    if (isKeyOf(params, "where")) this.whereOptions = params.where;
    if (isKeyOf(params, "search")) this.searchOptions = params.search;
    if (isKeyOf(params, "group")) this.groupOptions = params.group;
    if (isKeyOf(params, "offset")) this.offsetOption = params.offset;
    if (isKeyOf(params, "limit")) this.limitOption = params.limit;
    if (isKeyOf(params, "order")) this.orderOptions = params.order;
    if (isKeyOf(params, "populate")) this.populateOption = params.populate;
    return this;
  }
  /**
   * Specify the `fields` to be selected and returned from the query.
   *
   * @example
   * ```typescript
   * // Selects the 'name' and 'price' fields from the 'products' collection
   * await query('products').select({ name: true, price: true }).first()
   * // Output: { name: '...', price: '...' }
   * ```
   */
  select(fields2) {
    clearArray(this.selectedFields).push(...isArray(fields2) ? uniqueArray(fields2) : Object.keys(fields2));
    return this;
  }
  /**
   * Select all fields from the queried collection.
   *
   * @example
   * ```typescript
   * // Select all fields from the 'products' collection
   * await query('products').selectAll().first()
   * // Output: { field1: '...', field2: '...', ... }
   * ```
   */
  selectAll() {
    const collection = collections[this.collection];
    clearArray(this.selectedFields).push(...Object.keys(collection.fields));
    return this;
  }
  /**
   * Exclude specified `fields` from the query result.
   *
   * @example
   * ```typescript
   * // Don't return the 'secret' field from the 'products' collection
   * const product = await query('products').deselect({ secret: true }).first()
   * console.log(product.secret)
   * // Output: undefined
   * ```
   */
  deselect(fields2) {
    const fieldsObj = isArray(fields2) ? Object.fromEntries(fields2.map((field) => [field, true])) : fields2;
    this.selectedFields = this.selectedFields.filter((fieldName) => !fieldsObj[fieldName]);
    return this;
  }
  /**
   * Specify a filtering condition for a specific `field` in the database query.
   */
  where(field, operatorOrValue, value) {
    const op = isUndefined(value) ? Op.eq : (this.dialect === "postgres" ? opMap : opMapSqlite)[operatorOrValue];
    if (op) {
      this.addFilter({ [field]: { [op]: isDefined(value) ? value : operatorOrValue } });
    }
    return this;
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: status = 'active'
   * query('products').whereEq('status', 'active')
   *
   * // Alternatives:
   * query('products').where('status', 'active')
   * query('products').where('status', '=', 'active')
   * ```
   */
  whereEq(field, value) {
    return this.where(field, value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: discount != null
   * query('products').whereNe('discount', null)
   *
   * // Alternative:
   * query('products').where('discount', '!=', null)
   * ```
   */
  whereNe(field, value) {
    return this.where(field, "!=", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: price > 100
   * query('products').whereGt('price', 100)
   *
   * // Alternative:
   * query('products').where('price', '>', 100)
   * ```
   */
  whereGt(field, value) {
    return this.where(field, ">", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: price >= 100
   * query('products').whereGte('price', 100)
   *
   * // Alternative:
   * query('products').where('price', '>=', 100)
   * ```
   */
  whereGte(field, value) {
    return this.where(field, ">=", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: price < 100
   * query('products').whereLt('price', 100)
   *
   * // Alternative:
   * query('products').where('price', '<', 100)
   * ```
   */
  whereLt(field, value) {
    return this.where(field, "<", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: price <= 100
   * query('products').whereLte('price', 100)
   *
   * // Alternative:
   * query('products').where('price', '<=', 100)
   * ```
   */
  whereLte(field, value) {
    return this.where(field, "<=", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: price >= 20 and price <= 50
   * query('products').whereBetween('price', [20, 50])
   *
   * // Alternative:
   * query('products').where('price', 'between', [20, 50])
   * ```
   */
  whereBetween(field, values) {
    return this.where(field, "between", values);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: price < 20 or price > 50
   * query('products').whereNotBetween('price', [20, 50])
   *
   * // Alternative:
   * query('products').where('price', 'notBetween', [20, 50])
   * ```
   */
  whereNotBetween(field, values) {
    return this.where(field, "notBetween", values);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: id = 1 or id = 3 or id = 5
   * query('products').whereIn('id', [1, 3, 5])
   *
   * // Alternative:
   * query('products').where('id', 'in', [1, 3, 5])
   * ```
   */
  whereIn(field, values) {
    return this.where(field, "in", values);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: id != 1 and id != 3 and id != 5
   * query('products').whereNotIn('id', [1, 3, 5])
   *
   * // Alternative:
   * query('products').where('id', 'notIn', [1, 3, 5])
   * ```
   */
  whereNotIn(field, values) {
    return this.where(field, "notIn", values);
  }
  whereRecordsIn(field, ids, logic = "some") {
    const subQueries = [];
    for (const id of toArray(ids)) {
      subQueries.push((subQuery) => subQuery.where(field, "like", `%"${id}"%`));
    }
    return subQueries.length ? this[logic](subQueries[0], ...subQueries.slice(1)) : this;
  }
  whereRecordsNotIn(field, ids, logic = "some") {
    const subQueries = [];
    for (const id of toArray(ids)) {
      subQueries.push((subQuery) => subQuery.where(field, "notLike", `%"${id}"%`));
    }
    return subQueries.length ? this[logic](subQueries[0], ...subQueries.slice(1)) : this;
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: name starts with 'P' (case sensitive in PostgreSQL)
   * query('products').whereLike('name', 'P%')
   *
   * // Alternative:
   * query('products').where('name', 'like', 'P%')
   * ```
   */
  whereLike(field, value) {
    return this.where(field, "like", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: name does not start with 'P' (case sensitive in PostgreSQL)
   * query('products').whereNotLike('name', 'P%')
   *
   * // Alternative:
   * query('products').where('name', 'notLike', 'P%')
   * ```
   */
  whereNotLike(field, value) {
    return this.where(field, "notLike", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: name contains 'phone' (case insensitive)
   * query('products').whereILike('name', '%phone%')
   *
   * // Alternative:
   * query('products').where('name', 'iLike', '%phone%')
   * ```
   */
  whereILike(field, value) {
    return this.where(field, "iLike", value);
  }
  /**
   * Specify a filtering condition for a specific field in the database query.
   *
   * @example
   * ```typescript
   * // Apply a filtering condition: name does not contain 'phone' (case insensitive)
   * query('products').whereNotILike('name', '%phone%')
   *
   * // Alternative:
   * query('products').where('name', 'notILike', '%phone%')
   * ```
   */
  whereNotILike(field, value) {
    return this.where(field, "notILike", value);
  }
  /**
   * Apply a logical OR to a set of filtering conditions on the query.
   * At least one of the conditions must be satisfied for a record to be included in the result.
   *
   * @example
   * ```typescript
   * // Apply logical OR: (price < 100) OR (discount >= 0.5)
   * query('products').some(
   *   (products) => products.where('price', '<', 100),
   *   (products) => products.where('discount', '>=', 0.5),
   * )
   * ```
   */
  some(...filters) {
    const original = this.whereOptions;
    const or = { [Op.or]: [] };
    for (const filter of filters) {
      this.whereOptions = { [Op.and]: [] };
      filter(this);
      this.addFilter(this.whereOptions, or);
    }
    this.addFilter(or, original);
    this.whereOptions = original;
    return this;
  }
  /**
   * Apply a logical AND to a set of filtering conditions on the query.
   * All the conditions must be satisfied for a record to be included in the result.
   *
   * Note: This method is redundant since all chained filter operations are implicitly combined using logical AND.
   *
   * @example
   * ```typescript
   * // Apply logical AND: (price > 100) AND (discount >= 0.1)
   * query('products').every(
   *   (products) => products.where('price', '>', 100),
   *   (products) => products.where('status', '>=', 0.1),
   * )
   * ```
   */
  every(...filters) {
    filters.forEach((filter) => filter(this));
    return this;
  }
  /**
   * Perform a search in the queried collection based on the specified `keywords` and search `structure`.
   *
   * Note: The `keywords` are case insensitive.
   *
   * @example
   * ```typescript
   * // Find 'products' by a specific keyword.
   * // The `search` structures are defined in the collection definition.
   * await query('products').search('NVMe SSD').first()
   * // Output: { field1: '...', field2: '...', ... }
   * ```
   */
  search(keywords, structure = "default") {
    const search = collections[this.collection].search;
    if (search && search[structure]) {
      const extracted = extractKeywords(keywords);
      if (extracted.length) {
        ;
        this.searchOptions[structure] = extracted;
      }
    }
    return this;
  }
  /**
   * Set the sorting order for query results based on search relevance within a specific search `structure`.
   * By default, the sorting is in ascending order (`asc`), showing the most relevant results first.
   *
   * You can chain multiple `order` calls to apply multiple sorting criteria.
   * The sorting will be applied in the order they are called.
   *
   * @example
   * ```typescript
   * // Search products in the 'products' collection, sorted by relevance and price (ascending)
   * await query('products').search('NVMe SSD').orderBySearchRelevance().order('price').all()
   *
   * // Alternative:
   * await query('products').search('NVMe SSD').order(':default').order('price').all()
   * ```
   */
  orderBySearchRelevance(structure = "default", direction = "asc") {
    return this.order(`:${structure}`, direction);
  }
  /**
   * Set a sorting order for the query results based on a specific collection field.
   * By default, the sorting is done in ascending order (`asc`).
   *
   * You can chain multiple `order` calls to apply multiple sorting criteria.
   * The sorting will be applied in the order they are called.
   *
   * If the `field` argument starts with a colon (`:`), it is considered a search structure key.
   * For example, `order(':default')` is equivalent to calling the `orderBySearchRelevance()` method.
   *
   * @example
   * ```typescript
   * // Fetch all products from the 'products' collection, sorted by their price in ascending order
   * await query('products').order('price').all()
   *
   * // Fetch the most expensive products first, sorted by their price in descending order
   * await query('products').order('price', 'desc').all()
   * ```
   */
  order(field, direction = "asc") {
    this.orderOptions.push([field, direction === "asc" ? "ASC NULLS LAST" : "DESC NULLS LAST"]);
    return this;
  }
  /**
   * Group the query results based on a specific collection field.
   *
   * You can chain multiple `group` calls to apply multiple grouping criteria.
   * The grouping will be applied in the order they are called.
   *
   * @example
   * ```typescript
   * // Fetch all products from the 'products' collection, grouped by their category
   * await query('products').select({ category: true }).group('category').all()
   * ```
   */
  group(field) {
    this.groupOptions.push(field);
    return this;
  }
  /**
   * Set the offset (starting position) for the query results.
   *
   * @example
   * ```typescript
   * // Fetch the second page of products with 10 products per page from the 'products' collection
   * const records = await query('products').limit(10).offset(10).all()
   *
   * // Alternative:
   * const { records } = await query('products').paginate(2, 10)
   * ```
   */
  offset(offset) {
    this.offsetOption = offset;
    return this;
  }
  /**
   * Set the maximum number of records to be returned by the query.
   *
   * @example
   * ```typescript
   * // Fetch the first 10 products from the 'products' collection
   * const records = await query('products').limit(10).all()
   *
   * // Alternative:
   * const { records } = await query('products').paginate(1, 10)
   * ```
   */
  limit(limit) {
    this.limitOption = limit;
    return this;
  }
  /**
   * Enable field population to retrieve populated field values in the query results.
   *
   * By default, the query builder returns the casted field values without populating related data.
   *
   * @example
   * ```typescript
   * // Without population:
   * await query('products').select({ category: true }).first()
   * // Output: { category: 1 }
   *
   * // With population:
   * await query('products').select({ category: true }).populate().first()
   * // Output: { category: { id: 1, name: 'Electronics' } }
   * ```
   */
  populate() {
    this.populateOption = true;
    return this;
  }
  /**
   * Disable field population to retrieve casted values in the query results.
   *
   * By default, the query builder returns the casted field values without populating related data.
   *
   * @example
   * ```typescript
   * // Without population:
   * await populatedProductsQuery.select({ category: true }).unpopulate().first()
   * // Output: { category: 1 }
   *
   * // With population:
   * await populatedProductsQuery.select({ category: true }).first()
   * // Output: { category: { id: 1, name: 'Electronics' } }
   * ```
   */
  unpopulate() {
    this.populateOption = false;
    return this;
  }
  /**
   * Check whether the query results will be returned with casted or populated field values.
   *
   * @example
   * ```typescript
   * query('products').getFieldValueType() // 'casted'
   * query('products').populate().getFieldValueType() // 'populated'
   * ```
   */
  getFieldValueType() {
    return this.populateOption ? "populated" : "casted";
  }
  setFieldValueType(type) {
    this.populateOption = type === "populated";
    return this;
  }
  /**
   * Revalidate fields after fetching from the database and set their values to default if validation fails.
   * This prevents returning invalid existing data in case field or collection definitions are updated.
   *
   * By default, fallback validation is enabled.
   */
  fallback() {
    this.fallbackOption = true;
    return this;
  }
  /**
   * Disable field validation after fetching, potentially speeding up database queries.
   * Beware that this may result in invalid data if field or collection definitions change.
   *
   * By default, fallback validation is enabled.
   */
  noFallback() {
    this.fallbackOption = false;
    return this;
  }
  /**
   * Set the language for the validation messages returned by the query builder.
   *
   * By default, the language is set to the language code defined in the module option `language.primary`.
   */
  contextLanguage(language) {
    this.contextLanguageOption = language;
    return this;
  }
  /**
   * Get a copy of the current query builder options.
   */
  getOptions() {
    return deepClone({
      table: this.table,
      selectedFields: this.selectedFields,
      whereOptions: this.whereOptions,
      searchOptions: this.searchOptions,
      orderOptions: this.orderOptions,
      groupOptions: this.groupOptions,
      offsetOption: this.offsetOption,
      limitOption: this.limitOption,
      populateOption: this.populateOption,
      fallbackOption: this.fallbackOption,
      contextLanguageOption: this.contextLanguageOption
    });
  }
  /**
   * Create a new query builder with the same state as this one.
   */
  clone() {
    const query = new QueryBuilder(this.collection);
    for (const [key, value] of Object.entries(this.getOptions())) {
      query[key] = value;
    }
    return query;
  }
  /**
   * Reset the current `WHERE` clause options of the query.
   */
  clearWhere() {
    this.whereOptions = { [Op.and]: [] };
    return this;
  }
  /**
   * Reset the current search options of the query.
   */
  clearSearch() {
    this.searchOptions = {};
    return this;
  }
  /**
   * Reset the current `ORDER BY` clause options of the query.
   */
  clearOrder() {
    this.orderOptions = [];
    return this;
  }
  /**
   * Reset the current `GROUP BY` clause options of the query.
   */
  clearGroup() {
    this.groupOptions = [];
    return this;
  }
  /**
   * Reset the current `OFFSET` clause option of the query.
   */
  clearOffset() {
    this.offsetOption = void 0;
    return this;
  }
  /**
   * Reset the current `LIMIT` clause option of the query.
   */
  clearLimit() {
    this.limitOption = void 0;
    return this;
  }
  /**
   * Reset all query builder options to their default values.
   */
  reset() {
    return this.selectAll().clearWhere().clearSearch().clearOrder().clearGroup().clearOffset().clearLimit().unpopulate().fallback().contextLanguage(primaryLanguage);
  }
  /**
   * Retrieve the number of records in the queried collection.
   *
   * @example
   * ```typescript
   * // Get the number of records in the 'products' collection
   * await query('products').count()
   * // Output: 1337
   * ```
   */
  async count() {
    const result = await (await db()).model(this.table).count(await this.applySequelizeOptions(["group", "where"]));
    return this.groupOptions.length ? result.length : result[0]?.count ?? 0;
  }
  /**
   * Check whether there is at least one record that matches the current query.
   *
   * @example
   * ```typescript
   * // Check if there are products with prices greater than 100
   * await query('products').whereGt('price', 100).exists()
   * // Output: true
   * ```
   */
  async exists() {
    return await this.count() > 0;
  }
  /**
   * Check whether there are no records that match the current query.
   *
   * @example
   * ```typescript
   * // Check if there are no products with zero prices
   * await query('products').where('price', 0).notExists()
   * // Output: true
   * ```
   */
  async notExists() {
    return await this.count() === 0;
  }
  /**
   * Fetch all records from the queried collection.
   *
   * @example
   * ```typescript
   * // Fetch all records from the 'products' collection
   * await query('products').all()
   * // Output: [{ field1: '...', field2: '...', ... }, { field1: '...', field2: '...', ... }, ...]
   * ```
   */
  async all() {
    const start = performance.now();
    const key = this.generateCacheKey("all");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const records = await (await db()).model(this.table).findAll({ ...await this.applySequelizeOptions(), raw: true });
    for (const record of records) {
      this.castRecord(record);
    }
    for (const record of records) {
      await this.validateAndFallbackRecordsAfterFetch(record, records);
    }
    if (this.populateOption) {
      for (const record of records) {
        await this.populateRecord(record);
      }
    }
    if (!this.hasNonCachedFieldInSelectOrderOrGroup() && !this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, records, start);
    }
    return records;
  }
  /**
   * Retrieve all records from the queried collection along with the total count of records.
   *
   * @example
   * ```typescript
   * // Fetch the first 2 records from the 'products' collection with count
   * await query('products').limit(2).allWithCount()
   * // Output: { count: 1337, records: [{ field1: '...', field2: '...', ... }, { field1: '...', field2: '...', ... }] }
   * ```
   */
  async allWithCount() {
    const start = performance.now();
    const key = this.generateCacheKey("allWithCount");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const count = await this.count();
    const records = await (await db()).model(this.table).findAll({ ...await this.applySequelizeOptions(), raw: true });
    for (const record of records) {
      this.castRecord(record);
    }
    for (const record of records) {
      await this.validateAndFallbackRecordsAfterFetch(record, records);
    }
    if (this.populateOption) {
      for (const record of records) {
        await this.populateRecord(record);
      }
    }
    const result = { count, records };
    if (!this.hasNonCachedFieldInSelectOrderOrGroup() && !this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, result, start);
    }
    return result;
  }
  /**
   * Retrieve a specific page of records along with pagination-related information.
   *
   * @example
   * ```typescript
   * // Fetch the first page with 10 records per page from the 'products' collection
   * await query('products').paginate(1, 10)
   * // Output: { currentPage: 1, lastPage: 134, perPage: 10, records: [...], total: 1337 }
   * ```
   */
  async paginate(page, perPage) {
    const start = performance.now();
    const key = this.generateCacheKey("paginate");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const offset = (page - 1) * perPage;
    const { count, records } = await this.limit(perPage).offset(offset).allWithCount();
    const lastPage = perPage ? Math.max(1, Math.ceil(count / perPage)) : 1;
    const result = { currentPage: page, lastPage, perPage, records, total: count };
    if (!this.hasNonCachedFieldInSelectOrderOrGroup() && !this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, result, start);
    }
    return result;
  }
  /**
   * Fetch the first record from the queried collection.
   *
   * @example
   * ```typescript
   * // Fetch the first record from the 'products' collection
   * await query('products').first()
   * // Output: { field1: '...', field2: '...', ... }
   * ```
   */
  async first() {
    const start = performance.now();
    const key = this.generateCacheKey("first");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const record = await (await db()).model(this.table).findOne({ ...await this.applySequelizeOptions(), raw: true });
    if (record) {
      this.castRecord(record);
      await this.validateAndFallbackRecordsAfterFetch(record);
      if (this.populateOption) {
        await this.populateRecord(record);
      }
    }
    if (!this.hasNonCachedFieldInSelectOrderOrGroup() && !this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, record, start);
    }
    return record;
  }
  /**
   * Retrieve the minimum value of a specific field in the queried collection.
   *
   * @example
   * ```typescript
   * // Find the minimum price among products
   * await query('products').min('price')
   * // Output: 0.36
   * ```
   */
  async min(field) {
    const start = performance.now();
    const key = this.generateCacheKey("min");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const min = await (await db()).model(this.table).min(field, await this.applySequelizeOptions(["where"]));
    if (!this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, min, start);
    }
    return min;
  }
  /**
   * Retrieve the maximum value of a specific field in the queried collection.
   *
   * @example
   * ```typescript
   * // Find the maximum price among products
   * await query('products').max('price')
   * // Output: 9001
   * ```
   */
  async max(field) {
    const start = performance.now();
    const key = this.generateCacheKey("max");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const max = await (await db()).model(this.table).max(field, await this.applySequelizeOptions(["where"]));
    if (!this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, max, start);
    }
    return max;
  }
  /**
   * Retrieve the sum of a specific numeric field in the queried collection.
   *
   * @example
   * ```typescript
   * // Calculate the total quantity of all products
   * await query('products').sum('quantity')
   * // Output: 5417
   * ```
   */
  async sum(field) {
    const start = performance.now();
    const key = this.generateCacheKey("sum");
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const sum = await (await db()).model(this.table).sum(field, await this.applySequelizeOptions(["where"]));
    if (!this.hasNonCachedFieldInWhere()) {
      await this.storeInCache(key, sum, start);
    }
    return sum ?? 0;
  }
  /**
   * Validate the `input` data of a record.
   *
   * @returns A Promise that resolves to an object containing validation errors for fields with failed validation.
   */
  async validate(input, operation, allInputs, skipFields) {
    const errors = {};
    for (const fieldName of this.getOperableFields(input, operation)) {
      if (skipFields?.includes(fieldName)) {
        continue;
      }
      const declaration = collections[this.collection].fields[fieldName];
      if (declaration) {
        const definition = fields[declaration.type];
        if (definition) {
          for (const validator of [...definition.validators, ...declaration.additional?.validators ?? []]) {
            try {
              if (isFunction(validator) || operation === "create" && validator.onCreate || operation === "read" && validator.onRead || operation === "update" && validator.onUpdate) {
                await (isFunction(validator) ? validator : validator.validator)({
                  _,
                  __,
                  allInputs,
                  collection: collections[this.collection],
                  collections,
                  definition,
                  input,
                  language: this.contextLanguageOption,
                  name: fieldName,
                  operation,
                  options: resolveCollectionFieldOptions(
                    this.collection,
                    declaration.type,
                    fieldName,
                    declaration.options,
                    fields
                  ),
                  value: input[fieldName],
                  currentQuery: this,
                  query: _query,
                  errors,
                  fields
                });
              }
            } catch (e) {
              errors[fieldName] = e.message;
              break;
            }
          }
        }
      }
    }
    return errors;
  }
  /**
   * Create a new record in the queried collection with the provided `input` data.
   *
   * @returns A Promise that resolves to a `CreateResult` object.
   *          If the creation is successful, the `record` property will contain the created record.
   *          If there are any field validation errors, they will be available in the `errors` property.
   *          The `message` property may contain an optional error message if there are issues during the database query.
   *
   * @example
   * ```typescript
   * const result = await query('products').create({
   *   name: 'Magical Wand',
   *   price: 19.99,
   *   category: 2,
   *   description: 'A powerful wand for all your wizarding needs!',
   * })
   *
   * if (result.success) {
   *   console.log('Product created successfully:', result.record)
   * } else {
   *   console.error('Product creation failed:', result.errors)
   * }
   * ```
   */
  async create(input) {
    input = input ?? {};
    if (!isObject(input)) {
      return { success: false, errors: {}, message: __(this.contextLanguageOption, "pruvious-server", "Invalid input") };
    }
    if (collections[this.collection].translatable && isString(input.translations)) {
      await this.fillNonTranslatableFields(input, input.translations);
    }
    const prepared = this.prepareInput(input, "create");
    const sanitized = await this.sanitize(prepared, "create");
    const conditionalLogicResults = this.applyConditionalLogic(sanitized);
    if (Object.keys(conditionalLogicResults.errors).length) {
      return { success: false, errors: conditionalLogicResults.errors };
    }
    const validationErrors = await this.validate(sanitized, "create", void 0, conditionalLogicResults.failed);
    if (Object.keys(validationErrors).length) {
      return { success: false, errors: validationErrors };
    }
    const now = Date.now();
    if (collections[this.collection].createdAtField) {
      sanitized[collections[this.collection].createdAtField] = now;
    }
    if (collections[this.collection].updatedAtField) {
      sanitized[collections[this.collection].updatedAtField] = now;
    }
    try {
      const record = (await (await db()).model(this.table).create(this.serializeInput(sanitized))).dataValues;
      this.castRecord(record);
      const recordId = record.id;
      for (const fieldName of Object.keys(record).filter((key) => !this.selectedFields.includes(key))) {
        delete record[fieldName];
      }
      await this.validateAndFallbackRecordsAfterCreate(record);
      if (this.populateOption) {
        await this.populateRecord(record);
      }
      if (collections[this.collection].search) {
        await cache();
        setTimeout(() => this.buildSearchKeywords(recordId).then(() => this.clearCache("onCreate")));
      }
      await this.clearCache("onCreate");
      return { success: true, record };
    } catch (e) {
      return { success: false, errors: {}, message: e.message };
    }
  }
  /**
   * Create multiple records in the collection based on the provided `input` array.
   * Each `input` element corresponds to a record to be created.
   *
   * @returns A Promise that resolves to a `CreateManyResult` object.
   *          If successful, the created records will be available in the `records` property.
   *          If any input has validation errors, the `errors` property will contain an array of error objects at the corresponding index.
   *          If there are no errors for a particular input, the value at that index will be `null`.
   *          The `message` property may contain an optional error message for any database query issues.
   *
   * Note: If any input fails validation, no records will be created.
   *
   * @example
   * ```typescript
   * const result = await query('products').createMany([
   *   { name: 'Product 1', price: 10 },
   *   { name: 'Product 2', price: 20 },
   *   { name: 'Product 3', price: 'Invalid Price' }, // <- Error
   * ])
   *
   * if (result.success) {
   *   console.log('Records created:', result.records)
   * } else {
   *   console.log('Errors:', result.errors) // [null, null, { price: 'Invalid input type' }]
   * }
   * ```
   */
  async createMany(input) {
    input = input ?? [];
    if (!isArray(input) || !input.every(isObject)) {
      return { success: false, errors: [], message: __(this.contextLanguageOption, "pruvious-server", "Invalid input") };
    }
    const sanitized = [];
    const errors = [];
    for (const entry of input) {
      if (collections[this.collection].translatable && isString(entry.translations)) {
        await this.fillNonTranslatableFields(entry, entry.translations);
      }
      const preparedEntry = this.prepareInput(entry, "create");
      const sanitizedEntry = await this.sanitize(preparedEntry, "create");
      sanitized.push(sanitizedEntry);
    }
    for (const sanitizedEntry of sanitized) {
      const conditionalLogicResults = this.applyConditionalLogic(sanitizedEntry);
      if (Object.keys(conditionalLogicResults.errors).length) {
        errors.push(conditionalLogicResults.errors);
      } else {
        const validationErrors = await this.validate(
          sanitizedEntry,
          "create",
          sanitized,
          conditionalLogicResults.failed
        );
        errors.push(Object.keys(validationErrors).length ? validationErrors : null);
      }
    }
    if (errors.some(Boolean)) {
      return { success: false, errors };
    }
    const now = Date.now();
    if (collections[this.collection].createdAtField) {
      for (const sanitizedEntry of sanitized) {
        sanitizedEntry[collections[this.collection].createdAtField] = now;
      }
    }
    if (collections[this.collection].updatedAtField) {
      for (const sanitizedEntry of sanitized) {
        sanitizedEntry[collections[this.collection].updatedAtField] = now;
      }
    }
    try {
      const results = await (await db()).model(this.table).bulkCreate(sanitized.map((input2) => this.serializeInput(input2)));
      const records = results.map(({ dataValues }) => dataValues);
      const buildSearchKeywords = [];
      for (const record of records) {
        this.castRecord(record);
        const recordId = record.id;
        for (const fieldName of Object.keys(record).filter((key) => !this.selectedFields.includes(key))) {
          delete record[fieldName];
        }
        await this.validateAndFallbackRecordsAfterCreate(record, records);
        if (this.populateOption) {
          await this.populateRecord(record);
        }
        if (collections[this.collection].search) {
          buildSearchKeywords.push(new Promise((resolve) => this.buildSearchKeywords(recordId).then(resolve)));
        }
      }
      if (buildSearchKeywords.length) {
        await cache();
        setTimeout(() => Promise.all(buildSearchKeywords).then(() => this.clearCache("onCreate")));
      }
      if (records.length) {
        await this.clearCache("onCreate");
      }
      return { success: true, records };
    } catch (e) {
      return { success: false, errors: Array(input.length).fill(null), message: e.message };
    }
  }
  /**
   * Update existing records in the queried collection based on the specified conditions.
   *
   * @returns A Promise that resolves to an `UpdateResult` object.
   *          If successful, the updated records will be available in the `records` property.
   *          If there are any field validation errors, they will be available in the `errors` property.
   *          The `message` property may contain an optional error message if there are issues during the database query.
   *
   * @example
   * ```typescript
   * const result = await query('products').where('id', 47).update({
   *   name: 'Updated Product',
   *   price: 15,
   *   category: 3,
   *   description: 'This product has been updated!',
   * })
   *
   * if (result.success) {
   *   console.log('Records updated:', result.records)
   * } else {
   *   console.error('Update failed:', result.errors)
   * }
   * ```
   */
  async update(input) {
    input = input ?? {};
    if (!isObject(input)) {
      return { success: false, errors: {}, message: __(this.contextLanguageOption, "pruvious-server", "Invalid input") };
    }
    const prepared = this.prepareInput(input, "update");
    const sanitized = await this.sanitize(prepared, "update");
    const conditionalLogicResults = this.applyConditionalLogic(sanitized);
    if (Object.keys(conditionalLogicResults.errors).length) {
      return { success: false, errors: conditionalLogicResults.errors };
    }
    const validationErrors = await this.validate(sanitized, "update", void 0, conditionalLogicResults.failed);
    if (Object.keys(validationErrors).length) {
      return { success: false, errors: validationErrors };
    }
    if (collections[this.collection].updatedAtField) {
      sanitized[collections[this.collection].updatedAtField] = Date.now();
    }
    try {
      return {
        success: true,
        records: await this.updateOrDelete("update", async (buildSearchKeywordsRecordIds) => {
          await (await db()).model(this.table).update(this.serializeInput(sanitized), await this.applySequelizeOptions(["where"]));
          if (collections[this.collection].translatable) {
            buildSearchKeywordsRecordIds.push(...await this.syncNonTranslatableFields(sanitized));
          }
        })
      };
    } catch (e) {
      return { success: false, errors: {}, message: e.message };
    }
  }
  /**
   * Delete records from the queried collection based on the specified conditions.
   *
   * @returns A Promise that resolves to an array containing the deleted records.
   *
   * @example
   * ```typescript
   * await query('products').select({ id: true }).where('category', 5).delete()
   * // Output: [{ id: 30 }, { id: 144 }, { id: 145 }]
   * ```
   */
  async delete() {
    return this.updateOrDelete(
      "delete",
      async () => await (await db()).model(this.table).destroy(await this.applySequelizeOptions(["where"]))
    );
  }
  async applySequelizeOptions(pick = [
    "attributes",
    "group",
    "limit",
    "offset",
    "order",
    "where"
  ]) {
    const options = {};
    for (const option of pick) {
      if (option === "attributes") {
        options.attributes = this.selectedFields.map(snakeCase);
      } else if (option === "limit") {
        options.limit = this.limitOption;
      } else if (option === "offset") {
        options.offset = this.offsetOption;
      } else if (option === "group") {
        options.group = this.groupOptions.filter((fieldName) => collections[this.collection].fields[fieldName]).map(snakeCase);
      } else if (option === "order") {
        options.order = [];
        for (const [fieldName, direction] of this.orderOptions) {
          if (fieldName[0] === ":") {
            const search = collections[this.collection].search;
            const structure = fieldName.slice(1);
            const keywords = this.searchOptions[structure];
            if (search && search[structure] && keywords) {
              const snakeStructure = snakeCase(structure);
              options.attributes ||= [];
              for (const [i, keyword] of keywords.entries()) {
                const _keyword = (await db()).escape(keyword);
                const alias = Sequelize.literal(
                  this.dialect === "postgres" ? `POSITION(${_keyword} in "_search_${snakeStructure}") AS "__match_${snakeStructure}_${i}"` : `INSTR("_search_${snakeStructure}", ${_keyword}) AS "__match_${snakeStructure}_${i}"`
                );
                if (!options.attributes.includes(alias)) {
                  options.attributes.push(alias);
                }
                options.order.push(Sequelize.literal(`__match_${snakeStructure}_${i} ${direction}`));
              }
            }
          } else if (collections[this.collection].fields[fieldName]) {
            options.order.push([snakeCase(fieldName), direction]);
          }
        }
      } else if (option === "where") {
        options.where = snakeCasePropNames(deepClone(this.whereOptions));
        for (const [structure, keywords] of Object.entries(this.searchOptions)) {
          const snakeStructure = snakeCase(structure);
          const op = Object.getOwnPropertySymbols(options.where)[0];
          for (const keyword of keywords) {
            const _keyword = (await db()).escape(keyword);
            options.where[op].push(
              Sequelize.literal(
                this.dialect === "postgres" ? `POSITION(${_keyword} in "_search_${snakeStructure}") > 0` : `INSTR("_search_${snakeStructure}", ${_keyword}) > 0`
              )
            );
          }
        }
      }
    }
    return options;
  }
  addFilter(filter, to) {
    const target = to || this.whereOptions;
    const op = Object.getOwnPropertySymbols(target)[0];
    target[op].push(filter);
  }
  serializeInput(input) {
    const serialized = {};
    for (const [fieldName, value] of Object.entries(input)) {
      const declaration = collections[this.collection].fields[fieldName];
      const definition = declaration ? fields[declaration.type] : null;
      if (definition?.serialize) {
        serialized[snakeCase(fieldName)] = definition.serialize(value);
      } else {
        serialized[snakeCase(fieldName)] = value && typeof value === "object" ? JSON.stringify(value) : value;
      }
    }
    return serialized;
  }
  async buildSearchKeywords(id) {
    const collectionSearch = collections[this.collection].search;
    if (collectionSearch) {
      const castedRecord = await this.clone().reset().where("id", id).first();
      if (!castedRecord) {
        return;
      }
      let populatedRecord = null;
      const attributes = {};
      for (const [structure, search] of Object.entries(collectionSearch)) {
        const keywords = [];
        for (const entry of search) {
          let extracted = "";
          if (isString(entry)) {
            extracted = (await fields[collections[this.collection].fields[entry].type].extractKeywords({
              collection: collections[this.collection],
              collections,
              definition: fields[collections[this.collection].fields[entry].type],
              fieldValueType: "casted",
              fields,
              options: resolveCollectionFieldOptions(
                this.collection,
                collections[this.collection].fields[entry].type,
                entry,
                collections[this.collection].fields[entry].options,
                fields
              ),
              record: castedRecord,
              value: castedRecord[entry]
            })).trim();
          } else {
            if (entry.fieldValueType === "populated" && !populatedRecord) {
              populatedRecord = { ...castedRecord };
              await this.populateRecord(populatedRecord);
            }
            const record = entry.fieldValueType === "populated" ? populatedRecord : castedRecord;
            const context = {
              collection: collections[this.collection],
              collections,
              definition: fields[collections[this.collection].fields[entry.field].type],
              fieldValueType: entry.fieldValueType ?? "casted",
              fields,
              options: resolveCollectionFieldOptions(
                this.collection,
                collections[this.collection].fields[entry.field].type,
                entry.field,
                collections[this.collection].fields[entry.field].options,
                fields
              ),
              record,
              value: record[entry.field]
            };
            if (entry.extractKeywords) {
              extracted = (await entry.extractKeywords(context)).trim();
            } else {
              extracted = (await fields[collections[this.collection].fields[entry.field].type].extractKeywords(context)).trim();
            }
            if (entry.reserve) {
              extracted = extracted.padEnd(entry.reserve, " ");
            }
          }
          keywords.push(extracted);
        }
        attributes[`_search_${snakeCase(structure)}`] = keywords.filter(Boolean).join(" ").toLowerCase();
      }
      await (await db()).model(this.table).update(attributes, { where: { id } });
    }
  }
  castRecord(record) {
    for (const [fieldName, value] of Object.entries(record)) {
      if (fieldName.includes("_")) {
        if (fieldName[0] !== "_") {
          record[camelCase(fieldName)] = value;
        }
        delete record[fieldName];
      }
    }
    for (const fieldName of this.selectedFields) {
      const declaration = collections[this.collection].fields[fieldName];
      const definition = declaration ? fields[declaration.type] : null;
      if (definition) {
        if (definition.deserialize) {
          try {
            record[fieldName] = definition.deserialize(record[fieldName]);
          } catch {
            record[fieldName] = null;
          }
        } else if (definition.type.js === "boolean" && (record[fieldName] === 0 || record[fieldName] === 1)) {
          record[fieldName] = !!record[fieldName];
        } else if (definition.type.js === "number" && isString(record[fieldName])) {
          record[fieldName] = +record[fieldName];
        } else if (definition.type.js === "object" && isString(record[fieldName])) {
          try {
            record[fieldName] = JSON.parse(record[fieldName]);
          } catch {
            record[fieldName] = null;
          }
        }
      }
    }
  }
  async validateAndFallbackRecordsAfterCreate(record, allRecords) {
    if (this.fallbackOption) {
      for (const fieldName in record) {
        const declaration = collections[this.collection].fields[fieldName];
        const definition = fields[declaration.type];
        for (const validator of [...definition.validators, ...declaration.additional?.validators ?? []]) {
          if (!isFunction(validator) && !validator.onCreate && validator.onRead) {
            const options = resolveCollectionFieldOptions(
              this.collection,
              declaration.type,
              fieldName,
              declaration.options,
              fields
            );
            try {
              await validator.validator({
                _,
                __,
                allInputs: allRecords,
                collection: collections[this.collection],
                collections,
                definition,
                input: record,
                language: this.contextLanguageOption,
                name: fieldName,
                operation: "read",
                options,
                currentQuery: this,
                query: _query,
                value: record[fieldName],
                errors: {},
                fields
              });
            } catch (e) {
              record[fieldName] = definition.default({ definition, name: fieldName, options });
              break;
            }
          }
        }
      }
    }
  }
  async validateAndFallbackRecordsAfterFetch(record, allRecords) {
    if (this.fallbackOption) {
      const errors = await this.validate(record, "read", allRecords);
      const filterArrays = {};
      for (const fieldPath of Object.keys(errors)) {
        const declaration = getProperty(
          collections[this.collection].fields,
          fieldPath.replace(/\.([0-9]+)\./g, ".options.subfields.")
        );
        if (isObject(declaration) && declaration.type) {
          const definition = fields[declaration.type];
          if (definition && declaration.type !== "block") {
            setProperty(
              record,
              fieldPath,
              definition.default({
                definition,
                name: fieldPath,
                options: resolveCollectionFieldOptions(
                  this.collection,
                  declaration.type,
                  fieldPath,
                  declaration.options,
                  fields
                )
              })
            );
          } else if (/\.[0-9]+$/.test(fieldPath)) {
            const parentPath = fieldPath.split(".").slice(0, -1).join(".");
            const value = getProperty(record, parentPath);
            if (isArray(value)) {
              filterArrays[parentPath] = value;
            }
          } else if (!/\.[a-z_$][a-z0-9_$]*\.fields\./i.test) {
            deleteProperty(record, fieldPath);
          }
        } else if (/\.[0-9]+$/.test(fieldPath)) {
          const parentPath = fieldPath.split(".").slice(0, -1).join(".");
          const value = getProperty(record, parentPath);
          if (isArray(value)) {
            filterArrays[parentPath] = value;
          }
        } else if (!/\.[a-z_$][a-z0-9_$]*\.fields\./i.test) {
          deleteProperty(record, fieldPath);
        }
      }
      for (const [fieldPath, value] of sortNaturalByProp(Object.entries(filterArrays), "0").reverse()) {
        setProperty(
          record,
          fieldPath,
          value.filter((v) => !isNull(v))
        );
      }
    }
  }
  async populateRecord(record) {
    for (const fieldName of this.selectedFields) {
      const declaration = collections[this.collection].fields[fieldName];
      const definition = declaration ? fields[declaration.type] : null;
      const population = declaration.additional?.population ?? definition?.population;
      if (definition && population) {
        record[fieldName] = await population.populator({
          value: record[fieldName],
          definition,
          name: fieldName,
          options: resolveCollectionFieldOptions(
            this.collection,
            declaration.type,
            fieldName,
            declaration.options,
            fields
          ),
          currentQuery: this,
          query: _query,
          fields
        });
      }
    }
  }
  async fillNonTranslatableFields(input, translations) {
    let relatedRecord = null;
    for (const fieldName of Object.keys(collections[this.collection].fields)) {
      if (collections[this.collection].fields[fieldName]?.additional?.translatable === false) {
        if (!relatedRecord) {
          relatedRecord = await (await db()).model(this.table).findOne({ where: { translations }, raw: true });
          if (relatedRecord) {
            this.castRecord(relatedRecord);
            await this.validateAndFallbackRecordsAfterFetch(relatedRecord);
          } else {
            return;
          }
        }
        input[fieldName] = relatedRecord[fieldName];
      }
    }
  }
  async syncNonTranslatableFields(sanitized) {
    const input = {};
    for (const [fieldName, fieldValue] of Object.entries(sanitized)) {
      if (collections[this.collection].fields[fieldName]?.additional?.translatable === false) {
        input[fieldName] = fieldValue;
      }
    }
    if (Object.keys(input).length) {
      const relatedRecords = await (await db()).model(this.table).findAll({
        attributes: ["id", "translations"],
        ...await this.applySequelizeOptions(["where"]),
        raw: true
      });
      if (relatedRecords.length) {
        await (await db()).model(this.table).update(this.serializeInput(input), {
          where: { translations: { [Op.in]: uniqueArray(relatedRecords.map(({ translations }) => translations)) } }
        });
        return relatedRecords.map(({ id }) => id);
      }
    }
    return [];
  }
  prepareInput(input, operation) {
    return objectOmit(
      objectPick(input, Object.keys(collections[this.collection].fields)),
      operation === "update" ? this.getImmutableFields() : []
    );
  }
  getImmutableFields() {
    return Object.keys(collections[this.collection].fields).filter(
      (fieldName) => collections[this.collection].fields[fieldName].additional?.immutable
    );
  }
  getOperableFields(input, operation) {
    return (operation === "create" ? Object.keys(collections[this.collection].fields) : Object.keys(input)).filter(
      (fieldName) => fieldName !== "id" && collections[this.collection].fields[fieldName] && fieldName !== collections[this.collection].createdAtField && fieldName !== collections[this.collection].updatedAtField
    );
  }
  async sanitize(input, operation) {
    const sanitized = {};
    for (const fieldName of this.getOperableFields(input, operation)) {
      const declaration = collections[this.collection].fields[fieldName];
      if (declaration) {
        const definition = fields[declaration.type];
        if (definition) {
          sanitized[fieldName] = input[fieldName];
          for (const sanitizer of [...definition.sanitizers, ...declaration.additional?.sanitizers ?? []]) {
            try {
              if (isFunction(sanitizer) || operation === "create" && sanitizer.onCreate || operation === "update" && sanitizer.onUpdate) {
                sanitized[fieldName] = await (isFunction(sanitizer) ? sanitizer : sanitizer.sanitizer)({
                  name: fieldName,
                  value: sanitized[fieldName],
                  definition,
                  input,
                  options: resolveCollectionFieldOptions(
                    this.collection,
                    declaration.type,
                    fieldName,
                    declaration.options,
                    fields
                  ),
                  fields,
                  operation,
                  query: _query
                });
              }
            } catch {
            }
          }
        }
      }
    }
    return sanitized;
  }
  applyConditionalLogic(sanitized) {
    const errors = {};
    const failed = [];
    for (const [name, value] of Object.entries(sanitized)) {
      const declaration = collections[this.collection].fields[name];
      const definition = declaration ? fields[declaration.type] : null;
      if (declaration?.additional?.conditionalLogic && definition) {
        try {
          if (!definition.conditionalLogicMatcher({
            conditionalLogic: declaration.additional.conditionalLogic,
            definition,
            errors,
            input: sanitized,
            name,
            options: declaration.options,
            value,
            fields
          })) {
            failed.push(name);
          }
        } catch (e) {
          errors[name] = e.message;
        }
      }
    }
    return { errors, failed };
  }
  async updateOrDelete(operation, callback, buildSearchKeywordsRecordIds = []) {
    const sequelizeOptions = { ...await this.applySequelizeOptions(["attributes", "order", "where"]), raw: true };
    const buildSearchKeywords = [];
    if (!sequelizeOptions.attributes.includes("id")) {
      sequelizeOptions.attributes.push("id");
    }
    let records = await (await db()).model(this.table).findAll(sequelizeOptions);
    if (operation === "update") {
      await callback(buildSearchKeywordsRecordIds);
      records = await (await db()).model(this.table).findAll({ ...sequelizeOptions, where: { id: { [Op.in]: records.map(({ id }) => id) } } });
    }
    for (const record of records) {
      this.castRecord(record);
    }
    if (operation === "update") {
      for (const record of records) {
        await this.validateAndFallbackRecordsAfterFetch(record, records);
      }
    }
    for (const record of records) {
      if (this.populateOption) {
        await this.populateRecord(record);
      }
      if (operation === "update" && collections[this.collection].search) {
        if (!buildSearchKeywordsRecordIds.includes(record.id)) {
          buildSearchKeywordsRecordIds.push(record.id);
          buildSearchKeywords.push(new Promise((resolve) => this.buildSearchKeywords(record.id).then(resolve)));
        }
      }
      if (!this.selectedFields.includes("id")) {
        delete record.id;
      }
    }
    for (const id of buildSearchKeywordsRecordIds) {
      if (!buildSearchKeywordsRecordIds.includes(id)) {
        buildSearchKeywordsRecordIds.push(id);
        buildSearchKeywords.push(new Promise((resolve) => this.buildSearchKeywords(id).then(resolve)));
      }
    }
    if (buildSearchKeywords.length) {
      await cache();
      setTimeout(
        () => Promise.all(buildSearchKeywords).then(() => this.clearCache(operation === "update" ? "onUpdate" : "onDelete"))
      );
    }
    if (operation === "delete") {
      await callback(buildSearchKeywordsRecordIds);
    }
    if (records.length) {
      await this.clearCache(operation === "update" ? "onUpdate" : "onDelete");
    }
    return records;
  }
  hasNonCachedFieldInSelectOrderOrGroup() {
    if (collections[this.collection].cacheQueries !== false) {
      return this.selectedFields.some((fieldName) => collections[this.collection].nonCachedFields.includes(fieldName)) || this.orderOptions.some(([fieldName, _2]) => collections[this.collection].nonCachedFields.includes(fieldName)) || this.groupOptions.some((fieldName) => collections[this.collection].nonCachedFields.includes(fieldName));
    }
    return false;
  }
  hasNonCachedFieldInWhere() {
    if (collections[this.collection].cacheQueries !== false) {
      for (const { key } of walkObject(this.whereOptions)) {
        if (isString(key) && collections[this.collection].nonCachedFields.includes(key)) {
          return true;
        }
      }
    }
    return false;
  }
  generateCacheKey(method) {
    if (collections[this.collection].cacheQueries !== false) {
      let key = `pruvious:query:${this.collection}:${method}:select:${this.selectedFields.join(",")}`;
      if (method === "all" || method === "allWithCount" || method === "paginate" || method === "first") {
        key += `:where:${JSON.stringify(stringifySymbols(this.whereOptions))}`;
      }
      key += `:order:${JSON.stringify(this.orderOptions)}`;
      key += `:group:${JSON.stringify(this.groupOptions)}`;
      key += `:offset:${this.offsetOption}`;
      key += `:limit:${this.limitOption}`;
      key += `:populate:${this.populateOption}`;
      key += `:fallback:${this.fallbackOption}`;
      return key;
    }
    return "";
  }
  async storeInCache(key, value, start) {
    const cacheQueries = collections[this.collection].cacheQueries;
    if (cacheQueries !== false && performance.now() - start > cacheQueries) {
      await (await cache())?.set(key, JSON.stringify(value));
    }
  }
  async readFromCache(key) {
    if (collections[this.collection].cacheQueries !== false) {
      const value = await (await cache())?.get(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  }
  async clearCache(operation) {
    const collection = collections[this.collection];
    if (collection.clearCacheRules && collection.clearCacheRules[operation] !== false) {
      await (await cache())?.flushDb();
      await clearPageCache();
    }
  }
}
