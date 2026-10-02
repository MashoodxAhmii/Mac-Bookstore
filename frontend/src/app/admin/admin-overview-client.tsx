"use client";

import { useMemo } from "react";
import { AlertTriangle, DollarSign, Layers, ListChecks } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ErrorState } from "@/components/states/error-state";
import { PageSkeleton } from "@/components/states/skeletons";
import { Badge } from "@/components/vengeance/badge";
import { useBooks } from "@/lib/hooks/use-books";
import { useAdminOrders } from "@/lib/hooks/use-orders";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

export function AdminOverviewClient() {
  const { data: books, isPending: booksPending, isError: booksError, error: bErr, refetch: refetchBooks } = useBooks();
  const { data: orders, isPending: ordersPending, isError: ordersError, error: oErr, refetch: refetchOrders } = useAdminOrders();

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    let revenue = 0;
    for (const order of orders ?? []) {
      byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
      if (order.status !== "Canceled" && order.book) revenue += order.book.price;
    }
    const lowStock = (books ?? []).filter((b) => b.stock <= siteConfig.lowStockThreshold).sort((a, b) => a.stock - b.stock);
    return { byStatus, revenue, lowStock };
  }, [books, orders]);

  if (booksPending || ordersPending) return <PageSkeleton />;
  if (booksError) return <ErrorState error={bErr} onRetry={() => refetchBooks()} />;
  if (ordersError) return <ErrorState error={oErr} onRetry={() => refetchOrders()} />;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total books" value={books?.length ?? 0} icon={<Layers className="size-4" aria-hidden />} />
        <StatCard label="Total orders" value={orders?.length ?? 0} icon={<ListChecks className="size-4" aria-hidden />} />
        <StatCard
          label="Estimated revenue"
          value={stats.revenue}
          format={formatPrice}
          icon={<DollarSign className="size-4" aria-hidden />}
          hint="Sum of non-canceled order prices"
        />
        <StatCard
          label="Low stock"
          value={stats.lowStock.length}
          icon={<AlertTriangle className="size-4" aria-hidden />}
          hint={`${siteConfig.lowStockThreshold} or fewer in stock`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-card border border-border bg-card p-5 shadow-card">
          <h2 className="font-serif text-lg font-medium">Orders by status</h2>
          <ul className="space-y-2">
            {(["Order Placed", "Out for delivery", "Delivered", "Canceled"] as const).map((status) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <span>{status}</span>
                <Badge variant="secondary">{stats.byStatus[status] ?? 0}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 rounded-card border border-border bg-card p-5 shadow-card">
          <h2 className="font-serif text-lg font-medium">Low stock</h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing is running low.</p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStock.slice(0, 6).map((book) => (
                <li key={book._id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{book.title}</span>
                  <Badge variant={book.stock <= 0 ? "destructive" : "highlight"}>
                    {book.stock <= 0 ? "Out of stock" : `${book.stock} left`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
