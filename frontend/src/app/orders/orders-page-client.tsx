"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { OrderCard } from "@/components/orders/order-card";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { RowSkeleton } from "@/components/states/skeletons";
import { Button } from "@/components/vengeance/button";
import { useOrders } from "@/lib/hooks/use-orders";

export function OrdersPageClient() {
  const { data: orders, isPending, isError, error, refetch } = useOrders();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-serif text-2xl font-medium">Orders</h1>

      {isPending ? (
        <RowSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon={<Package aria-hidden />}
          title="No orders yet"
          description="Orders you place will show up here."
          action={
            <Button asChild>
              <Link href="/books">Browse books</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}
