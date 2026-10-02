import { Badge } from "@/components/vengeance/badge";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Out of stock, "Only N left" when low, and nothing otherwise. Text is always present, colour is never the only signal. */
export function StockBadge({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className={cn("bg-background", className)}>
        Out of stock
      </Badge>
    );
  }
  if (stock <= siteConfig.lowStockThreshold) {
    return (
      <Badge variant="highlight" className={cn("bg-background", className)}>
        Only {stock} left
      </Badge>
    );
  }
  return null;
}
