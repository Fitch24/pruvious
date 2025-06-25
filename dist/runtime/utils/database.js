import { murmurHash } from "ohash";
import pgConnectionString from "pg-connection-string";
import { getModuleOption } from "../instances/state.js";
import { isString } from "../utils/string.js";
import { isArray, toArray } from "./array.js";
export function getDatabaseDialect() {
  return getModuleOption("database").startsWith("postgresql:") ? "postgres" : "sqlite";
}
export function getDatabaseInfo() {
  const database = getModuleOption("database");
  const dialect = getDatabaseDialect();
  if (dialect === "postgres") {
    const config = pgConnectionString.parse(database);
    return {
      dialect,
      database: config.database || "",
      host: config.host || "",
      port: config.port ? +config.port : 5432,
      username: config.user,
      password: config.password,
      ssl: isString(config.ssl) ? config.ssl === "true" : !!config.ssl
    };
  } else {
    return { dialect, storage: database.slice(7) };
  }
}
export function indexName(table, columns, unique = false) {
  const prefix = isArray(columns) && columns.length > 1 ? unique ? "uc" : "cx" : unique ? "ux" : "ix";
  const name = `${prefix}_${table}_${toArray(columns).join("_")}`;
  if (name.length > 63) {
    const suffix = "_" + murmurHash(name).toString(36);
    return name.slice(0, 63 - suffix.length) + suffix;
  }
  return name;
}
export function foreignKeyConstraintName(table, column) {
  const name = `fk_${table}_${column}`;
  if (name.length > 63) {
    const suffix = "_" + murmurHash(name).toString(36);
    return name.slice(0, 63 - suffix.length) + suffix;
  }
  return name;
}
