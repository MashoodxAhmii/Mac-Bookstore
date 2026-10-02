"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import { AddToCartButton } from "@/components/books/add-to-cart-button";
import { BookCard } from "@/components/books/book-card";
import { BookCover } from "@/components/books/book-cover";
import { FavouriteButton } from "@/components/books/favourite-button";
import { StockBadge } from "@/components/books/stock-badge";
import { Tilt } from "@/components/motion/tilt";
import { Badge } from "@/components/vengeance/badge";
import { Button } from "@/components/vengeance/button";
import { Skeleton } from "@/components/vengeance/skeleton";
import { ErrorState } from "@/components/states/error-state";
import { NotFoundState } from "@/components/states/not-found-state";
import { BookFormDialog } from "@/components/admin/book-form-dialog";
import { useBook, useBooks } from "@/lib/hooks/use-books";
import { useSession } from "@/lib/hooks/use-session";
import { formatPrice } from "@/lib/format";

export function BookDetailClient({ id }: { id: string }) {
  const { data: book, isPending, isError, error, refetch } = useBook(id);
  const { data: allBooks } = useBooks();
  const { isAdmin } = useSession();
  const [editOpen, setEditOpen] = useState(false);

  // Client-side title update, since the data is fetched on the client.
  useEffect(() => {
    if (book) document.title = `${book.title} · Bookstore`;
  }, [book]);

  const moreInGenre = useMemo(() => {
    if (!book || !allBooks) return [];
    return allBooks.filter((b) => b.genre === book.genre && b._id !== book._id).slice(0, 6);
  }, [book, allBooks]);

  if (isPending) {
    return (
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
        <Skeleton className="aspect-[2/3] w-full max-w-sm rounded-card" />
        <div className="space-y-4">
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <NotFoundState title="We couldn't find that book" description="It may have been removed, or the link is out of date." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/books" className="hover:text-foreground hover:underline">
          Books
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link href={`/books?genre=${encodeURIComponent(book.genre)}`} className="hover:text-foreground hover:underline">
          {book.genre}
        </Link>
      </nav>

      <div data-cover-scope className="grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="mx-auto w-full max-w-sm md:mx-0">
          <Tilt max={10}>
            <div data-cover className="rounded-card shadow-card">
              <BookCover url={book.url} title={book.title} author={book.author} priority sizes="(min-width: 768px) 22rem, 80vw" />
            </div>
          </Tilt>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{book.genre}</Badge>
              <Badge variant="outline">{book.language}</Badge>
              <StockBadge stock={book.stock} />
            </div>
            <h1 className="font-serif text-3xl font-medium text-balance">{book.title}</h1>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
          </div>

          <p className="text-xl font-medium">{formatPrice(book.price)}</p>

          <div className="flex flex-wrap items-center gap-3">
            <AddToCartButton book={book} />
            <FavouriteButton book={book} variant="button" />
            {isAdmin ? (
              <Button variant="ghost" onClick={() => setEditOpen(true)}>
                <Pencil aria-hidden /> Edit
              </Button>
            ) : null}
          </div>

          {book.description ? <p className="prose-read text-foreground/90">{book.description}</p> : null}
        </div>
      </div>

      {moreInGenre.length > 0 ? (
        <section className="mt-20">
          <h2 className="mb-5 font-serif text-xl font-medium">More in {book.genre}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {moreInGenre.map((b) => (
              <li key={b._id}>
                <BookCard book={b} sizes="(min-width: 1024px) 16vw, 45vw" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {isAdmin ? <BookFormDialog open={editOpen} onOpenChange={setEditOpen} book={book} /> : null}
    </div>
  );
}
