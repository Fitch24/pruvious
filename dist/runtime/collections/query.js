import {
  primaryLanguage
} from "#pruvious";
import { collections } from "#pruvious/server";
import { db } from "../instances/database.js";
import { getModuleOption } from "../instances/state.js";
import { isObject } from "../utils/object.js";
import { __ } from "../utils/server/translate-string.js";
import { QueryBuilder } from "./query-builder.js";
import { SingleQueryBuilder } from "./single-query-builder.js";
import { UploadsQueryBuilder } from "./uploads-query-builder.js";
export function query(collection, contextLanguage = primaryLanguage) {
  if (!collections[collection]) {
    throw new Error(__(contextLanguage, "pruvious-server", "Unknown collection name: '$collection'", { collection }));
  }
  if (collections[collection].mode === "single") {
    return new SingleQueryBuilder(collection, contextLanguage);
  }
  if (getModuleOption("uploads") && collection === "uploads") {
    return new UploadsQueryBuilder("uploads", contextLanguage);
  }
  return new QueryBuilder(collection, contextLanguage);
}
export async function rawQuery(sql, replacements, options) {
  const preparedReplacements = {};
  if (replacements) {
    for (const [key, value] of Object.entries(replacements)) {
      preparedReplacements[key] = isObject(value) ? JSON.stringify(value) : value;
    }
  }
  const [results, metadata] = await (await db()).query(sql, { replacements: preparedReplacements, ...options });
  return { results, metadata };
}
