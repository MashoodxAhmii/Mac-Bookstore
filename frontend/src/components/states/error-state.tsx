"use client";

import Link from "next/link";
import { CloudOff, Lock, RefreshCw, TriangleAlert } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/vengeance/button";
import { EmptyState } from "@/components/states/empty-state";

interface ErrorStateProps {
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

/** Friendly failure state. Never renders raw error objects, stacks or server internals. */
export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  if (error instanceof ApiError && error.isForbidden) {
    return <NoAccessState className={className} />;
  }
  const network = error instanceof ApiError && error.isNetwork;
  const message =
    error instanceof ApiError ? error.message : "Something went wrong while loading this. Try again in a moment.";

  return (
    <EmptyState
      className={className}
      icon={network ? <CloudOff aria-hidden /> : <TriangleAlert aria-hidden />}
      title={network ? "Can't reach the server" : "This didn't load"}
      description={message}
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw aria-hidden /> Try again
          </Button>
        ) : undefined
      }
    />
  );
}

export function NoAccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      icon={<Lock aria-hidden />}
      title="You don't have access to this page"
      description="This area is for store admins. You're still signed in."
      action={
        <Button asChild variant="outline">
          <Link href="/">Go to the home page</Link>
        </Button>
      }
    />
  );
}
