"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { BookFormDialog } from "@/components/admin/book-form-dialog";
import { DeleteBookDialog } from "@/components/admin/delete-book-dialog";
import { Button } from "@/components/vengeance/button";
import { Input } from "@/components/vengeance/input";
import { Badge } from "@/components/vengeance/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/vengeance/table";
import { ErrorState } from "@/components/states/error-state";
import { EmptyState } from "@/components/states/empty-state";
import { RowSkeleton } from "@/components/states/skeletons";
import type { Book } from "@/lib/api/types";
import { useBooks } from "@/lib/hooks/use-books";
import { formatPrice } from "@/lib/format";

type SortKey = "title" | "price" | "stock";

export function AdminBooksClient() {
  const { data: books, isPending, isError, error, refetch } = useBooks();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books ?? [];
    if (q) list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    list = [...list].sort((a, b) => {
      if (sortKey === "price") return a.price - b.price;
      if (sortKey === "stock") return a.stock - b.stock;
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [books, query, sortKey]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books" className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(["title", "price", "stock"] as SortKey[]).map((key) => (
            <Button key={key} size="sm" variant={sortKey === key ? "secondary" : "ghost"} onClick={() => setSortKey(key)} className="capitalize">
              {key}
            </Button>
          ))}
        </div>
        <Button className="ml-auto" onClick={() => setCreateOpen(true)}>
          <Plus aria-hidden /> Add book
        </Button>
      </div>

      {isPending ? (
        <RowSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No books found" description="Try a different search, or add your first book." />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <div className="w-10">
                      <BookCover url={book.url} title={book.title} sizes="40px" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-52 truncate font-medium">{book.title}</TableCell>
                  <TableCell className="max-w-40 truncate text-muted-foreground">{book.author}</TableCell>
                  <TableCell className="text-muted-foreground">{book.genre}</TableCell>
                  <TableCell className="text-right">{formatPrice(book.price)}</TableCell>
                  <TableCell className="text-right">
                    {book.stock <= 0 ? (
                      <Badge variant="destructive">0</Badge>
                    ) : book.stock <= 5 ? (
                      <Badge variant="highlight">{book.stock}</Badge>
                    ) : (
                      book.stock
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(book)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleting(book)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <BookFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <BookFormDialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} book={editing ?? undefined} />
      <DeleteBookDialog book={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </div>
  );
}
