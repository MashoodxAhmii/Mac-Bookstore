"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authFlags } from "@/lib/store/auth-flags";
import { useAuth } from "@/lib/store/auth";

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useCallback(() => {
    authFlags.signingOut = true;
    useAuth.getState().clearSession();
    queryClient.clear();
    router.replace("/");
    toast.success("Signed out");
    window.setTimeout(() => {
      authFlags.signingOut = false;
    }, 1500);
  }, [router, queryClient]);
}
