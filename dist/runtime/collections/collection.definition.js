import { languageLabels, primaryLanguage, supportedLanguages } from "#pruvious/preflight";
import { nanoid } from "nanoid";
import pluralize from "pluralize-esm";
import { isDefined } from "../utils/common.js";
import { isKeyOf, isObject, objectOmit } from "../utils/object.js";
import { isString, joinRouteParts, titleCase } from "../utils/string.js";
import { uniqueValidator } from "../validators/unique.js";
export function defineCollection(definition) {
  const d = definition;
  const translatable = d.translatable ?? false;
  const createdAtField = d.createdAtField ?? "createdAt";
  const updatedAtField = d.updatedAtField ?? "updatedAt";
  const timestamps = {};
  const defaultLabel = isString(d.label) ? d.label : titleCase(d.name, false).toLowerCase();
  const label = {
    collection: isObject(d.label) && isObject(d.label.collection) ? d.label.collection : isObject(d.label) && isString(d.label.collection) ? { singular: pluralize.singular(d.label.collection), plural: d.label.collection } : { singular: pluralize.singular(defaultLabel), plural: defaultLabel },
    record: isObject(d.label) && isObject(d.label.record) ? d.label.record : isObject(d.label) && isString(d.label.record) ? { singular: pluralize.singular(d.label.record), plural: d.label.record } : { singular: pluralize.singular(defaultLabel), plural: defaultLabel }
  };
  if (createdAtField) {
    timestamps[createdAtField] = {
      type: "date-time",
      options: {
        label: "Created at",
        description: `The timestamp indicating when the ${label.record.singular} was created.`
      },
      additional: {
        index: true,
        immutable: true,
        validators: [
          {
            onCreate: true,
            validator: ({ __, language }) => {
              throw new Error(__(language, "pruvious-server", "This field is read-only"));
            }
          }
        ]
      }
    };
  }
  if (updatedAtField) {
    timestamps[updatedAtField] = {
      type: "date-time",
      options: {
        label: "Updated at",
        description: `The timestamp indicating when the ${label.record.singular} was last updated.`
      },
      additional: {
        index: true,
        immutable: true,
        validators: [
          {
            onCreate: true,
            validator: ({ __, language }) => {
              throw new Error(__(language, "pruvious-server", "This field is read-only"));
            }
          }
        ]
      }
    };
  }
  const baseFields = {
    id: {
      type: "number",
      options: {
        label: "ID",
        description: `The unique identifier of the ${label.record.singular}.`
      },
      additional: {
        immutable: true,
        validators: [
          {
            onCreate: true,
            validator: ({ __, language }) => {
              throw new Error(__(language, "pruvious-server", "This field is read-only"));
            }
          }
        ]
      }
    },
    language: {
      type: "select",
      options: {
        description: [
          "The language code associated with this collection record.",
          "",
          "If not provided, the code of the primary language will be used."
        ],
        default: primaryLanguage,
        choices: Object.fromEntries(languageLabels.map(({ code, name }) => [code, name]))
      },
      additional: {
        index: translatable,
        immutable: true,
        nullable: false,
        validators: [
          ({ __, language, value }) => {
            if (!translatable && value !== primaryLanguage) {
              throw new Error(__(language, "pruvious-server", "This collection does not support translations"));
            }
          }
        ]
      }
    }
  };
  if (d.mode === "multi") {
    baseFields.translations = {
      type: "text",
      options: {
        description: d.mode === "multi" ? [
          "Represents a unique identifier that groups records as translations of each other.",
          "When populated, this field resolves to a key-value object.",
          "The key represents he language code, and the value is the corresponding record's ID or `null` if no record in this language exists.",
          "",
          "If the collection is not translatable, the populated value is `null`.",
          "",
          "Defaults to an automatically generated unique string."
        ] : [
          "Represents a unique identifier that groups records as translations of each other.",
          "",
          "Defaults to an automatically generated unique string."
        ]
      },
      additional: {
        unique: "perLanguage",
        immutable: true,
        nullable: false,
        sanitizers: [({ value }) => value || nanoid()],
        validators: [
          async (context) => uniqueValidator(context, context.__(context.language, "pruvious-server", "The translation already exists"))
        ],
        population: {
          type: { js: "object", ts: "Record<SupportedLanguage, number | null> | null" },
          populator: async ({ value, currentQuery }) => {
            if (d.translatable && isString(value)) {
              const translations = Object.fromEntries(
                supportedLanguages.map((language) => [language, null])
              );
              for (const { id, language } of await currentQuery.clone().reset().select({ id: true, language: true }).where("translations", value).all()) {
                if (isKeyOf(translations, language)) {
                  translations[language] = id;
                }
              }
              return translations;
            }
            return null;
          }
        }
      }
    };
  }
  const customFields = objectOmit(d.fields, ["id", "language", "translations"]);
  const fields = { ...baseFields, ...customFields, ...timestamps };
  const dashboard = {
    visible: d.dashboard?.visible ?? true,
    icon: d.dashboard?.icon ?? (d.mode === "multi" ? "Pin" : "Settings"),
    primaryField: d.dashboard?.primaryField,
    fieldLayout: d.dashboard?.fieldLayout ?? [
      ...Object.entries(fields).filter(
        ([fieldName, field]) => !field.additional?.protected && (!d.contentBuilder || fieldName !== d.contentBuilder.blocksField) && fieldName !== "id" && fieldName !== "language" && fieldName !== "translations" && fieldName !== createdAtField && fieldName !== updatedAtField
      ).map(([fieldName]) => fieldName),
      ...d.contentBuilder ? ["translations"] : []
    ],
    overviewTable: {
      columns: d.dashboard?.overviewTable?.columns?.map((item) => isString(item) ? { field: item } : item) ?? [
        ...Object.keys(customFields).length ? Object.entries(customFields).filter(([_, field]) => !field.additional?.protected).slice(0, 6 - Object.keys(timestamps).length).map(([fieldName], i) => ({ field: fieldName, width: i === 0 ? 30 : void 0 })) : [{ field: "id" }],
        ...Object.keys(timestamps).map((field) => ({ field, width: 13 }))
      ],
      sort: d.dashboard?.overviewTable?.sort ?? {
        field: createdAtField || updatedAtField || Object.keys(customFields)[0] || "id",
        direction: "desc"
      },
      perPage: d.dashboard?.overviewTable?.perPage ?? 50,
      searchLabel: d.dashboard?.overviewTable?.searchLabel ? isString(d.dashboard?.overviewTable.searchLabel) ? [d.dashboard?.overviewTable.searchLabel, null] : d.dashboard?.overviewTable.searchLabel : [Object.keys(customFields)[0] ?? "id", null],
      additionalTableRowOptionsVueComponent: d.dashboard?.overviewTable?.additionalTableRowOptionsVueComponent
    },
    additionalRecordOptionsVueComponent: d.dashboard?.additionalRecordOptionsVueComponent
  };
  return {
    name: d.name,
    label,
    mode: d.mode,
    fields,
    translatable,
    apiRoutes: {
      create: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.create) ? d.apiRoutes.create : "private",
      createMany: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.createMany) ? d.apiRoutes.createMany : "private",
      read: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.read) ? d.apiRoutes.read : "private",
      readMany: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.readMany) ? d.apiRoutes.readMany : "private",
      update: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.update) ? d.apiRoutes.update : "private",
      updateMany: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.updateMany) ? d.apiRoutes.updateMany : "private",
      delete: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.delete) ? d.apiRoutes.delete : "private",
      deleteMany: d.apiRoutes === false ? false : isDefined(d.apiRoutes?.deleteMany) ? d.apiRoutes.deleteMany : "private"
    },
    guards: d.guards ?? [],
    publicPages: d.publicPages ? {
      pathField: d.publicPages.pathField ?? "path",
      pathPrefix: isString(d.publicPages.pathPrefix) ? joinRouteParts(d.publicPages.pathPrefix).slice(1) : isObject(d.publicPages.pathPrefix) ? Object.fromEntries(
        Object.entries(d.publicPages.pathPrefix).map(([language, prefix]) => [
          language,
          joinRouteParts(prefix).slice(1)
        ])
      ) : "",
      publicField: d.publicPages.publicField ?? false,
      draftTokenField: d.publicPages.draftTokenField ?? false,
      publishDateField: d.publicPages.publishDateField ?? false,
      layoutField: d.publicPages.layoutField ?? false,
      additionalFields: d.publicPages.additionalFields ?? [],
      seo: d.publicPages.seo
    } : false,
    contentBuilder: d.contentBuilder ? { allowedBlocks: "*", rootBlocks: "*", ...d.contentBuilder } : false,
    dashboard,
    createdAtField,
    updatedAtField,
    cacheQueries: d.cacheQueries ?? 10,
    clearCacheRules: d.clearCacheRules ?? { onCreate: true, onUpdate: true, onDelete: true },
    nonCachedFields: d.nonCachedFields ?? [],
    search: d.search ?? false,
    compositeIndexes: d.compositeIndexes ?? [],
    uniqueCompositeIndexes: d.uniqueCompositeIndexes ?? [],
    duplicate: d.duplicate ?? false,
    mirrorTranslation: d.mirrorTranslation ?? (({ from, language }) => ({ ...from, language }))
  };
}
