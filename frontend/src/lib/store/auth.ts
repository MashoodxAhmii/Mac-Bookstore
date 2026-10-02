"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Role } from "@/lib/api/types";

export interface Session {
  token: string;
  id: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  id: string | null;
  role: Role | null;
  /** True once localStorage has been read. Guards wait for this before deciding. */
  hasHydrated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const AUTH_STORAGE_KEY = "bookstore-auth";

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      id: null,
      role: null,
      hasHydrated: false,
      setSession: ({ token, id, role }) => set({ token, id, role }),
      clearSession: () => set({ token: null, id: null, role: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only the session is persisted, never the hydration flag.
      partialize: (state) => ({ token: state.token, id: state.id, role: state.role }),
      // Hydrate manually on the client so server and first client render match.
      skipHydration: true,
    },
  ),
);
