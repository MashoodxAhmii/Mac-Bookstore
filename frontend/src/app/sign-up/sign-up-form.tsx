"use client";

import { useState } from "react";
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
import { signUp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { safeNext } from "@/lib/utils";

const schema = z.object({
  username: z.string().min(4, "At least 4 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  address: z.string().min(1, "Enter your address"),
});
type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setPending(true);
    try {
      await signUp(values);
      toast.success("Account created — sign in to continue");
      router.push(`/sign-in${next ? `?next=${encodeURIComponent(next)}` : ""}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (/username/i.test(error.message)) setError("username", { message: error.message });
        else if (/email/i.test(error.message)) setError("email", { message: error.message });
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
        <h1 className="font-serif text-2xl font-medium">Create an account</h1>
        <p className="text-muted-foreground">Save favourites, keep a cart, and track orders.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" {...register("username")} aria-invalid={!!errors.username} />
          {errors.username ? <p className="text-sm text-destructive">{errors.username.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" autoComplete="street-address" {...register("address")} aria-invalid={!!errors.address} />
          {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
        </div>

        {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}

        <Button type="submit" size="lg" className="w-full" aria-disabled={pending || undefined}>
          {pending ? <Spinner /> : null} Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={`/sign-in${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-foreground underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
