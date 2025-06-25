import { defineEventHandler, setResponseStatus } from "h3";
import { getBearerToken, removeUserTokens } from "../http/auth.js";
import { __ } from "../utils/server/translate-string.js";
export default defineEventHandler(async (event) => {
  if (!event.context.auth.isLoggedIn) {
    setResponseStatus(event, 401);
    return __(event, "pruvious-server", "Unauthorized due to either invalid credentials or missing authentication");
  }
  const token = getBearerToken(event);
  return await removeUserTokens(event.context.auth.user.id, token);
});
