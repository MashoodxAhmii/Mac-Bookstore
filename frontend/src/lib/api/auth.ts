import { apiFetch } from "@/lib/api/client";
import { toUser } from "@/lib/api/mappers";
import type { Role, SignInResult, User } from "@/lib/api/types";

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
  address: string;
}

export async function signUp(input: SignUpInput): Promise<void> {
  await apiFetch<{ message: string }>("/sign-up", { method: "POST", body: input, auth: false });
}

export async function signIn(input: { username: string; password: string }): Promise<SignInResult> {
  const data = await apiFetch<{ id: string; role: Role; message: string; token: string }>("/sign-in", {
    method: "POST",
    body: input,
    auth: false,
  });
  return {
    id: String(data.id),
    role: data.role === "admin" ? "admin" : "user",
    message: data.message,
    token: data.token,
  };
}

export async function signInWithGoogle(idToken: string): Promise<SignInResult> {
  const data = await apiFetch<{ id: string; role: Role; message: string; token: string }>("/google", {
    method: "POST",
    body: { idToken },
    auth: false,
  });
  return {
    id: String(data.id),
    role: data.role === "admin" ? "admin" : "user",
    message: data.message,
    token: data.token,
  };
}

export async function getMe(): Promise<User> {
  const data = await apiFetch<unknown>("/get-user-information");
  return toUser(data);
}

export async function updateAddress(address: string): Promise<void> {
  await apiFetch<{ message: string }>("/update-address", { method: "PUT", body: { address } });
}
