import { getHeader } from "h3";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { Op } from "sequelize";
import { query } from "../collections/query.js";
import { cache } from "../instances/cache.js";
import { db } from "../instances/database.js";
import { getModuleOption } from "../instances/state.js";
import { isPositiveInteger } from "../utils/number.js";
export async function cleanExpiredTokens() {
  return await (await db()).model("_tokens").destroy({ where: { exp: { [Op.lt]: Date.now() / 1e3 } } });
}
export async function fetchToken(token) {
  try {
    const tokenData = jwt.decode(token);
    const cacheKey = `pruvious:token:${tokenData.userId}:${token}`;
    if (!isValidTokenData(tokenData)) {
      return null;
    }
    if (await (await cache())?.exists(cacheKey)) {
      return { token, ...tokenData };
    }
    if (await (await db()).model("_tokens").count({ where: { token } })) {
      await (await cache())?.set(cacheKey, tokenData.exp, { PX: tokenData.exp * 1e3 - Date.now() });
      return { token, ...tokenData };
    }
  } catch {
  }
  return null;
}
export function getBearerToken(event) {
  return getHeader(event, "Authorization")?.slice(7) ?? "";
}
export function generateToken(userId, expiresIn) {
  return jwt.sign({ userId, jti: nanoid() }, getModuleOption("jwt").secretKey, { expiresIn });
}
export async function removeToken(token) {
  try {
    const tokenData = jwt.decode(token);
    if (!isValidTokenData(tokenData)) {
      return false;
    }
    const deleted = await (await db()).model("_tokens").destroy({ where: { token } });
    await (await cache())?.del(`pruvious:token:${tokenData.userId}:${token}`);
    return !!deleted;
  } catch {
  }
  return false;
}
export async function removeUserTokens(userId, except) {
  const where = { user_id: userId };
  if (except) {
    where.token = { [Op.ne]: except };
  }
  const rows = await (await db()).model("_tokens").findAll({ attributes: ["token"], where, raw: true });
  const deleted = await (await db()).model("_tokens").destroy({ where });
  for (const { token } of rows) {
    await (await cache())?.del(`pruvious:token:${userId}:${token}`);
  }
  return deleted;
}
export async function storeToken(token) {
  const { userId, iat, exp } = jwt.decode(token);
  await (await db()).model("_tokens").create({ token, user_id: userId, iat, exp });
  await (await cache())?.set(`pruvious:token:${userId}:${token}`, exp, { PX: exp * 1e3 - Date.now() });
}
export async function verifyToken(token) {
  try {
    const tokenData = jwt.verify(token, getModuleOption("jwt").secretKey);
    if (isValidTokenData(tokenData)) {
      const stored = await fetchToken(token);
      if (stored?.userId === tokenData.userId && stored.iat === tokenData.iat && stored.exp === tokenData.exp) {
        const user = await query("users").deselect({ password: true }).where("id", tokenData.userId).populate().first();
        if (user && user.isActive) {
          return { isValid: true, user, tokenData };
        }
      }
    }
  } catch {
  }
  return { isValid: false, user: null, tokenData: null };
}
function isValidTokenData(tokenData) {
  return isPositiveInteger(tokenData?.userId) && isPositiveInteger(tokenData.exp) && tokenData.exp >= Date.now() / 1e3;
}
