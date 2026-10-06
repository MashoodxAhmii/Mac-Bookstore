"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/vengeance/button";
import { Input } from "@/components/vengeance/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/vengeance/spinner";
import { GoogleLogin } from "@react-oauth/google";
import { getMe, signIn, signInWithGoogle } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/store/auth";
import { safeNext } from "@/lib/utils";

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
});
type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const expired = searchParams.get("expired");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (expired === "1") toast.info("Signed out — your session had expired.");
  }, [expired]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setPending(true);
    try {
      const result = await signIn(values);
      useAuth.getState().setSession({ token: result.token, id: result.id, role: result.role });
      useAuth.getState().setHasHydrated(true);
      const me = await getMe();
      const goAdmin = next?.startsWith("/admin") && me.role === "admin";
      router.replace(goAdmin ? next! : next ?? "/");
    } catch (error) {
      if (error instanceof ApiError) {
        setError("password", { message: error.message });
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Try again.");
      }
    } finally {
      setPending(false);
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-medium">Sign in</h1>
        <p className="text-muted-foreground">Welcome back to your shelf.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" {...register("username")} aria-invalid={!!errors.username} />
          {errors.username ? <p className="text-sm text-destructive">{errors.username.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
          {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
        </div>

        {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}

        <Button type="submit" size="lg" className="w-full" aria-disabled={pending || undefined}>
          {pending ? <Spinner /> : null} Sign in
        </Button>
        <div className="flex items-center justify-center space-x-2 my-4">
           <span className="h-px w-full bg-border"></span>
           <span className="text-xs text-muted-foreground uppercase">or</span>
           <span className="h-px w-full bg-border"></span>
        </div>
        <div className="flex justify-center w-full">
           <GoogleLogin
             onSuccess={async (credentialResponse) => {
               if (credentialResponse.credential) {
                 try {
                   setPending(true);
                   const result = await signInWithGoogle(credentialResponse.credential);
                   useAuth.getState().setSession({ token: result.token, id: result.id, role: result.role });
                   useAuth.getState().setHasHydrated(true);
                   const me = await getMe();
                   const goAdmin = next?.startsWith("/admin") && me.role === "admin";
                   router.replace(goAdmin ? next! : next ?? "/");
                 } catch (error) {
                   setFormError("Failed to sign in with Google.");
                 } finally {
                   setPending(false);
                 }
               }
             }}
             onError={() => {
               setFormError("Google sign in failed.");
             }}
           />
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href={`/sign-up${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-foreground underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}
