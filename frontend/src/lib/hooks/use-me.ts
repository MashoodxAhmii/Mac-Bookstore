"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMe, updateAddress } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";
import { useSession } from "@/lib/hooks/use-session";

export function useMe() {
  const { isAuthed } = useSession();
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthed,
    staleTime: 5 * 60_000,
  });
}

/** `favouriteIds` and `cartIds` come straight from the `me` query, so cards need no extra requests. */
export function useUserSets() {
  const { data: me } = useMe();
  return useMemo(
    () => ({
      favouriteIds: new Set(me?.favourite ?? []),
      cartIds: new Set(me?.cart ?? []),
    }),
    [me],
  );
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (address: string) => updateAddress(address),
    onMutate: async (address) => {
      await qc.cancelQueries({ queryKey: ["me"] });
      const previous = qc.getQueryData<User>(["me"]);
      qc.setQueryData<User>(["me"], (u) => (u ? { ...u, address } : u));
      return { previous };
    },
    onError: (error, _address, ctx) => {
      if (ctx?.previous) qc.setQueryData(["me"], ctx.previous);
      toast.error(error.message);
    },
    onSuccess: () => toast.success("Address saved"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}
