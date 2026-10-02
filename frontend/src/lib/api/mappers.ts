import {
  ORDER_STATUSES,
  type AdminOrder,
  type Book,
  type Customer,
  type Order,
  type OrderStatus,
  type Role,
  type User,
} from "@/lib/api/types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const strArray = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export function toBook(raw: unknown): Book | null {
  if (!isRecord(raw)) return null;
  const id = str(raw._id);
  if (!id) return null;
  return {
    _id: id,
    url: str(raw.url),
    title: str(raw.title, "Untitled"),
    author: str(raw.author, "Unknown author"),
    description: str(raw.description),
    language: str(raw.language, "English"),
    genre: str(raw.genre, "Other"),
    price: num(raw.price),
    stock: num(raw.stock),
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
  };
}

export function toBooks(raw: unknown): Book[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(toBook).filter((b): b is Book => b !== null);
}

export function toUser(raw: unknown): User {
  const r = isRecord(raw) ? raw : {};
  const role: Role = r.role === "admin" ? "admin" : "user";
  // Explicit pick: nothing else from the response (e.g. a hash) can leak into state.
  return {
    _id: str(r._id),
    username: str(r.username),
    email: str(r.email),
    address: str(r.address),
    role,
    avatar: str(r.avatar),
    favourite: strArray(r.favourite),
    cart: strArray(r.cart),
    orders: strArray(r.orders),
  };
}

function toStatus(v: unknown): OrderStatus {
  return ORDER_STATUSES.find((s) => s === v) ?? "Order Placed";
}

export function toOrder(raw: unknown): Order | null {
  if (!isRecord(raw)) return null;
  const id = str(raw._id);
  if (!id) return null;
  return {
    _id: id,
    status: toStatus(raw.status),
    book: toBook(raw.book),
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
  };
}

export function toOrders(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(toOrder).filter((o): o is Order => o !== null);
}

/** The backend populates `user` with the full document (including the password hash). Keep three safe fields only. */
export function toCustomer(raw: unknown): Customer | null {
  if (!isRecord(raw)) return null;
  return {
    username: str(raw.username),
    email: str(raw.email),
    address: str(raw.address),
  };
}

export function toAdminOrders(raw: unknown): AdminOrder[] {
  if (!Array.isArray(raw)) return [];
  const out: AdminOrder[] = [];
  for (const item of raw) {
    const order = toOrder(item);
    if (!order) continue;
    out.push({ ...order, customer: isRecord(item) ? toCustomer(item.user) : null });
  }
  return out;
}
