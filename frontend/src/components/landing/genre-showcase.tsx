import Link from "next/link";
import { BookCover } from "@/components/books/book-cover";
import { Reveal } from "@/components/motion/reveal";
import type { GenreCount } from "@/lib/hooks/use-books";

/** Bento-style grid of genres, sized by how many books are in each. */
export function GenreShowcase({ genres }: { genres: GenreCount[] }) {
  if (genres.length === 0) return null;
  const top = genres.slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mb-6">
        <h2 className="font-serif text-2xl font-medium">Browse by genre</h2>
        <p className="text-muted-foreground">{genres.length} genres on the shelf.</p>
      </Reveal>
      <Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {top.map((g, i) => (
            <li key={g.genre} className={i === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""}>
              <Link
                href={`/books?genre=${encodeURIComponent(g.genre)}`}
                className="group relative block h-full overflow-hidden rounded-card border border-border bg-surface-raised shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="relative aspect-[3/4] w-full opacity-70 transition-opacity group-hover:opacity-90">
                  <BookCover title={g.genre} />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-cover-foreground/0 to-transparent p-4">
                  <span className="font-serif text-lg font-medium text-cover-foreground drop-shadow">{g.genre}</span>
                  <span className="text-sm text-cover-foreground/80">
                    {g.count} {g.count === 1 ? "book" : "books"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
