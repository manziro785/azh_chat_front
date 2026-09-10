import { create } from "zustand";

// Replaces the browser alert() the app used for every server error.
// Lives in zustand (already used for auth) so non-React code — react-query
// onError callbacks — can push a toast without a hook.

let nextId = 0;
const LIFETIME_MS = 4200;

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: ({ title, body = "", tone = "ok" }) => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts, { id, title, body, tone }] }));
    setTimeout(() => get().dismiss(id), LIFETIME_MS);
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  ok: (title, body) => useToastStore.getState().push({ title, body }),
  warn: (title, body) =>
    useToastStore.getState().push({ title, body, tone: "warn" }),
};
