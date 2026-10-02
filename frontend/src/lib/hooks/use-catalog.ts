"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Book } from "@/lib/api/types";

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title-asc", label: "Title: A to Z" },
] as const;
export type SortValue = (typeof SORTS)[number]["value"];

const PAGE_SIZE = 24;

export interface CatalogFilters {
  q: string;
  genre: string; // "" = all
  language: string; // "" = all
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortValue;
  page: number;
}

function parseNum(value: string | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Reads and writes filter state to the URL, so filters survive reload and back/forward. */
export function useCatalogFilters(): [CatalogFilters, (patch: Partial<CatalogFilters>) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: CatalogFilters = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      genre: searchParams.get("genre") ?? "",
      language: searchParams.get("language") ?? "",
      minPrice: parseNum(searchParams.get("min")),
      maxPrice: parseNum(searchParams.get("max")),
      sort: (SORTS.find((s) => s.value === searchParams.get("sort"))?.value ?? "newest") as SortValue,
      page: Math.max(1, parseNum(searchParams.get("page")) ?? 1),
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const next = { ...filters, ...patch };
      // Any change other than paging returns to page 1.
      if (!("page" in patch)) next.page = 1;
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.genre) params.set("genre", next.genre);
      if (next.language) params.set("language", next.language);
      if (next.minPrice !== null) params.set("min", String(next.minPrice));
      if (next.maxPrice !== null) params.set("max", String(next.maxPrice));
      if (next.sort !== "newest") params.set("sort", next.sort);
      if (next.page > 1) params.set("page", String(next.page));
      const qs = params.toString();
      router.push(qs ? `/books?${qs}` : "/books", { scroll: false });
    },
    [filters, router],
  );

  return [filters, setFilters];
}

export interface PriceBounds {
  min: number;
  max: number;
}

export function usePriceBounds(books: Book[] | undefined): PriceBounds {
  return useMemo(() => {
    if (!books || books.length === 0) return { min: 0, max: 100 };
    let min = Infinity;
    let max = -Infinity;
    for (const b of books) {
      if (b.price < min) min = b.price;
      if (b.price > max) max = b.price;
    }
    if (min === max) max = min + 1;
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [books]);
}

export function useFilteredBooks(books: Book[] | undefined, filters: CatalogFilters) {
  return useMemo(() => {
    let list = books ?? [];
    const q = filters.q.trim().toLowerCase();
    if (q) list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    if (filters.genre) list = list.filter((b) => b.genre === filters.genre);
    if (filters.language) list = list.filter((b) => b.language === filters.language);
    if (filters.minPrice !== null) list = list.filter((b) => b.price >= filters.minPrice!);
    if (filters.maxPrice !== null) list = list.filter((b) => b.price <= filters.maxPrice!);

    list = [...list];
    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // "newest": the backend already returns newest first; keep that order.
        break;
    }
    return list;
  }, [books, filters]);
}

export function paginate<T>(items: T[], page: number): { items: T[]; hasMore: boolean } {
  const end = page * PAGE_SIZE;
  return { items: items.slice(0, end), hasMore: items.length > end };
}

export function useFacets(books: Book[] | undefined) {
  return useMemo(() => {
    const genres = new Set<string>();
    const languages = new Set<string>();
    for (const b of books ?? []) {
      genres.add(b.genre);
      languages.add(b.language);
    }
    return { genres: [...genres].sort(), languages: [...languages].sort() };
  }, [books]);
}
