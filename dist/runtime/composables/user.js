import { useState } from "#imports";
export const useUser = () => useState("pruvious-user", () => null);
