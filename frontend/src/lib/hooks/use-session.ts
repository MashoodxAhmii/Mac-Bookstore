"use client";

import { useAuth } from "@/lib/store/auth";

/** Session facts derived from the persisted store. `isAuthed` is false until localStorage has been read. */
export function useSession() {
  const token = useAuth((s) => s.token);
  const role = useAuth((s) => s.role);
  const hydrated = useAuth((s) => s.hasHydrated);
  return {
    hydrated,
    isAuthed: hydrated && !!token,
    isAdmin: hydrated && !!token && role === "admin",
  };
}
