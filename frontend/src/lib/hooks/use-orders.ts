"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllOrders, getOrderHistory, placeOrder, updateOrderStatus } from "@/lib/api/library";
import type { AdminOrder, Book, OrderStatus } from "@/lib/api/types";
import { useSession } from "@/lib/hooks/use-session";

export function useOrders() {
  const { isAuthed } = useSession();
  return useQuery({ queryKey: ["orders"], queryFn: getOrderHistory, enabled: isAuthed, staleTime: 30_000 });
}

export function useAdminOrders() {
  const { isAdmin } = useSession();
  return useQuery({ queryKey: ["admin", "orders"], queryFn: getAllOrders, enabled: isAdmin, staleTime: 15_000 });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation<void, Error, Book[]>({
    mutationFn: (books) => placeOrder(books),
    // Orders are created one at a time on the server, so refetch on failure too: some may already exist.
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["cart"] });
      void qc.invalidateQueries({ queryKey: ["orders"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string; status: OrderStatus }>({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (_d, { status }) => toast.success(`Order marked as ${status.toLowerCase()}`),
    onError: (error) => toast.error(error.message),
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export type { AdminOrder };
