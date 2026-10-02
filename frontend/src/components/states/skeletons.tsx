import { Skeleton } from "@/components/vengeance/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="aspect-[2/3] w-full rounded-card" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3.5 w-1/2" />
    </div>
  );
}

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading books"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto w-full max-w-6xl space-y-6 px-5 py-12">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="grid gap-4 pt-4 sm:grid-cols-2">
        <Skeleton className="h-40 rounded-card" />
        <Skeleton className="h-40 rounded-card" />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-card" />
      ))}
    </div>
  );
}
