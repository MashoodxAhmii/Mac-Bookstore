"use client";

import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { useAuthPrompt } from "@/components/providers/auth-prompt";
import type { Book } from "@/lib/api/types";
import { flyToCart } from "@/lib/fly-to-cart";
import { useAddToCart } from "@/lib/hooks/use-cart";
import { useUserSets } from "@/lib/hooks/use-me";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  book: Book;
  /** "icon" is the round quick-add on cards; "full" is the labelled button on the detail page. */
  variant?: "icon" | "full";
  className?: string;
}

/**
 * Add to cart, with three states: out of stock (disabled), in cart (links to the cart), and add.
 * The cover that flies toward the cart icon is found via the closest `[data-cover-scope]` ancestor.
 */
export function AddToCartButton({ book, variant = "full", className }: AddToCartButtonProps) {
  const { isAuthed } = useSession();
  const { cartIds } = useUserSets();
  const { promptSignIn } = useAuthPrompt();
  const add = useAddToCart();

  const outOfStock = book.stock <= 0;
  const inCart = isAuthed && cartIds.has(book._id);

  if (variant === "icon") {
    const base =
      "pointer-events-auto grid size-9 place-items-center rounded-full bg-background/80 text-foreground shadow-card backdrop-blur-lg backdrop-saturate-150 transition-[opacity,background-color] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-11 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100";
    if (outOfStock) return null;
    if (inCart) {
      return (
        <Link href="/cart" aria-label={`${book.title} is in your cart. View cart`} className={cn(base, "text-success", className)}>
          <Check className="size-5" aria-hidden />
        </Link>
      );
    }
    return (
      <button
        type="button"
        aria-label={`Add ${book.title} to cart`}
        aria-disabled={add.isPending || undefined}
        className={cn(base, className)}
        onClick={(event) => {
          if (!isAuthed) return promptSignIn("Sign in to add books to your cart.");
          if (add.isPending) return;
          flyToCart(event.currentTarget.closest("[data-cover-scope]")?.querySelector<HTMLElement>("[data-cover]") ?? null, book.url);
          add.mutate(book);
        }}
      >
        <ShoppingBag className="size-5" aria-hidden />
      </button>
    );
  }

  if (outOfStock) {
    return (
      <Button size="lg" disabled className={className}>
        Out of stock
      </Button>
    );
  }
  if (inCart) {
    return (
      <Button asChild size="lg" variant="outline" className={className}>
        <Link href="/cart">
          <Check aria-hidden /> In cart
        </Link>
      </Button>
    );
  }
  return (
    <Button
      size="lg"
      variant="highlight"
      className={className}
      aria-disabled={add.isPending || undefined}
      onClick={(event) => {
        if (!isAuthed) return promptSignIn("Sign in to add books to your cart.");
        if (add.isPending) return;
        flyToCart(event.currentTarget.closest("[data-cover-scope]")?.querySelector<HTMLElement>("[data-cover]") ?? null, book.url);
        add.mutate(book);
      }}
    >
      <ShoppingBag aria-hidden /> Add to cart
    </Button>
  );
}
