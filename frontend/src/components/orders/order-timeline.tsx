import { Ban, Check, Package, Truck } from "lucide-react";
import type { OrderStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const STEPS: { status: OrderStatus; label: string; Icon: typeof Package }[] = [
  { status: "Order Placed", label: "Order placed", Icon: Package },
  { status: "Out for delivery", label: "Out for delivery", Icon: Truck },
  { status: "Delivered", label: "Delivered", Icon: Check },
];

/** Status timeline. Canceled renders as its own distinct state, not a broken timeline. Never colour-only. */
export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "Canceled") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
        <Ban className="size-4" aria-hidden />
        Canceled
      </div>
    );
  }

  const activeIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <ol className="flex items-center gap-1" aria-label={`Order status: ${status}`}>
      {STEPS.map((step, index) => {
        const done = index <= activeIndex;
        return (
          <li key={step.status} className="flex flex-1 items-center gap-1 last:flex-none">
            <span className="flex flex-col items-center gap-1 text-center">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full border",
                  done ? "border-success bg-success/15 text-success" : "border-border text-muted-foreground",
                )}
              >
                <step.Icon className="size-3.5" aria-hidden />
              </span>
              <span className={cn("text-xs", done ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
            </span>
            {index < STEPS.length - 1 ? (
              <span className={cn("mx-1 h-px flex-1", index < activeIndex ? "bg-success" : "bg-border")} aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
