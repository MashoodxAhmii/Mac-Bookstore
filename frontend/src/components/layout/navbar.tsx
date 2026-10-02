"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/vengeance/button";
import { CartButton } from "@/components/layout/cart-button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchDialog } from "@/components/layout/search-dialog";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Wordmark } from "@/components/layout/wordmark";
import { useCartCount } from "@/lib/hooks/use-cart";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { hydrated, isAuthed } = useSession();
  const cartCount = useCartCount();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/books", label: "Books" },
    ...(isAuthed
      ? [
          { href: "/favourites", label: "Favourites" },
          { href: "/orders", label: "Orders" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* The background fades in with opacity, so scrolling never animates layout or colour */}
      <div
        aria-hidden
        className={cn(
          "glass-nav pointer-events-none absolute inset-0 border-b border-border/70 bg-background/70 backdrop-saturate-150 transition-opacity duration-200",
          "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-highlight/40 after:to-transparent",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
        <MobileMenu />
        <Wordmark className="mr-2 md:mr-6" />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-10 items-center rounded-input px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-highlight",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchDialog />
          <ThemeToggle />
          <CartButton />
          {!hydrated ? (
            <div className="size-10" aria-hidden />
          ) : isAuthed ? (
            <UserMenu />
          ) : (
            <div className="ml-1 hidden items-center gap-1 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {isAuthed ? `${cartCount} ${cartCount === 1 ? "item" : "items"} in cart` : ""}
      </span>
    </header>
  );
}
