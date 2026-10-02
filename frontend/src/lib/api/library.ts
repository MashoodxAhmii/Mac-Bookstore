import { apiFetch } from "@/lib/api/client";
import { toAdminOrders, toBooks, toOrders } from "@/lib/api/mappers";
import type { AdminOrder, Book, Order, OrderStatus } from "@/lib/api/types";

/* Favourites: the book id travels in the JSON body. */
export async function addFavourite(bookId: string): Promise<void> {
  await apiFetch<{ message: string }>("/add-to-favourite", { method: "PUT", body: { bookId } });
}
export async function removeFavourite(bookId: string): Promise<void> {
  await apiFetch<{ message: string }>("/remove-from-favourite", { method: "PUT", body: { bookId } });
}
export async function getFavourites(): Promise<Book[]> {
  const res = await apiFetch<{ data: unknown }>("/get-all-favourite");
  return toBooks(res.data);
}

/* Cart: add uses the `bookid` header, remove uses a path parameter. */
export async function addToCart(bookId: string): Promise<void> {
  await apiFetch<{ message: string }>("/add-to-cart", { method: "PUT", headers: { bookid: bookId } });
}
export async function removeFromCart(bookId: string): Promise<void> {
  await apiFetch<{ message: string }>(`/remove-from-cart/${encodeURIComponent(bookId)}`, { method: "PUT" });
}
export async function getCart(): Promise<Book[]> {
  const res = await apiFetch<{ data: unknown }>("/get-user-cart");
  return toBooks(res.data);
}

/* Orders */
export async function placeOrder(books: Pick<Book, "_id">[]): Promise<void> {
  await apiFetch<{ message: string }>("/place-order", {
    method: "POST",
    body: { order: books.map((b) => ({ _id: b._id })) },
  });
}
export async function getOrderHistory(): Promise<Order[]> {
  const res = await apiFetch<{ data: unknown }>("/get-order-history");
  return toOrders(res.data);
}
export async function getAllOrders(): Promise<AdminOrder[]> {
  const res = await apiFetch<{ data: unknown }>("/get-all-orders");
  return toAdminOrders(res.data);
}
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await apiFetch<{ message: string }>(`/update-status/${encodeURIComponent(orderId)}`, {
    method: "PUT",
    body: { status },
  });
}
