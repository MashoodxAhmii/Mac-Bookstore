"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/vengeance/table";
import { ErrorState } from "@/components/states/error-state";
import { EmptyState } from "@/components/states/empty-state";
import { RowSkeleton } from "@/components/states/skeletons";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/api/types";
import { useAdminOrders, useUpdateOrderStatus } from "@/lib/hooks/use-orders";
import { formatDate, formatPrice, shortId } from "@/lib/format";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { Spinner } from "@/components/vengeance/spinner";

export function AdminOrdersClient() {
  const { data: orders, isPending, isError, error, refetch } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = orders ?? [];
    return statusFilter === "all" ? list : list.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")}>
          <SelectTrigger className="w-48" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <RowSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No orders" description="Orders matching this filter will show up here." />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Book</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{shortId(order._id)}</TableCell>
                  <TableCell className="max-w-44">
                    {order.customer ? (
                      <>
                        <p className="truncate">{order.customer.username}</p>
                        <p className="truncate text-xs text-muted-foreground">{order.customer.email}</p>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-44 truncate">{order.book?.title ?? "Removed"}</TableCell>
                  <TableCell className="text-right">{order.book ? formatPrice(order.book.price) : "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(v) => {
                          setPendingId(order._id);
                          updateStatus.mutate(
                            { id: order._id, status: v as OrderStatus },
                            { onSettled: () => setPendingId((id) => (id === order._id ? null : id)) },
                          );
                        }}
                      >
                        <SelectTrigger className="h-9 w-44" aria-label={`Status for order ${shortId(order._id)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {pendingId === order._id ? <Spinner className="size-3.5" /> : null}
                    </div>
                    <div className="mt-1 hidden xl:block">
                      <OrderTimeline status={order.status} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
