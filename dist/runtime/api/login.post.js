import argon2 from "argon2";
import { defineEventHandler, setResponseStatus } from "h3";
import { pruviousReadBody } from "../collections/input.js";
import { query } from "../collections/query.js";
import { generateToken, storeToken } from "../http/auth.js";
import { getModuleOption } from "../instances/state.js";
import { booleanishSanitizer } from "../sanitizers/booleanish.js";
import { stringSanitizer } from "../sanitizers/string.js";
import { catchFirstErrorMessage } from "../utils/function.js";
import { isKeyOf, isObject } from "../utils/object.js";
import { __ } from "../utils/server/translate-string.js";
import { booleanValidator } from "../validators/boolean.js";
import { requiredValidator } from "../validators/required.js";
import { emailValidator, stringValidator } from "../validators/string.js";
export default defineEventHandler(async (event) => {
  const body = await pruviousReadBody(event);
  const data = isObject(body) ? body : {};
  const email = isKeyOf(data, "email") ? stringSanitizer({ value: data.email }) : void 0;
  const password = isKeyOf(data, "password") ? stringSanitizer({ value: data.password }) : void 0;
  const remember = isKeyOf(data, "remember") ? booleanishSanitizer({ value: data.remember }) : false;
  const errors = await catchFirstErrorMessage({
    email: [
      () => requiredValidator({ __, language: event.context.language, value: email }),
      () => stringValidator({ value: email }),
      () => emailValidator({ value: email })
    ],
    password: [
      () => requiredValidator({ __, language: event.context.language, value: password }),
      () => stringValidator({ value: password })
    ],
    remember: [() => booleanValidator({ value: remember })]
  });
  if (Object.keys(errors).length) {
    setResponseStatus(event, 422);
    return errors;
  }
  const user = await query("users", event.context.language).select({ id: true, email: true, password: true }).where("email", email).where("isActive", true).first();
  if (!user) {
    await argon2.verify(
      "$argon2id$v=19$m=65536,t=3,p=4$KfP27QvlNx/4Kjk2krKJ3Q$MwNHO4YcR+EPy3CtJYdkd+VJAygllJuBfClflE/kixQ",
      password
    );
  }
  if (!user || !await argon2.verify(user.password, password)) {
    setResponseStatus(event, 400);
    return __(event, "pruvious-server", "Incorrect credentials");
  }
  const token = generateToken(
    user.id,
    remember ? getModuleOption("jwt").expirationLong : getModuleOption("jwt").expiration
  );
  await storeToken(token);
  return token;
});
