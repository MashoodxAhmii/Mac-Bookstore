import Link from "next/link";
import { Button } from "@/components/vengeance/button";
import { formatPrice } from "@/lib/format";

interface CartSummaryProps {
  itemCount: number;
  total: number;
  hasOutOfStock: boolean;
  href?: string;
  ctaLabel?: string;
}

export function CartSummary({ itemCount, total, hasOutOfStock, href = "/checkout", ctaLabel = "Checkout" }: CartSummaryProps) {
  return (
    <div className="space-y-4 rounded-card border border-border bg-card p-5 shadow-card md:sticky md:top-24">
      <h2 className="font-serif text-lg font-medium">Summary</h2>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Items</dt>
          <dd>{itemCount}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5 text-base font-medium">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {hasOutOfStock ? (
        <p className="text-sm text-highlight-text">Out-of-stock items won&apos;t be included.</p>
      ) : null}
      <Button asChild size="lg" className="w-full" disabled={itemCount === 0}>
        <Link href={href} aria-disabled={itemCount === 0}>
          {ctaLabel}
        </Link>
      </Button>
    </div>
  );
}
