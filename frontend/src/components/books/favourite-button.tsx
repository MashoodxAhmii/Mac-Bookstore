"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { useAuthPrompt } from "@/components/providers/auth-prompt";
import type { Book } from "@/lib/api/types";
import { useUserSets } from "@/lib/hooks/use-me";
import { useSession } from "@/lib/hooks/use-session";
import { useToggleFavourite } from "@/lib/hooks/use-favourites";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FavouriteButtonProps {
  book: Book;
  /** "overlay" sits on a cover; "button" is the labelled version for the detail page. */
  variant?: "overlay" | "button";
  className?: string;
}

export function FavouriteButton({ book, variant = "overlay", className }: FavouriteButtonProps) {
  const { isAuthed } = useSession();
  const { favouriteIds } = useUserSets();
  const { promptSignIn } = useAuthPrompt();
  const toggle = useToggleFavourite();
  const isFavourite = favouriteIds.has(book._id);
  const label = isFavourite ? `Remove ${book.title} from favourites` : `Save ${book.title} to favourites`;

  const onClick = () => {
    if (!isAuthed) {
      promptSignIn("Sign in to save books to your favourites.");
      return;
    }
    if (toggle.isPending) return; // prevents double submits
    toggle.mutate({ book, favourite: !isFavourite });
  };

  const icon = (
    <motion.span
      key={String(isFavourite)}
      initial={{ scale: 0.55 }}
      animate={{ scale: 1 }}
      transition={ease.spring}
      className="grid place-items-center"
    >
      <Heart
        aria-hidden
        className={cn("size-5 transition-colors", isFavourite ? "fill-highlight text-highlight" : "text-foreground")}
      />
    </motion.span>
  );

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        aria-pressed={isFavourite}
        aria-disabled={toggle.isPending || undefined}
        className={className}
      >
        {icon}
        {isFavourite ? "Saved" : "Save"}
        <span className="sr-only">{`: ${label}`}</span>
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isFavourite}
      aria-label={label}
      aria-disabled={toggle.isPending || undefined}
      className={cn(
        "pointer-events-auto grid size-9 place-items-center rounded-full bg-background/80 shadow-card backdrop-blur-lg backdrop-saturate-150 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-11",
        className,
      )}
    >
      {icon}
    </button>
  );
}
