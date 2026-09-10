import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login and register answer 401 for wrong credentials — that is a form error,
// not a dead session, and the auth screen shows it itself.
const isAuthRequest = (url = "") =>
  url.includes("/auth/login") || url.includes("/auth/register");

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // This read used to be error.res?.status, which is always undefined, so a
    // dead session never logged anyone out — they just sat on a dashboard
    // where every request failed. 401 = user gone, 403 = token no longer valid.
    const status = error.response?.status;
    const expired = status === 401 || status === 403;

    if (expired && !isAuthRequest(error.config?.url)) {
      useAuthStore.getState().logOut();
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);
