import type { Metadata } from "next";
import { AuthGuard } from "@/components/layout/guards";
import { CartPageClient } from "./cart-page-client";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <AuthGuard>
      <CartPageClient />
    </AuthGuard>
  );
}
