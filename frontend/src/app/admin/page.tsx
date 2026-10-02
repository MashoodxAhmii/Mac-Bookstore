import type { Metadata } from "next";
import { AdminOverviewClient } from "./admin-overview-client";

export const metadata: Metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return <AdminOverviewClient />;
}
