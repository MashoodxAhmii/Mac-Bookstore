"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addToCart, getCart, removeFromCart } from "@/lib/api/library";
import type { Book, User } from "@/lib/api/types";
import { useMe } from "@/lib/hooks/use-me";
import { useSession } from "@/lib/hooks/use-session";

export function useCart() {
  const { isAuthed } = useSession();
  return useQuery({ queryKey: ["cart"], queryFn: getCart, enabled: isAuthed, staleTime: 30_000 });
}

/** Cart size for the navbar badge. Comes from `me` so it is instant and works before the cart list loads. */
export function useCartCount(): number {
  const { data: me } = useMe();
  return me?.cart.length ?? 0;
}

interface CartSnapshot {
  me?: User;
  cart?: Book[];
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation<void, Error, Book, CartSnapshot>({
    mutationFn: (book) => addToCart(book._id),
    onMutate: async (book) => {
      await Promise.all([qc.cancelQueries({ queryKey: ["me"] }), qc.cancelQueries({ queryKey: ["cart"] })]);
      const snapshot: CartSnapshot = {
        me: qc.getQueryData<User>(["me"]),
        cart: qc.getQueryData<Book[]>(["cart"]),
      };
      qc.setQueryData<User>(["me"], (u) => (u && !u.cart.includes(book._id) ? { ...u, cart: [...u.cart, book._id] } : u));
      qc.setQueryData<Book[]>(["cart"], (c) => (c && !c.some((b) => b._id === book._id) ? [book, ...c] : c));
      return snapshot;
    },
    onError: (error, _book, snapshot) => {
      if (snapshot?.me) qc.setQueryData(["me"], snapshot.me);
      if (snapshot?.cart) qc.setQueryData(["cart"], snapshot.cart);
      toast.error(error.message);
    },
    onSuccess: () => toast.success("Added to cart"),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["me"] });
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation<void, Error, string, CartSnapshot>({
    mutationFn: (bookId) => removeFromCart(bookId),
    onMutate: async (bookId) => {
      await Promise.all([qc.cancelQueries({ queryKey: ["me"] }), qc.cancelQueries({ queryKey: ["cart"] })]);
      const snapshot: CartSnapshot = {
        me: qc.getQueryData<User>(["me"]),
        cart: qc.getQueryData<Book[]>(["cart"]),
      };
      qc.setQueryData<User>(["me"], (u) => (u ? { ...u, cart: u.cart.filter((id) => id !== bookId) } : u));
      qc.setQueryData<Book[]>(["cart"], (c) => c?.filter((b) => b._id !== bookId));
      return snapshot;
    },
    onError: (error, _id, snapshot) => {
      if (snapshot?.me) qc.setQueryData(["me"], snapshot.me);
      if (snapshot?.cart) qc.setQueryData(["cart"], snapshot.cart);
      toast.error(error.message);
    },
    onSuccess: () => toast.success("Removed from cart"),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["me"] });
      void qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
