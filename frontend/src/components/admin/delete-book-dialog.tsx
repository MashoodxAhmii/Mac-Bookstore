"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/vengeance/button";
import { Spinner } from "@/components/vengeance/spinner";
import type { Book } from "@/lib/api/types";
import { useDeleteBook } from "@/lib/hooks/use-book-admin";

interface DeleteBookDialogProps {
  book: Book | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBookDialog({ book, onOpenChange }: DeleteBookDialogProps) {
  const del = useDeleteBook();

  return (
    <Dialog open={book !== null} onOpenChange={(next) => !del.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete “{book?.title}”?</DialogTitle>
          <DialogDescription>This removes the book from the catalog. This can&apos;t be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={del.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            aria-disabled={del.isPending || undefined}
            onClick={() => book && !del.isPending && del.mutate(book._id, { onSuccess: () => onOpenChange(false) })}
          >
            {del.isPending ? <Spinner /> : null} Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
