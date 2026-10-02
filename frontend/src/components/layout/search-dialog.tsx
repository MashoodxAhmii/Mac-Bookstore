"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Button } from "@/components/vengeance/button";
import { Input } from "@/components/vengeance/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBooks } from "@/lib/hooks/use-books";
import { useDebouncedValue } from "@/lib/hooks/use-debounced";

/** Quick search. Matches title and author in the cached book list; Enter opens the full catalog search. */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data: books } = useBooks();
  const debounced = useDebouncedValue(query.trim().toLowerCase(), 200);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    if (!debounced || !books) return [];
    return books
      .filter((b) => b.title.toLowerCase().includes(debounced) || b.author.toLowerCase().includes(debounced))
      .slice(0, 6);
  }, [books, debounced]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Search books"
        aria-keyshortcuts="/"
      >
        <Search className="size-5" aria-hidden />
      </Button>
      <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
        <DialogContent className="top-[20%] translate-y-0 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Search books</DialogTitle>
            <DialogDescription>Search by title or author. Press Enter to see every match.</DialogDescription>
          </DialogHeader>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const q = query.trim();
              close();
              router.push(q ? `/books?q=${encodeURIComponent(q)}` : "/books");
            }}
          >
            <label htmlFor="quick-search" className="sr-only">
              Title or author
            </label>
            <Input
              id="quick-search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title or author"
              autoComplete="off"
            />
          </form>
          <div aria-live="polite" className="min-h-6">
            {debounced && results.length === 0 ? (
              <p className="text-sm text-muted-foreground">No books match “{query.trim()}”.</p>
            ) : null}
            <ul className="-mx-2 space-y-1">
              {results.map((book) => (
                <li key={book._id}>
                  <Link
                    href={`/books/${book._id}`}
                    onClick={close}
                    className="flex items-center gap-3 rounded-input p-2 hover:bg-accent focus-visible:bg-accent"
                  >
                    <BookCover url={book.url} title={book.title} className="w-9 shrink-0" sizes="36px" />
                    <span className="min-w-0">
                      <span className="block truncate font-serif">{book.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">{book.author}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
