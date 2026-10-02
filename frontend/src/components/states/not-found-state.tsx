import Link from "next/link";
import { BookX } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { EmptyState } from "@/components/states/empty-state";

export function NotFoundState({
  title = "We couldn't find that page",
  description = "The link may be out of date, or the book may have been removed.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={<BookX aria-hidden />}
      title={title}
      description={description}
      action={
        <Button asChild>
          <Link href="/books">Browse books</Link>
        </Button>
      }
    />
  );
}
