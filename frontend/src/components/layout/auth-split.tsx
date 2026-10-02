import { BookCover } from "@/components/books/book-cover";
import { Wordmark } from "@/components/layout/wordmark";

const PANEL_COVERS = [
  { title: "The Quiet Hour", author: "M. Faber" },
  { title: "Lantern & Ash", author: "R. Okonkwo" },
  { title: "A Long Margin", author: "S. Kade" },
  { title: "Winter Correspondence", author: "T. Vale" },
];

/** Split-screen auth layout: form on the left, a quiet composition of covers on the right (desktop only). */
export function AuthSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm space-y-8">
          <Wordmark className="lg:hidden" />
          {children}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-surface-raised lg:block">
        <div className="absolute inset-0 grid grid-cols-2 gap-6 p-12 opacity-90">
          {PANEL_COVERS.map((cover, i) => (
            <div key={cover.title} className={i % 2 === 1 ? "mt-12" : ""}>
              <BookCover title={cover.title} author={cover.author} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-raised via-transparent to-surface-raised/40" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-sm font-serif text-xl leading-snug text-foreground/90 text-balance">
            A quiet shelf, kept for whoever wanders in.
          </p>
        </div>
      </div>
    </div>
  );
}
