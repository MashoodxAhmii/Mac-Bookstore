import type { Metadata } from "next";
import { AdminBooksClient } from "./admin-books-client";

export const metadata: Metadata = { title: "Manage books" };

export default function AdminBooksPage() {
  return <AdminBooksClient />;
}
