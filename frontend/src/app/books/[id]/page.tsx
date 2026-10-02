import type { Metadata } from "next";
import { getBookById } from "@/lib/api/books";
import { BookDetailClient } from "./book-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const book = await getBookById(id);
    if (!book) return { title: "Book not found" };
    return { title: book.title, description: book.description?.slice(0, 160) };
  } catch {
    return { title: "Book" };
  }
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetailClient id={id} />;
}
