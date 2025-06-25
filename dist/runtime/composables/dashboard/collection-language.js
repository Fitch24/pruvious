import { useState } from "#imports";
import { primaryLanguage } from "#pruvious";
export const useCollectionLanguage = () => useState("pruvious-collection-language", () => primaryLanguage);
