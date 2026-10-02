import type { Metadata } from "next";
import { AuthGuard } from "@/components/layout/guards";
import { CheckoutPageClient } from "./checkout-page-client";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutPageClient />
    </AuthGuard>
  );
}
