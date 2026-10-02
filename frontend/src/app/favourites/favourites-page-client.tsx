"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { BookGridSkeleton } from "@/components/states/skeletons";
import { Button } from "@/components/vengeance/button";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { duration, ease } from "@/lib/motion";

export function FavouritesPageClient() {
  const { data: books, isPending, isError, error, refetch } = useFavourites();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-serif text-2xl font-medium">Favourites</h1>

      {isPending ? (
        <BookGridSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !books || books.length === 0 ? (
        <EmptyState
          icon={<Heart aria-hidden />}
          title="No favourites yet"
          description="Save books you like and find them here."
          action={
            <Button asChild>
              <Link href="/books">Browse books</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {books.map((book) => (
              <motion.li
                key={book._id}
                layout="position"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: duration.base, ease: ease.out }}
              >
                <BookCard book={book} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
