import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestGuard } from "@/components/layout/guards";
import { AuthSplit } from "@/components/layout/auth-split";
import { PageSkeleton } from "@/components/states/skeletons";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <GuestGuard>
      <AuthSplit>
        <Suspense fallback={<PageSkeleton />}>
          <SignUpForm />
        </Suspense>
      </AuthSplit>
    </GuestGuard>
  );
}
