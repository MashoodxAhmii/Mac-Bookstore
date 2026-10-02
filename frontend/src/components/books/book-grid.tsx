"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookCard } from "@/components/books/book-card";
import type { Book } from "@/lib/api/types";
import { LAYOUT_ANIMATION_LIMIT, duration, ease } from "@/lib/motion";

/**
 * Responsive grid (2, 3, 4, 5 columns). Filter changes and removals reflow with layout animation,
 * which is switched off above ~60 visible items to keep large lists cheap.
 */
export function BookGrid({ books }: { books: Book[] }) {
  const layoutOn = books.length <= LAYOUT_ANIMATION_LIMIT;

  return (
    <ul className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <AnimatePresence mode="popLayout" initial={false}>
        {books.map((book, index) => (
          <motion.li
            key={book._id}
            layout={layoutOn ? "position" : false}
            initial={layoutOn ? { opacity: 0, scale: 0.97 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={layoutOn ? { opacity: 0, scale: 0.97 } : undefined}
            transition={{ duration: duration.base, ease: ease.out, layout: ease.layout }}
          >
            <BookCard book={book} priority={index < 4} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
