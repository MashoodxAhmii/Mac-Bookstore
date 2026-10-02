"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { AUTH_STORAGE_KEY, useAuth } from "@/lib/store/auth";

/**
 * Reads the persisted session once on the client (so server and first client render match),
 * keeps tabs in sync, and registers the 401 / expired-403 handler used by the API client.
 */
export function AuthBootstrap() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve(useAuth.persist.rehydrate()).then(() => {
      if (!cancelled) useAuth.getState().setHasHydrated(true);
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) return;
      void Promise.resolve(useAuth.persist.rehydrate()).then(() => {
        // Signed out (or switched user) in another tab: drop everything cached for the old session.
        queryClient.clear();
      });
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler((reason) => {
      const { token, clearSession } = useAuth.getState();
      if (!token) return; // already handled by an earlier failing request
      clearSession();
      queryClient.clear();
      const here = window.location.pathname + window.location.search;
      if (window.location.pathname.startsWith("/sign-in")) return;
      const params = new URLSearchParams({ next: here, expired: reason === "expired" ? "1" : "2" });
      router.replace(`/sign-in?${params.toString()}`);
    });
    return () => setUnauthorizedHandler(null);
  }, [router, queryClient]);

  return null;
}
