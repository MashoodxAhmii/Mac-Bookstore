"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BookCover } from "@/components/books/book-cover";
import { Button } from "@/components/vengeance/button";
import { Input } from "@/components/vengeance/input";
import { Textarea } from "@/components/vengeance/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/vengeance/spinner";
import type { Book, BookInput } from "@/lib/api/types";

const schema = z.object({
  url: z.string().min(1, "Add a cover image URL"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock can't be negative"),
  description: z.string().optional(),
  language: z.string().optional(),
});
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

interface BookFormProps {
  book?: Book;
  onSubmit: (input: BookInput) => void;
  onCancel: () => void;
  submitting?: boolean;
}

/** Add / edit form. Always submits the full payload — the backend's update-book overwrites every field. */
export function BookForm({ book, onSubmit, onCancel, submitting }: BookFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: book?.url ?? "",
      title: book?.title ?? "",
      author: book?.author ?? "",
      genre: book?.genre ?? "",
      price: book?.price ?? 0,
      stock: book?.stock ?? 0,
      description: book?.description ?? "",
      language: book?.language ?? "",
    },
  });

  useEffect(() => {
    reset({
      url: book?.url ?? "",
      title: book?.title ?? "",
      author: book?.author ?? "",
      genre: book?.genre ?? "",
      price: book?.price ?? 0,
      stock: book?.stock ?? 0,
      description: book?.description ?? "",
      language: book?.language ?? "",
    });
  }, [book, reset]);

  const url = watch("url");
  const title = watch("title");
  const author = watch("author");

  const submit = handleSubmit((values) => {
    onSubmit({
      url: values.url,
      title: values.title,
      author: values.author,
      genre: values.genre,
      price: values.price,
      stock: values.stock,
      description: values.description || undefined,
      language: values.language || undefined,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex gap-4">
        <div className="w-24 shrink-0">
          <BookCover url={url} title={title} author={author} sizes="96px" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="bf-url">Cover image URL</Label>
          <Input id="bf-url" {...register("url")} placeholder="https://…" aria-invalid={!!errors.url} />
          {errors.url ? <p className="text-sm text-destructive">{errors.url.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bf-title">Title</Label>
          <Input id="bf-title" {...register("title")} aria-invalid={!!errors.title} />
          {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-author">Author</Label>
          <Input id="bf-author" {...register("author")} aria-invalid={!!errors.author} />
          {errors.author ? <p className="text-sm text-destructive">{errors.author.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-genre">Genre</Label>
          <Input id="bf-genre" {...register("genre")} aria-invalid={!!errors.genre} />
          {errors.genre ? <p className="text-sm text-destructive">{errors.genre.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-language">Language (optional)</Label>
          <Input id="bf-language" {...register("language")} placeholder="English" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-price">Price</Label>
          <Input id="bf-price" type="number" step="0.01" min="0.01" {...register("price")} aria-invalid={!!errors.price} />
          {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-stock">Stock</Label>
          <Input id="bf-stock" type="number" step="1" min="0" {...register("stock")} aria-invalid={!!errors.stock} />
          {errors.stock ? <p className="text-sm text-destructive">{errors.stock.message}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bf-description">Description (optional)</Label>
        <Textarea id="bf-description" rows={4} {...register("description")} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" aria-disabled={submitting || undefined}>
          {submitting ? <Spinner /> : null}
          {book ? "Save changes" : "Add book"}
        </Button>
      </div>
    </form>
  );
}
