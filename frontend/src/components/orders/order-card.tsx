import Link from "next/link";
import { BookCover } from "@/components/books/book-cover";
import { OrderTimeline } from "@/components/orders/order-timeline";
import type { Order } from "@/lib/api/types";
import { formatDate, formatPrice } from "@/lib/format";

export function OrderCard({ order }: { order: Order }) {
  return (
    <li className="flex flex-col gap-4 rounded-card border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <div className="w-14 shrink-0">
          {order.book ? (
            <Link href={`/books/${order.book._id}`}>
              <BookCover url={order.book.url} title={order.book.title} sizes="56px" />
            </Link>
          ) : (
            <BookCover sizes="56px" />
          )}
        </div>
        <div className="min-w-0">
          {order.book ? (
            <Link href={`/books/${order.book._id}`} className="truncate font-serif hover:underline">
              {order.book.title}
            </Link>
          ) : (
            <p className="truncate font-serif text-muted-foreground">Book no longer available</p>
          )}
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
          {order.book ? <p className="text-sm font-medium">{formatPrice(order.book.price)}</p> : null}
        </div>
      </div>
      <div className="sm:w-64">
        <OrderTimeline status={order.status} />
      </div>
    </li>
  );
}
