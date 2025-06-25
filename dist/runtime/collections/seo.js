import {
  primaryLanguage,
  supportedLanguages
} from "#pruvious";
import { getQuery } from "h3";
import { getModuleOption } from "../instances/state.js";
import { __ } from "../utils/server/translate-string.js";
import { joinRouteParts, resolveCollectionPathPrefix } from "../utils/string.js";
import { query } from "./query.js";
export async function seo(collection, page, event) {
  const qs = getQuery(event);
  const seo2 = await query("seo").language(page.language).populate().read();
  const pp = collection.publicPages;
  const pagePath = page[pp.pathField ?? "path"];
  const pagePublic = pp.publicField ? page[pp.publicField] : true;
  const pageDraftToken = pp.draftTokenField ? page[pp.draftTokenField] : "";
  const pageTitle = pp.seo?.titleField ? page[pp.seo.titleField] : "";
  const pageBaseTitle = pp.seo?.baseTitleField ? page[pp.seo.baseTitleField] : "";
  const pageDescription = pp.seo?.descriptionField ? page[pp.seo.descriptionField] : "";
  const pageVisible = pp.seo?.visibleField ? page[pp.seo.visibleField] : true;
  const pageSharingImage = pp.seo?.sharingImageField ? page[pp.seo.sharingImageField] : null;
  const pageMetaTags = pp.seo?.metaTagsField ? page[pp.seo.metaTagsField] : [];
  const prefixPrimaryLanguage = getModuleOption("language").prefixPrimary;
  const pathPrefix = Object.fromEntries(
    supportedLanguages.map((code) => [
      code,
      resolveCollectionPathPrefix(collection, code, primaryLanguage)
    ])
  );
  const htmlAttrs = {};
  const meta = [];
  const link = [];
  const script = [];
  let title = pageTitle || pagePath?.slice(1) || "";
  if (qs.__p) {
    title = pageTitle ? `(${__(event, "pruvious-server", "PREVIEW")}) ${pageTitle}` : __(event, "pruvious-server", "PREVIEW");
  } else if (!pagePublic && pageDraftToken) {
    title = pageTitle ? `(${__(event, "pruvious-server", "DRAFT")}) ${title}` : __(event, "pruvious-server", "DRAFT");
  }
  if (pageBaseTitle && seo2.baseTitle) {
    title = seo2.baseTitlePosition === "before" ? seo2.baseTitle + seo2.titleSeparator + title : title + seo2.titleSeparator + seo2.baseTitle;
  }
  if (!seo2.visible || !pagePublic || !pageVisible) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }
  htmlAttrs.lang = page.language;
  if (page.translations && pagePath) {
    const translations = {};
    for (const [language, id] of Object.entries(page.translations ?? {}).filter(([_, id2]) => id2)) {
      const q = query(collection.name).where("id", id);
      if (pp.publicField) {
        q.where(pp.publicField, true);
      }
      const path = (await q.first())?.[pp.pathField ?? "path"];
      if (path) {
        translations[language] = seo2.baseUrl + joinRouteParts(
          language === primaryLanguage && !prefixPrimaryLanguage ? "" : language,
          pathPrefix[language],
          path
        );
      }
    }
    for (const language of supportedLanguages) {
      if (language === page.language) {
        link.push({
          rel: "alternate",
          hreflang: language,
          href: seo2.baseUrl + joinRouteParts(
            language === primaryLanguage && !prefixPrimaryLanguage ? "" : language,
            pathPrefix[language],
            pagePath
          )
        });
      } else if (translations[language]) {
        link.push({ rel: "alternate", hreflang: language, href: translations[language] });
      }
    }
    link.push({
      rel: "alternate",
      hreflang: "x-default",
      href: page.language === primaryLanguage ? seo2.baseUrl + joinRouteParts(prefixPrimaryLanguage ? primaryLanguage : "", pathPrefix[page.language], pagePath) : translations[primaryLanguage] ?? seo2.baseUrl + joinRouteParts(page.language, pathPrefix[page.language], pagePath)
    });
  }
  if (seo2.favicon) {
    link.push({
      rel: "icon",
      type: "image/svg+xml",
      href: seo2.favicon.src.startsWith("http") ? seo2.favicon.src : seo2.baseUrl + seo2.favicon.src
    });
    if (seo2.favicon.sources[0]) {
      link.push({
        rel: "icon",
        type: "image/png",
        href: seo2.favicon.sources[0].srcset.startsWith("http") ? seo2.favicon.sources[0].srcset : seo2.baseUrl + seo2.favicon.sources[0].srcset
      });
    }
  }
  let sharingImage = pageSharingImage || seo2.sharingImage;
  if (sharingImage?.sources[0]) {
    const content = sharingImage.sources[0].srcset.startsWith("http") ? sharingImage.sources[0].srcset : seo2.baseUrl + sharingImage.sources[0].srcset;
    meta.push({ property: "og:image", content });
    meta.push({ property: "twitter:image", content });
  }
  if (seo2.logo) {
    script.push({
      tagPosition: "head",
      type: "application/ld+json",
      innerHTML: `{"@context":"https://schema.org","@type":"Organization","url":"${seo2.baseUrl}/","logo":"${seo2.logo.src.startsWith("http") ? seo2.logo.src : seo2.baseUrl + seo2.logo.src}"}`
    });
  }
  if (seo2.socialMediaMeta) {
    if (seo2.baseTitle) {
      meta.push({ property: "og:site_name", content: seo2.baseTitle });
    }
    meta.push({ property: "og:locale", content: page.language });
    meta.push({ property: "og:title", content: title });
    if (pageDescription) {
      meta.push({ property: "og:description", content: pageDescription });
    }
    meta.push({ property: "og:url", content: seo2.baseUrl + pagePath });
    meta.push({ property: "twitter:title", content: title });
    if (pageDescription) {
      meta.push({ property: "twitter:description", content: pageDescription });
    }
    meta.push({ property: "og:type", content: "website" });
    meta.push({ property: "twitter:card", content: "summary_large_image" });
  }
  if (pageDescription) {
    meta.push({ name: "description", content: pageDescription });
  }
  for (const { name, content } of seo2.metaTags) {
    meta.push(name.startsWith("og:") || name.startsWith("twitter:") ? { property: name, content } : { name, content });
  }
  for (const { name, content } of pageMetaTags) {
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      if (!meta.some((tag) => tag.property === name)) {
        meta.push({ property: name, content });
      }
    } else {
      if (!meta.some((tag) => tag.name === name)) {
        meta.push({ name, content });
      }
    }
  }
  for (const { js, kind, position, url } of seo2.scripts) {
    const item = { tagPosition: position ?? void 0 };
    if (kind === "external") {
      item.src = url;
    } else {
      item.innerHTML = js;
    }
    script.push(item);
  }
  return {
    props: { title, description: pageDescription ?? "", htmlAttrs, meta, link, script },
    settings: seo2
  };
}
