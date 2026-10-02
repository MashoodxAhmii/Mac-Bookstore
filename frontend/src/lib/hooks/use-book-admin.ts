"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addBook, deleteBook, updateBook } from "@/lib/api/books";
import type { BookInput } from "@/lib/api/types";

function useInvalidateCatalog() {
  const qc = useQueryClient();
  return (id?: string) => {
    void qc.invalidateQueries({ queryKey: ["books"] });
    if (id) void qc.invalidateQueries({ queryKey: ["book", id] });
    void qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    void qc.invalidateQueries({ queryKey: ["cart"] });
    void qc.invalidateQueries({ queryKey: ["favourites"] });
    void qc.invalidateQueries({ queryKey: ["orders"] });
  };
}

export function useCreateBook() {
  const invalidate = useInvalidateCatalog();
  return useMutation<void, Error, BookInput>({
    mutationFn: (input) => addBook(input),
    // add-book does not return the created book, so refetch the list.
    onSuccess: () => toast.success("Book added"),
    onSettled: () => invalidate(),
  });
}

export function useUpdateBook() {
  const invalidate = useInvalidateCatalog();
  return useMutation<void, Error, { id: string; input: BookInput }>({
    mutationFn: ({ id, input }) => updateBook(id, input),
    onSuccess: () => toast.success("Book saved"),
    onSettled: (_d, _e, vars) => invalidate(vars.id),
  });
}

export function useDeleteBook() {
  const invalidate = useInvalidateCatalog();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteBook(id),
    onSuccess: () => toast.success("Book deleted"),
    onError: (error) => toast.error(error.message),
    onSettled: (_d, _e, id) => invalidate(id),
  });
}
