import { defineEventHandler } from "h3";
import { query } from "../collections/query.js";
export default defineEventHandler(async (event) => {
  return !!await query("users", event.context.language).where("isAdmin", true).count();
});
