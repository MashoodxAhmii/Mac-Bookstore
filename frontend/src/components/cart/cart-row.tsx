"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Button } from "@/components/vengeance/button";
import { Badge } from "@/components/vengeance/badge";
import type { Book } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useRemoveFromCart } from "@/lib/hooks/use-cart";
import { duration, ease } from "@/lib/motion";

export function CartRow({ book }: { book: Book }) {
  const remove = useRemoveFromCart();
  const outOfStock = book.stock <= 0;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: duration.base, ease: ease.out }}
      className="flex gap-4 border-b border-border py-4 last:border-0"
    >
      <Link href={`/books/${book._id}`} className="w-16 shrink-0 sm:w-20">
        <BookCover url={book.url} title={book.title} sizes="80px" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/books/${book._id}`} className="font-serif text-base font-medium hover:underline">
          {book.title}
        </Link>
        <p className="truncate text-sm text-muted-foreground">{book.author}</p>
        {outOfStock ? (
          <Badge variant="destructive" className="mt-2">
            Out of stock — excluded from checkout
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="font-medium">{formatPrice(book.price)}</p>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Remove ${book.title} from cart`}
          aria-disabled={remove.isPending || undefined}
          onClick={() => !remove.isPending && remove.mutate(book._id)}
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    </motion.li>
  );
}
