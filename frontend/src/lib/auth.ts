export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "trader";
};

const tokenKey = "tradex_token";
const userKey = "tradex_user";

export function getAuthToken() {
  if (typeof window === "undefined") return "demo-token";

  return window.localStorage.getItem(tokenKey) ?? "demo-token";
}

export function setAuthSession(token: string, user: AuthUser) {
  window.localStorage.setItem(tokenKey, token);
  window.localStorage.setItem(userKey, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(userKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(userKey);
}
