"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/vengeance/button";
import type { Book } from "@/lib/api/types";

export function NewArrivalsShelf({ books }: { books: Book[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  if (books.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") scrollBy(1);
    if (event.key === "ArrowLeft") scrollBy(-1);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-medium">New arrivals</h2>
          <p className="text-muted-foreground">The newest additions to the shelf.</p>
        </div>
        <div className="hidden gap-1 sm:flex">
          <Button variant="outline" size="icon" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <ChevronLeft aria-hidden />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scrollBy(1)} aria-label="Scroll right">
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </Reveal>
      <ul
        ref={scrollerRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="New arrivals, scrollable"
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mx-0 sm:px-0"
      >
        {books.slice(0, 12).map((book) => (
          <li key={book._id} className="w-40 shrink-0 snap-start sm:w-48">
            <BookCard book={book} sizes="192px" />
          </li>
        ))}
      </ul>
    </section>
  );
}
