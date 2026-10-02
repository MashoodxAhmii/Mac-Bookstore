"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/hooks/use-session";
import { useSignOut } from "@/lib/hooks/use-sign-out";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthed, isAdmin } = useSession();
  const signOut = useSignOut();

  const links = [
    { href: "/books", label: "Books" },
    ...(isAuthed
      ? [
          { href: "/favourites", label: "Favourites" },
          { href: "/orders", label: "Orders" },
          { href: "/profile", label: "Profile" },
        ]
      : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] max-w-xs">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-input px-3 font-serif text-lg hover:bg-accent",
                  active && "bg-accent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          {isAuthed ? (
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              Sign out
            </Button>
          ) : (
            <>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href="/sign-up">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
