import { apiFetch } from "@/lib/api/client";
import { toBook, toBooks } from "@/lib/api/mappers";
import type { Book, BookInput } from "@/lib/api/types";
import { isObjectId } from "@/lib/utils";

export async function getAllBooks(): Promise<Book[]> {
  const res = await apiFetch<{ data: unknown }>("/get-all-books", { auth: false });
  return toBooks(res.data);
}

/**
 * Resolves to null when the book does not exist.
 * The backend answers an unknown id with 200 + `data: null` and a malformed id with 500,
 * so ids that cannot be a Mongo ObjectId are treated as "not found" without a request.
 */
export async function getBookById(id: string): Promise<Book | null> {
  if (!isObjectId(id)) return null;
  const res = await apiFetch<{ data: unknown }>("/get-book-by-id", {
    auth: false,
    headers: { bookid: id },
  });
  return toBook(res.data);
}

export async function addBook(input: BookInput): Promise<void> {
  await apiFetch<{ message: string }>("/add-book", { method: "POST", body: input });
}

/** The backend overwrites every field, so always send the complete form. */
export async function updateBook(id: string, input: BookInput): Promise<void> {
  await apiFetch<{ message: string }>("/update-book", { method: "PUT", body: input, headers: { bookid: id } });
}

export async function deleteBook(id: string): Promise<void> {
  await apiFetch<{ message: string }>("/delete-book", { method: "DELETE", headers: { bookid: id } });
}
