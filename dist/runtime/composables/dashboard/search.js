import { useState } from "#imports";
export const usePruviousSearch = () => useState("pruvious-search", () => ({ media: "" }));
