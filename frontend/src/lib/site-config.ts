export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Bookstore",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000/api/v1").replace(/\/+$/, ""),
  description: "Browse, save and order books from a small, carefully kept shelf.",
  /** The backend stores this value when a user signs up without an address. */
  defaultAddress: "Address",
  lowStockThreshold: 5,
} as const;
