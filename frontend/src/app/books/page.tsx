import type { Metadata } from "next";
import { Suspense } from "react";
import { BookGridSkeleton } from "@/components/states/skeletons";
import { BooksPageClient } from "./books-page-client";

export const metadata: Metadata = {
  title: "Books",
  description: "Browse and search every book on the shelf.",
};

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6">
          <BookGridSkeleton />
        </div>
      }
    >
      <BooksPageClient />
    </Suspense>
  );
}
