import { defineEventHandler } from "h3";
import { getBearerToken, verifyToken } from "../../http/auth.js";
export default defineEventHandler(async (event) => {
  const token = getBearerToken(event);
  const { isValid, user } = await verifyToken(token);
  event.context.auth = { isLoggedIn: isValid, user };
});
