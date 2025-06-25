import { defineNuxtRouteMiddleware } from "#imports";
import { useAuth } from "../../composables/auth.js";
import { getToken } from "../../composables/token.js";
export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const auth = useAuth();
    auth.value.userId = getToken()?.userId ?? null;
    auth.value.isLoggedIn = !!auth.value.userId;
  }
});
