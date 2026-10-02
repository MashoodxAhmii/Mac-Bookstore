"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { useCartCount } from "@/lib/hooks/use-cart";
import { useSession } from "@/lib/hooks/use-session";
import { ease } from "@/lib/motion";

/** Cart icon with a ticking count. `data-cart-target` is where the fly-to-cart animation lands. */
export function CartButton() {
  const { isAuthed } = useSession();
  const count = useCartCount();
  const shown = isAuthed ? count : 0;

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link
        href="/cart"
        data-cart-target
        aria-label={shown > 0 ? `Cart, ${shown} ${shown === 1 ? "item" : "items"}` : "Cart, empty"}
      >
        <ShoppingBag className="size-5" aria-hidden />
        <AnimatePresence initial={false}>
          {shown > 0 ? (
            <motion.span
              key={shown}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={ease.spring}
              className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-highlight px-1 text-xs leading-5 font-semibold text-highlight-foreground"
              aria-hidden
            >
              {shown}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </Link>
    </Button>
  );
}
