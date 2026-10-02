"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NoAccessState } from "@/components/states/error-state";
import { PageSkeleton } from "@/components/states/skeletons";
import { useSession } from "@/lib/hooks/use-session";
import { authFlags } from "@/lib/store/auth-flags";
import { safeNext } from "@/lib/utils";

/**
 * Waits for the persisted session to load, then either renders the page or redirects to sign-in.
 * Shows a skeleton meanwhile, so there is no flash of protected content and no flash of redirect.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthed } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated || isAuthed || authFlags.signingOut) return;
    const here = pathname + window.location.search;
    router.replace(`/sign-in?next=${encodeURIComponent(here)}`);
  }, [hydrated, isAuthed, pathname, router]);

  if (!hydrated || !isAuthed) return <PageSkeleton />;
  return <>{children}</>;
}

/** Same as AuthGuard, and shows a no-access state (without signing out) for non-admins. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthed, isAdmin } = useSession();

  return (
    <AuthGuard>
      {hydrated && isAuthed && !isAdmin ? (
        <div className="mx-auto w-full max-w-3xl px-5 py-16">
          <NoAccessState />
        </div>
      ) : (
        children
      )}
    </AuthGuard>
  );
}

/** For sign-in and sign-up: sends signed-in users away. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthed } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated || !isAuthed) return;
    const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    router.replace(next ?? "/");
  }, [hydrated, isAuthed, router]);

  if (!hydrated || isAuthed) return <PageSkeleton />;
  return <>{children}</>;
}
