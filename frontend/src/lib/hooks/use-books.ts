"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBooks, getBookById } from "@/lib/api/books";
import type { Book } from "@/lib/api/types";

export const BOOKS_STALE_TIME = 60_000;

/** Fetch every book once; filtering, sorting and pagination are client-side. */
export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
    staleTime: BOOKS_STALE_TIME,
  });
}

/** `data` is `null` when the book does not exist. Uses the cached list as instant initial data. */
export function useBook(id: string) {
  const qc = useQueryClient();
  return useQuery<Book | null>({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    staleTime: BOOKS_STALE_TIME,
    initialData: () => qc.getQueryData<Book[]>(["books"])?.find((b) => b._id === id),
    initialDataUpdatedAt: () => qc.getQueryState(["books"])?.dataUpdatedAt,
  });
}

export interface GenreCount {
  genre: string;
  count: number;
}

export function useGenres(books: Book[] | undefined): GenreCount[] {
  return useMemo(() => {
    const counts = new Map<string, number>();
    for (const book of books ?? []) counts.set(book.genre, (counts.get(book.genre) ?? 0) + 1);
    return [...counts.entries()]
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre));
  }, [books]);
}
