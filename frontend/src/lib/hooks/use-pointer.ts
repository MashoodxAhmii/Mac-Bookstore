"use client";

import { useMemo, useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribeToQuery = useMemo(() => subscribe(query), [query]);
  return useSyncExternalStore(
    subscribeToQuery,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True on devices with a real hover-capable, fine pointer (mouse, trackpad). Tilt and hover lifts use this. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
