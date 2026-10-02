"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useReducedMotion } from "motion/react";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { AddressPanel } from "@/components/cart/address-panel";
import { OrderConfirmCheck } from "@/components/cart/order-confirm-check";
import { BookCover } from "@/components/books/book-cover";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { RowSkeleton } from "@/components/states/skeletons";
import { Button } from "@/components/vengeance/button";
import { Spinner } from "@/components/vengeance/spinner";
import { useCart } from "@/lib/hooks/use-cart";
import { useMe } from "@/lib/hooks/use-me";
import { usePlaceOrder } from "@/lib/hooks/use-orders";
import { formatPrice } from "@/lib/format";

export function CheckoutPageClient() {
  const { data: cart, isPending, isError, error, refetch } = useCart();
  const { data: me } = useMe();
  const placeOrder = usePlaceOrder();
  const [placed, setPlaced] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!placed || reduced) return;
    // A brief, tasteful burst in the theme's own amber/ink palette — never blocks or grabs focus.
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 38,
      gravity: 1.1,
      ticks: 180,
      origin: { y: 0.35 },
      colors: ["#f2b14c", "#24357a", "#187a50", "#e9ecf4"],
      disableForReducedMotion: true,
    });
  }, [placed, reduced]);

  const inStock = useMemo(() => (cart ?? []).filter((b) => b.stock > 0), [cart]);
  const total = useMemo(() => inStock.reduce((sum, b) => sum + b.price, 0), [inStock]);
  const outOfStockCount = (cart?.length ?? 0) - inStock.length;

  if (placed) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
        <OrderConfirmCheck className="size-20" />
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-medium">Order placed</h1>
          <p className="text-muted-foreground">Your books are on their way. You can track them from your orders.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/orders">View orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/books">Keep browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-medium">Checkout</h1>

      <section className="space-y-4 rounded-card border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground">Delivery address</h2>
        {me ? <AddressPanel address={me.address} /> : <div className="h-10 animate-pulse rounded-input bg-secondary" />}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground">Review order</h2>
        {isPending ? (
          <RowSkeleton />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : !cart || cart.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag aria-hidden />}
            title="Your cart is empty"
            description="Add a book before checking out."
            action={
              <Button asChild>
                <Link href="/books">Browse books</Link>
              </Button>
            }
          />
        ) : (
          <>
            <ul className="divide-y divide-border rounded-card border border-border">
              {cart.map((book) => (
                <li key={book._id} className="flex items-center gap-4 p-4">
                  <div className="w-14 shrink-0">
                    <BookCover url={book.url} title={book.title} sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif">{book.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{book.author}</p>
                    {book.stock <= 0 ? <p className="text-sm text-destructive">Out of stock — excluded</p> : null}
                  </div>
                  <p className="font-medium">{formatPrice(book.price)}</p>
                </li>
              ))}
            </ul>
            {outOfStockCount > 0 ? (
              <p className="flex items-center gap-2 text-sm text-highlight-text">
                <AlertCircle className="size-4" aria-hidden />
                {outOfStockCount} {outOfStockCount === 1 ? "item is" : "items are"} out of stock and won&apos;t be ordered.
              </p>
            ) : null}
            <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </>
        )}
      </section>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

      <Button
        size="lg"
        className="w-full"
        disabled={inStock.length === 0 || placeOrder.isPending}
        aria-disabled={inStock.length === 0 || placeOrder.isPending}
        onClick={() => {
          setSubmitError(null);
          placeOrder.mutate(inStock, {
            onSuccess: () => setPlaced(true),
            onError: (err) => setSubmitError(err.message),
          });
        }}
      >
        {placeOrder.isPending ? <Spinner /> : null} Place order
      </Button>
    </div>
  );
}
