import type { ReactNode } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";

interface StatCardProps {
  label: string;
  value: number;
  format?: (n: number) => string;
  icon?: ReactNode;
  hint?: string;
}

export function StatCard({ label, value, format, icon, hint }: StatCardProps) {
  return (
    <div className="space-y-1 rounded-card border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <p className="font-serif text-3xl font-medium">
        <NumberTicker value={value} format={format} />
      </p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
