"use client";

import { AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { CartRow } from "@/components/cart/cart-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { RowSkeleton } from "@/components/states/skeletons";
import { Button } from "@/components/vengeance/button";
import { useCart } from "@/lib/hooks/use-cart";

export function CartPageClient() {
  const { data: cart, isPending, isError, error, refetch } = useCart();

  const inStock = useMemo(() => (cart ?? []).filter((b) => b.stock > 0), [cart]);
  const total = useMemo(() => inStock.reduce((sum, b) => sum + b.price, 0), [inStock]);
  const hasOutOfStock = (cart?.length ?? 0) > inStock.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-serif text-2xl font-medium">Your cart</h1>

      {isPending ? (
        <RowSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !cart || cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag aria-hidden />}
          title="Your cart is empty"
          description="Books you add will show up here."
          action={
            <Button asChild>
              <Link href="/books">Browse books</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
          <ul>
            <AnimatePresence initial={false}>
              {cart.map((book) => (
                <CartRow key={book._id} book={book} />
              ))}
            </AnimatePresence>
          </ul>
          <CartSummary itemCount={inStock.length} total={total} hasOutOfStock={hasOutOfStock} />
        </div>
      )}
    </div>
  );
}
