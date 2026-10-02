import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/vengeance/button";

export function ClosingCta() {
  return (
    <section className="border-t border-border bg-surface-raised">
      <Reveal className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-lg font-serif text-2xl font-medium text-balance sm:text-3xl">
          Your next book is already on the shelf.
        </h2>
        <Button asChild size="lg" variant="highlight">
          <Link href="/books">Start browsing</Link>
        </Button>
      </Reveal>
    </section>
  );
}
