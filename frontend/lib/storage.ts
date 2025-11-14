"use client";

import type { AuthenticatedUser } from "./api";

export const AUTH_EVENT: string = "inbotiq-auth-change";
const TOKEN_KEY = "inbotiq_token";
const USER_KEY = "inbotiq_user";

const dispatchAuthEvent = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const saveAuth = (token: string, user: AuthenticatedUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  dispatchAuthEvent();
};

export const updateStoredUser = (user: AuthenticatedUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  dispatchAuthEvent();
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  dispatchAuthEvent();
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = (): AuthenticatedUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
};

