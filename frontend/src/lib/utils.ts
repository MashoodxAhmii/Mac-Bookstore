import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Only allow same-site relative paths as post-sign-in destinations. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return null;
  return next;
}

const OBJECT_ID = /^[a-f\d]{24}$/i;
export function isObjectId(value: string | null | undefined): value is string {
  return typeof value === "string" && OBJECT_ID.test(value);
}
