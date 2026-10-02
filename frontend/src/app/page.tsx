import { ClosingCta } from "@/components/landing/closing-cta";
import { EmptyShelf } from "@/components/landing/empty-shelf";
import { GenreShowcase } from "@/components/landing/genre-showcase";
import { Hero } from "@/components/landing/hero";
import { NewArrivalsShelf } from "@/components/landing/new-arrivals-shelf";
import { getAllBooks } from "@/lib/api/books";

export const revalidate = 60;

export default async function LandingPage() {
  let books: Awaited<ReturnType<typeof getAllBooks>> = [];
  try {
    books = await getAllBooks();
  } catch {
    // Landing page still renders well with no books (see EmptyShelf below).
    books = [];
  }

  const genreCounts = new Map<string, number>();
  for (const book of books) genreCounts.set(book.genre, (genreCounts.get(book.genre) ?? 0) + 1);
  const genres = [...genreCounts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <Hero books={books} />
      {books.length === 0 ? (
        <EmptyShelf />
      ) : (
        <>
          <NewArrivalsShelf books={books} />
          <GenreShowcase genres={genres} />
        </>
      )}
      <ClosingCta />
    </>
  );
}
