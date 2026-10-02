import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 rounded-input font-serif text-lg font-medium tracking-tight", className)}
      aria-label={`${siteConfig.name}, home`}
    >
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path d="M5 3.5h11.5A2.5 2.5 0 0 1 19 6v14.5H7.5A2.5 2.5 0 0 1 5 18V3.5Z" className="fill-primary" />
        <path d="M9 3.5h10V11l-2.5-1.6L14 11V3.5H9Z" className="fill-highlight" />
      </svg>
      <span>{siteConfig.name}</span>
    </Link>
  );
}
