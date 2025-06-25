import { useState } from "#imports";
import { pruviousFetch } from "../utils/fetch.js";
import { getToken, removeToken, setToken } from "./token.js";
export const useAuth = () => useState("pruvious-auth", () => ({
  isLoggedIn: false,
  userId: null
}));
export async function login(email, password, remember = false) {
  const response = await pruviousFetch("login.post", { body: { email, password, remember } });
  const auth = useAuth();
  if (response.success) {
    setToken(response.data);
    auth.value.isLoggedIn = true;
    auth.value.userId = getToken()?.userId ?? null;
  }
  return response;
}
export async function logout() {
  await pruviousFetch("logout.post");
  removeToken();
  const auth = useAuth();
  auth.value.isLoggedIn = false;
  auth.value.userId = null;
}
export async function logoutAll() {
  const response = await pruviousFetch("logout-all.post");
  removeToken();
  const auth = useAuth();
  auth.value.isLoggedIn = false;
  auth.value.userId = null;
  if (response.success) {
    return response.data;
  }
  return 0;
}
export async function logoutOtherSessions() {
  const response = await pruviousFetch("logout-others.post");
  if (response.success) {
    return response.data;
  }
  return 0;
}
export async function renewToken() {
  const response = await pruviousFetch("renew-token.post");
  if (response.success) {
    setToken(response.data);
  } else {
    removeToken();
    const auth = useAuth();
    auth.value.isLoggedIn = false;
    auth.value.userId = null;
  }
  return response;
}
export async function getUserProfile() {
  const response = await pruviousFetch("profile.get");
  if (response.success) {
    return response.data;
  }
  return null;
}
export async function updateUserProfile(user) {
  return await pruviousFetch("profile.patch", { body: user });
}
