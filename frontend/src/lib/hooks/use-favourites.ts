"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addFavourite, getFavourites, removeFavourite } from "@/lib/api/library";
import type { Book, User } from "@/lib/api/types";
import { useSession } from "@/lib/hooks/use-session";

export function useFavourites() {
  const { isAuthed } = useSession();
  return useQuery({ queryKey: ["favourites"], queryFn: getFavourites, enabled: isAuthed, staleTime: 30_000 });
}

interface FavouriteVariables {
  book: Book;
  /** The state we want after the request. */
  favourite: boolean;
}
interface FavouriteSnapshot {
  me?: User;
  list?: Book[];
}

export function useToggleFavourite() {
  const qc = useQueryClient();
  return useMutation<void, Error, FavouriteVariables, FavouriteSnapshot>({
    mutationFn: ({ book, favourite }) => (favourite ? addFavourite(book._id) : removeFavourite(book._id)),
    onMutate: async ({ book, favourite }) => {
      await Promise.all([qc.cancelQueries({ queryKey: ["me"] }), qc.cancelQueries({ queryKey: ["favourites"] })]);
      const snapshot: FavouriteSnapshot = {
        me: qc.getQueryData<User>(["me"]),
        list: qc.getQueryData<Book[]>(["favourites"]),
      };
      qc.setQueryData<User>(["me"], (u) => {
        if (!u) return u;
        const without = u.favourite.filter((id) => id !== book._id);
        return { ...u, favourite: favourite ? [...without, book._id] : without };
      });
      qc.setQueryData<Book[]>(["favourites"], (list) => {
        if (!list) return list;
        const without = list.filter((b) => b._id !== book._id);
        return favourite ? [...without, book] : without;
      });
      return snapshot;
    },
    onError: (error, _vars, snapshot) => {
      if (snapshot?.me) qc.setQueryData(["me"], snapshot.me);
      if (snapshot?.list) qc.setQueryData(["favourites"], snapshot.list);
      toast.error(error.message);
    },
    onSuccess: (_data, { favourite }) => toast.success(favourite ? "Saved to favourites" : "Removed from favourites"),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["me"] });
      void qc.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
}
