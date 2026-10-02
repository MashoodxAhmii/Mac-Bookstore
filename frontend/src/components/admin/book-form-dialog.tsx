"use client";

import { BookForm } from "@/components/books/book-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Book, BookInput } from "@/lib/api/types";
import { useCreateBook, useUpdateBook } from "@/lib/hooks/use-book-admin";

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present to edit that book; absent to create a new one. */
  book?: Book;
}

export function BookFormDialog({ open, onOpenChange, book }: BookFormDialogProps) {
  const create = useCreateBook();
  const update = useUpdateBook();
  const pending = create.isPending || update.isPending;

  const submit = (input: BookInput) => {
    if (book) {
      update.mutate({ id: book._id, input }, { onSuccess: () => onOpenChange(false) });
    } else {
      create.mutate(input, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{book ? "Edit book" : "Add book"}</DialogTitle>
          <DialogDescription>
            {book ? "Update every field — changes replace the book's full record." : "Add a new book to the catalog."}
          </DialogDescription>
        </DialogHeader>
        <BookForm book={book} submitting={pending} onCancel={() => onOpenChange(false)} onSubmit={submit} />
      </DialogContent>
    </Dialog>
  );
}
