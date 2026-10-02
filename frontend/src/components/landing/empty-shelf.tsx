import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";

export function EmptyShelf() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6">
      <EmptyState icon={<BookOpen aria-hidden />} title="The shelf is empty, for now" description="Check back soon — new books are on the way." />
    </section>
  );
}
