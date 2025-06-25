import {
  primaryLanguage,
  supportedLanguages
} from "#pruvious";
import { collections, fields } from "#pruvious/server";
import { cache } from "../instances/cache.js";
import { db } from "../instances/database.js";
import { getModuleOption } from "../instances/state.js";
import { clearPageCache } from "../plugins/page-cache.js";
import { clearArray, isArray, sortNaturalByProp, uniqueArray } from "../utils/array.js";
import { isNull } from "../utils/common.js";
import { isFunction } from "../utils/function.js";
import {
  deepClone,
  deleteProperty,
  getProperty,
  isKeyOf,
  isObject,
  objectOmit,
  objectPick,
  setProperty
} from "../utils/object.js";
import { _, __ } from "../utils/server/translate-string.js";
import { resolveCollectionFieldOptions } from "./field-options.resolver.js";
import { query as _query } from "./query.js";
export class SingleQueryBuilder {
  constructor(collection, contextLanguage = primaryLanguage) {
    this.collection = collection;
    this.contextLanguageOption = contextLanguage;
    this.table = getModuleOption("singleCollectionsTable");
    this.selectAll();
  }
  table;
  selectedFields = [];
  languageOption = primaryLanguage;
  populateOption = false;
  fallbackOption = true;
  contextLanguageOption;
  /**
   * Apply query string parameters to the current query.
   *
   * @example
   * ```typescript
   * export default defineEventHandler((event) => {
   *   const qs = getQueryStringParams(event, 'settings')
   *
   *   if (qs.errors.length) {
   *     setResponseStatus(event, 400)
   *     return qs.errors.join('\n')
   *   }
   *
   *   return query('settings').applyQueryStringParams(qs.params).read()
   * })
   * ```
   */
  applyQueryStringParams(params) {
    if (isKeyOf(params, "select")) this.selectedFields = uniqueArray(params.select);
    if (isKeyOf(params, "language")) this.languageOption = params.language;
    if (isKeyOf(params, "populate")) this.populateOption = params.populate;
    return this;
  }
  /**
   * Specify the `fields` to be selected and returned from the query.
   *
   * @example
   * ```typescript
   * // Selects the 'logo' and 'copyright' fields from the 'settings' collection
   * await query('settings').select({ logo: true, copyright: true }).read()
   * // Output: { logo: ..., copyright: '...' }
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
   * // Select all fields from the 'settings' collection
   * await query('settings').selectAll().read()
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
   * // Don't return the 'secret' field from the 'settings' collection
   * const product = await query('settings').deselect({ secret: true }).read()
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
   * Set the language code for the query result.
   * If no language is specified or the code is invalid, the primary language is used.
   * Non-translatable collections always return results in the primary language.
   *
   * @example
   * ```typescript
   * // Select the German version of the 'settings' collection
   * await query('settings').language('de').read()
   * ```
   */
  language(code) {
    if (collections[this.collection].translatable && supportedLanguages.includes(code)) {
      this.languageOption = code;
    }
    return this;
  }
  /**
   * Retrieve the currently queried language code.
   *
   * @example
   * ```typescript
   * query('settings').getLanguage() // 'en'
   * ```
   */
  getLanguage() {
    return this.languageOption;
  }
  /**
   * Enable field population to retrieve populated field values in the query results.
   *
   * By default, the query builder returns the casted field values without populating related data.
   *
   * @example
   * ```typescript
   * // Without population:
   * await query('settings').select({ blogLandingPage: true }).read()
   * // Output: { blogLandingPage: 1 }
   *
   * // With population:
   * await query('settings').select({ blogLandingPage: true }).populate().read()
   * // Output: { blogLandingPage: { id: 1, path: '/blog' } }
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
   * await populatedsettingsQuery.select({ blogLandingPage: true }).unpopulate().read()
   * // Output: { blogLandingPage: 1 }
   *
   * // With population:
   * await populatedsettingsQuery.select({ blogLandingPage: true }).read()
   * // Output: { blogLandingPage: { id: 1, path: '/blog' } }
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
   * query('settings').getFieldValueType() // 'casted'
   * query('settings').populate().getFieldValueType() // 'populated'
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
      languageOption: this.languageOption,
      populateOption: this.populateOption,
      fallbackOption: this.fallbackOption,
      contextLanguageOption: this.contextLanguageOption
    });
  }
  /**
   * Create a new query builder with the same state as this one.
   */
  clone() {
    const query = new SingleQueryBuilder(this.collection);
    for (const [key, value] of Object.entries(this.getOptions())) {
      query[key] = value;
    }
    return query;
  }
  /**
   * Reset all query builder options to their default values.
   */
  reset() {
    return this.selectAll().language(primaryLanguage).unpopulate().fallback().contextLanguage(primaryLanguage);
  }
  /**
   * Retrieve collection data that corresponds to the current query parameters.
   *
   * @example
   * ```typescript
   * // Read the 'settings' collection
   * await query('settings').read()
   * // Output: { field1: '...', field2: '...', ... }
   * ```
   */
  async read() {
    const start = performance.now();
    const key = this.generateCacheKey();
    const cached = await this.readFromCache(key);
    if (cached) {
      return cached;
    }
    const record = await (await db()).model(this.table).findOne({ ...await this.applySequelizeWhere(), raw: true }) || await this.ensureRecord();
    const data = {
      ...Object.fromEntries(
        Object.keys(collections[this.collection].fields).map((fieldName) => [fieldName, void 0])
      ),
      id: +record.id,
      language: record.language,
      ...JSON.parse(record.data)
    };
    await this.validateAndFallbackDataAfterFetch(data);
    for (const fieldName in data) {
      if (!this.selectedFields.includes(fieldName)) {
        delete data[fieldName];
      }
    }
    if (this.populateOption) {
      await this.populateRecord(data);
    }
    if (!this.hasNonCachedFieldInSelect()) {
      await this.storeInCache(key, data, start);
    }
    return data;
  }
  /**
   * Validate the `input` data.
   *
   * @returns A Promise that resolves to an object containing validation errors for fields with failed validation.
   */
  async validate(input, operation, skipFields) {
    const errors = {};
    for (const fieldName of this.getOperableFields(input)) {
      if (skipFields?.includes(fieldName)) {
        continue;
      }
      const declaration = collections[this.collection].fields[fieldName];
      const definition = fields[declaration.type];
      if (definition) {
        for (const validator of [...definition.validators, ...declaration.additional?.validators ?? []]) {
          try {
            if (isFunction(validator) || operation === "read" && validator.onRead || operation === "update" && validator.onUpdate) {
              await (isFunction(validator) ? validator : validator.validator)({
                _,
                __,
                allInputs: void 0,
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
    return errors;
  }
  /**
   * Update fields of a single-entry collection.
   *
   * @returns A Promise that resolves to an `UpdateResult` object.
   *          If successful, the updated fields will be available in the `record` property.
   *          If there are any field validation errors, they will be available in the `errors` property.
   *          The `message` property may contain an optional error message if there are issues during the database query.
   *
   * @example
   * ```typescript
   * const result = await query('settings').update({
   *   logo: 2,
   *   blogLandingPage: 15,
   *   copyright: '2077',
   * })
   *
   * if (result.success) {
   *   console.log('Updated record:', result.record)
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
    const existing = await (await db()).model(this.table).findOne({ ...await this.applySequelizeWhere(), raw: true }) || await this.ensureRecord();
    const prepared = this.prepareInput(input);
    const sanitized = await this.sanitize(prepared);
    const conditionalLogicResults = this.applyConditionalLogic(sanitized);
    if (Object.keys(conditionalLogicResults.errors).length) {
      return { success: false, errors: conditionalLogicResults.errors };
    }
    const validationErrors = await this.validate(sanitized, "update", conditionalLogicResults.failed);
    if (Object.keys(validationErrors).length) {
      return { success: false, errors: validationErrors };
    }
    const data = { ...JSON.parse(existing.data), ...sanitized };
    if (collections[this.collection].updatedAtField) {
      data[collections[this.collection].updatedAtField] = Date.now();
    }
    try {
      await (await db()).model(this.table).update({ data: JSON.stringify(data) }, await this.applySequelizeWhere());
      const updated = await (await db()).model(this.table).findOne({ ...await this.applySequelizeWhere(), raw: true });
      const updatedData = { id: +updated.id, language: updated.language, ...JSON.parse(updated.data) };
      for (const fieldName of Object.keys(updatedData)) {
        if (!collections[this.collection].fields[fieldName]) {
          delete updatedData[fieldName];
        }
      }
      if (collections[this.collection].translatable) {
        const syncedData = {};
        for (const fieldName of Object.keys(updatedData)) {
          if (collections[this.collection].fields[fieldName].additional?.translatable === false) {
            syncedData[fieldName] = updatedData[fieldName];
          }
        }
        if (Object.keys(syncedData).length) {
          for (const language of supportedLanguages.filter((language2) => language2 !== this.languageOption)) {
            const relatedRecord = await this.clone().reset().language(language).read();
            await (await db()).model(this.table).update(
              { data: JSON.stringify({ ...relatedRecord, ...syncedData }) },
              { where: { name: this.collection, language } }
            );
          }
        }
      }
      await this.validateAndFallbackDataAfterFetch(updatedData);
      for (const fieldName in updatedData) {
        if (!this.selectedFields.includes(fieldName)) {
          delete updatedData[fieldName];
        }
      }
      if (this.populateOption) {
        await this.populateRecord(updatedData);
      }
      await this.clearCache();
      return {
        success: true,
        record: updatedData
      };
    } catch (e) {
      return { success: false, errors: {}, message: e.message };
    }
  }
  async applySequelizeWhere() {
    return {
      where: {
        name: this.collection,
        language: this.languageOption
      }
    };
  }
  async validateAndFallbackDataAfterFetch(data) {
    if (this.fallbackOption) {
      const errors = await this.validate(data, "read");
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
              data,
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
            const value = getProperty(data, parentPath);
            for (const [fieldPath2, value2] of sortNaturalByProp(Object.entries(filterArrays), "0").reverse()) {
              filterArrays[parentPath] = value2;
            }
          } else if (!/\.[a-z_$][a-z0-9_$]*\.fields\./i.test) {
            deleteProperty(data, fieldPath);
          }
        } else if (/\.[0-9]+$/.test(fieldPath)) {
          const parentPath = fieldPath.split(".").slice(0, -1).join(".");
          const value = getProperty(data, parentPath);
          if (isArray(value)) {
            filterArrays[parentPath] = value;
          }
        } else if (!/\.[a-z_$][a-z0-9_$]*\.fields\./i.test) {
          deleteProperty(data, fieldPath);
        }
      }
      for (const [fieldPath, value] of Object.entries(filterArrays)) {
        setProperty(
          data,
          fieldPath,
          value.filter((v) => !isNull(v))
        );
      }
    }
  }
  async populateRecord(record) {
    for (const fieldName of this.selectedFields) {
      const declaration = collections[this.collection].fields[fieldName];
      const definition = fields[declaration.type];
      const population = declaration.additional?.population ?? definition.population;
      if (population) {
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
  prepareInput(input) {
    return objectOmit(
      objectPick(input, Object.keys(collections[this.collection].fields)),
      this.getImmutableFields()
    );
  }
  getImmutableFields() {
    return Object.keys(collections[this.collection].fields).filter(
      (fieldName) => collections[this.collection].fields[fieldName].additional?.immutable
    );
  }
  getOperableFields(input) {
    return Object.keys(input).filter(
      (fieldName) => fieldName !== "id" && fieldName !== "language" && collections[this.collection].fields[fieldName] && fieldName !== collections[this.collection].createdAtField && fieldName !== collections[this.collection].updatedAtField
    );
  }
  async sanitize(input) {
    const sanitized = {};
    for (const fieldName of this.getOperableFields(input)) {
      const declaration = collections[this.collection].fields[fieldName];
      if (declaration) {
        const definition = fields[declaration.type];
        if (definition) {
          sanitized[fieldName] = input[fieldName];
          for (const sanitizer of [...definition.sanitizers, ...declaration.additional?.sanitizers ?? []]) {
            try {
              if (isFunction(sanitizer) || sanitizer.onUpdate) {
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
                  operation: "update",
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
      const definition = fields[declaration.type];
      if (declaration.additional?.conditionalLogic) {
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
  hasNonCachedFieldInSelect() {
    if (collections[this.collection].cacheQueries !== false) {
      return this.selectedFields.some((fieldName) => collections[this.collection].nonCachedFields.includes(fieldName));
    }
    return false;
  }
  generateCacheKey() {
    if (collections[this.collection].cacheQueries !== false) {
      let key = `pruvious:query:${this.collection}:select:${this.selectedFields.join(",")}`;
      key += `:language:${JSON.stringify(this.languageOption)}`;
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
  async clearCache() {
    const collection = collections[this.collection];
    if (collection.clearCacheRules && collection.clearCacheRules.onUpdate !== false) {
      await (await cache())?.flushDb();
      await clearPageCache();
    }
  }
  async ensureRecord() {
    const now = Date.now();
    const input = {
      language: this.languageOption,
      name: this.collection,
      data: {}
    };
    for (const fieldName in collections[this.collection].fields) {
      if (fieldName !== "id" && fieldName !== "language") {
        const definition = fields[collections[this.collection].fields[fieldName].type];
        if (definition) {
          input.data[fieldName] = definition.default({
            definition,
            name: fieldName,
            options: collections[this.collection].fields[fieldName].options
          });
        }
      }
    }
    if (collections[this.collection].createdAtField) {
      input.data[collections[this.collection].createdAtField] = now;
    }
    if (collections[this.collection].updatedAtField) {
      input.data[collections[this.collection].updatedAtField] = now;
    }
    input.data = JSON.stringify(input.data);
    await (await db()).model(this.table).create(input);
    return (await db()).model(this.table).findOne({ ...await this.applySequelizeWhere(), raw: true });
  }
}
