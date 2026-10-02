import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs space-y-3">
          <Wordmark />
          <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <Link className="inline-flex min-h-8 items-center hover:underline" href="/books">
            Books
          </Link>
          <Link className="inline-flex min-h-8 items-center hover:underline" href="/favourites">
            Favourites
          </Link>
          <Link className="inline-flex min-h-8 items-center hover:underline" href="/orders">
            Orders
          </Link>
          <Link className="inline-flex min-h-8 items-center hover:underline" href="/profile">
            Profile
          </Link>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
