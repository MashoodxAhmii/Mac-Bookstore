"use client";

import { BookGrid } from "@/components/books/book-grid";
import { BookFilters } from "@/components/books/book-filters";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { BookGridSkeleton } from "@/components/states/skeletons";
import { Button } from "@/components/vengeance/button";
import { useBooks } from "@/lib/hooks/use-books";
import { useCatalogFilters, useFacets, useFilteredBooks, usePriceBounds, paginate } from "@/lib/hooks/use-catalog";
import { SearchX } from "lucide-react";

export function BooksPageClient() {
  const { data: books, isPending, isError, error, refetch } = useBooks();
  const [filters, setFilters] = useCatalogFilters();
  const { genres, languages } = useFacets(books);
  const priceBounds = usePriceBounds(books);
  const filtered = useFilteredBooks(books, filters);
  const { items, hasMore } = paginate(filtered, filters.page);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-medium">Books</h1>
        <p className="text-muted-foreground">Search, filter and sort the full catalog.</p>
      </div>

      <BookFilters
        filters={filters}
        onChange={setFilters}
        genres={genres}
        languages={languages}
        priceBounds={priceBounds}
        resultCount={filtered.length}
      />

      {isPending ? (
        <BookGridSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<SearchX aria-hidden />}
          title="No books match"
          description="Try a different search, or clear your filters."
          action={
            <Button variant="outline" onClick={() => setFilters({ q: "", genre: "", language: "", minPrice: null, maxPrice: null })}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <BookGrid books={items} />
          {hasMore ? (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => setFilters({ page: filters.page + 1 })}>
                Show more
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
