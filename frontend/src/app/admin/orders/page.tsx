import type { Metadata } from "next";
import { AdminOrdersClient } from "./admin-orders-client";

export const metadata: Metadata = { title: "Manage orders" };

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
