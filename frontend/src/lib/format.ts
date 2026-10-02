import { siteConfig } from "@/lib/site-config";

let currencyFormatter: Intl.NumberFormat | null = null;

export function formatPrice(value: number): string {
  if (!currencyFormatter) {
    try {
      currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: siteConfig.currency,
      });
    } catch {
      currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
    }
  }
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

/** Last six characters of an id, for compact order references. */
export function shortId(id: string): string {
  return id.slice(-6).toUpperCase();
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
