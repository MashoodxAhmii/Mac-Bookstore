import { siteConfig } from "@/lib/site-config";
import { useAuth } from "@/lib/store/auth";

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
  get isNetwork() {
    return this.status === 0;
  }
  get isForbidden() {
    return this.status === 403;
  }
}

export type UnauthorizedReason = "expired" | "unauthenticated";
type UnauthorizedHandler = (reason: UnauthorizedReason) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Extra headers, e.g. `{ bookid }` for the routes that read the book id from a header. */
  headers?: Record<string, string>;
  /** Attach the bearer token (default true). */
  auth?: boolean;
  signal?: AbortSignal;
}

function readMessage(data: unknown): string | null {
  // Only ever read `message`. The backend sometimes adds `error` and `stack`; those never reach the UI.
  if (typeof data === "object" && data !== null && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return null;
}

function fallbackMessage(status: number): string {
  if (status === 400) return "The request was not valid. Check the details and try again.";
  if (status === 401) return "You need to sign in to do that.";
  if (status === 403) return "You don't have access to this.";
  if (status === 404) return "We couldn't find what you asked for.";
  return "The server hit a problem. Try again in a moment.";
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, auth = true, signal } = options;
  const token = useAuth.getState().token;

  const requestHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (body !== undefined) requestHeaders["Content-Type"] = "application/json";
  if (auth && token) requestHeaders.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${siteConfig.apiUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = readMessage(data) ?? fallbackMessage(response.status);
    // The backend answers an expired or invalid token with 403 (not 401).
    const expired = response.status === 401 || (response.status === 403 && /token expired/i.test(message));
    if (expired && auth && token) {
      unauthorizedHandler?.(response.status === 401 ? "unauthenticated" : "expired");
    }
    throw new ApiError(response.status, message);
  }

  return data as T;
}
