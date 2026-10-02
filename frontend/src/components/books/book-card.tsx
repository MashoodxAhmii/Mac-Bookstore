"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BookCover } from "@/components/books/book-cover";
import { AddToCartButton } from "@/components/books/add-to-cart-button";
import { FavouriteButton } from "@/components/books/favourite-button";
import { StockBadge } from "@/components/books/stock-badge";
import { Tilt } from "@/components/motion/tilt";
import type { Book } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useFinePointer } from "@/lib/hooks/use-pointer";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * The one book card used by the catalog, favourites, shelves and "more in this genre".
 * The whole card is a link (the title link stretches over it); the heart and quick-add sit above it.
 */
export function BookCard({ book, priority, className, sizes }: BookCardProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  return (
    <motion.article
      data-cover-scope
      className={cn("group relative", className)}
      whileHover={fine && !reduced ? { y: -4 } : undefined}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      <div className="relative">
        <Tilt>
          <div data-cover className="rounded-[0.35rem] shadow-card transition-shadow duration-200 group-hover:shadow-card-hover">
            <BookCover url={book.url} title={book.title} author={book.author} priority={priority} sizes={sizes} />
          </div>
        </Tilt>
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2">
          <div className="flex items-start justify-between gap-2">
            <StockBadge stock={book.stock} />
            <FavouriteButton book={book} className="ml-auto" />
          </div>
          <div className="flex justify-end">
            <AddToCartButton book={book} variant="icon" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="line-clamp-2 font-serif text-base leading-snug font-medium">
          <Link
            href={`/books/${book._id}`}
            className="rounded-input outline-none after:absolute after:inset-0 after:z-10 after:rounded-card focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {book.title}
          </Link>
        </h3>
        <p className="truncate text-sm text-muted-foreground">{book.author}</p>
        <p className="text-sm font-medium">{formatPrice(book.price)}</p>
      </div>
    </motion.article>
  );
}
