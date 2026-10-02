"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { EmptyState } from "@/components/states/empty-state";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-5 py-16">
      <EmptyState
        icon={<AlertTriangle aria-hidden />}
        title="Something went wrong"
        description="That page hit a problem loading. You can try again."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </div>
  );
}
