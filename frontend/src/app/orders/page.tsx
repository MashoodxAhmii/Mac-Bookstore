import type { Metadata } from "next";
import { AuthGuard } from "@/components/layout/guards";
import { OrdersPageClient } from "./orders-page-client";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersPageClient />
    </AuthGuard>
  );
}
