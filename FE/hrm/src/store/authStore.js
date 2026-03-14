import { SESSION_ACCOUNT, SESSION_LOGGED_IN } from "../config/constants";

export const loginSuccess = (user) => {
  sessionStorage.setItem(SESSION_ACCOUNT, JSON.stringify(user));
  sessionStorage.setItem(SESSION_LOGGED_IN, "true");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};