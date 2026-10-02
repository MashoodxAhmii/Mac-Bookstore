"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const JACKETS = [
  "bg-cover-1 text-cover-foreground",
  "bg-cover-2 text-cover-foreground",
  "bg-cover-3 text-cover-foreground",
  "bg-cover-4 text-cover-foreground",
  "bg-cover-5 text-cover-foreground",
] as const;

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface BookCoverProps {
  url?: string;
  title?: string;
  author?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * 2:3 cover with a generated jacket as fallback (empty or broken URL).
 * With no title it renders a blank jacket, used for decorative placeholders.
 */
export function BookCover({ url, title = "", author, className, sizes = "(min-width: 1024px) 20vw, 45vw", priority }: BookCoverProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(url) && failedUrl !== url;
  const jacket = JACKETS[hash(title || url || "blank") % JACKETS.length];

  return (
    <div className={cn("relative aspect-[2/3] w-full overflow-hidden rounded-[0.35rem] bg-surface-raised", className)}>
      {showImage && url ? (
        <Image
          src={url}
          alt={title ? `Cover of ${title}` : ""}
          fill
          sizes={sizes}
          unoptimized
          priority={priority}
          loading={priority ? undefined : "lazy"}
          onError={() => setFailedUrl(url)}
          className="object-cover"
        />
      ) : (
        <div
          role={title ? "img" : undefined}
          aria-label={title ? `Cover of ${title}` : undefined}
          aria-hidden={title ? undefined : true}
          className={cn("flex h-full w-full flex-col justify-between p-[12%]", jacket)}
        >
          <span className="block h-px w-1/3 bg-current opacity-60" />
          {title ? (
            <span className="font-serif text-[clamp(0.8rem,1.4vw,1.15rem)] leading-tight font-medium text-balance line-clamp-5">
              {title}
              {author ? <span className="mt-2 block font-sans text-[0.7em] font-normal opacity-80">{author}</span> : null}
            </span>
          ) : (
            <span className="block h-px w-1/2 bg-current opacity-40" />
          )}
        </div>
      )}
      {/* Binding edge: a quiet lighter strip on the spine side */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[6%] bg-linear-to-r from-cover-foreground/25 to-transparent mix-blend-soft-light" />
    </div>
  );
}
