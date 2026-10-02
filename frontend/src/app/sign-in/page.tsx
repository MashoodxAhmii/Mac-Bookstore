import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestGuard } from "@/components/layout/guards";
import { AuthSplit } from "@/components/layout/auth-split";
import { PageSkeleton } from "@/components/states/skeletons";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <GuestGuard>
      <AuthSplit>
        <Suspense fallback={<PageSkeleton />}>
          <SignInForm />
        </Suspense>
      </AuthSplit>
    </GuestGuard>
  );
}
