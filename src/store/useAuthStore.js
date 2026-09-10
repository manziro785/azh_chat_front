import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) => {
        localStorage.setItem("token", token);
        set({ token, isAuthenticated: !!token });
      },
      logOut: () => {
        // axios reads the token straight from localStorage, so clearing only
        // the store used to leave a working token behind on sign-out.
        localStorage.removeItem("token");
        set({ token: null, isAuthenticated: false });
      },
    }),
    { name: "auth_chat" }
  )
);
