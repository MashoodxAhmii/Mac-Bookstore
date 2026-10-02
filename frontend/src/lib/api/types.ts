export type Role = "user" | "admin";

export const ORDER_STATUSES = ["Order Placed", "Out for delivery", "Delivered", "Canceled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Book {
  _id: string;
  url: string;
  title: string;
  author: string;
  description: string;
  language: string;
  genre: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  address: string;
  role: Role;
  avatar: string;
  favourite: string[];
  cart: string[];
  orders: string[];
}

/** An order in the signed-in user's history. `book` is null if the book was deleted. */
export interface Order {
  _id: string;
  status: OrderStatus;
  book: Book | null;
  createdAt: string;
  updatedAt: string;
}

/** Deliberately small view of the populated customer. Never add more fields (the raw object holds a password hash). */
export interface Customer {
  username: string;
  email: string;
  address: string;
}

export interface AdminOrder extends Order {
  customer: Customer | null;
}

export interface BookInput {
  url: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  stock: number;
  description?: string;
  language?: string;
}

export interface SignInResult {
  id: string;
  role: Role;
  message: string;
  token: string;
}
