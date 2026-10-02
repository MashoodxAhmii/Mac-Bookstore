"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { Input } from "@/components/vengeance/input";
import { Badge } from "@/components/vengeance/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CatalogFilters } from "@/lib/hooks/use-catalog";
import { SORTS } from "@/lib/hooks/use-catalog";
import { formatPrice, formatNumber } from "@/lib/format";

interface BookFiltersProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  genres: string[];
  languages: string[];
  priceBounds: { min: number; max: number };
  resultCount: number;
}

/**
 * Price slider, uncontrolled: it owns its own display value while dragging and only reports the
 * committed value up (onValueCommit). Keying it by the committed range (below) resets it when the
 * URL-driven filters change externally — no effect needed to mirror external state back in.
 */
function PriceRangeSlider({
  min,
  max,
  defaultValue,
  onCommit,
}: {
  min: number;
  max: number;
  defaultValue: [number, number];
  onCommit: (value: [number, number]) => void;
}) {
  const [display, setDisplay] = useState<[number, number]>(defaultValue);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Price</span>
        <span className="text-muted-foreground">
          {formatPrice(display[0])} – {formatPrice(display[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        defaultValue={defaultValue}
        onValueChange={(v) => setDisplay([v[0], v[1]])}
        onValueCommit={(v) => onCommit([v[0], v[1]])}
        aria-label="Price range"
      />
    </div>
  );
}

function FilterControls({
  filters,
  onChange,
  genres,
  languages,
  priceBounds,
}: Omit<BookFiltersProps, "resultCount">) {
  const rangeKey = `${filters.minPrice ?? priceBounds.min}-${filters.maxPrice ?? priceBounds.max}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="genre" className="text-sm font-medium">
          Genre
        </label>
        <Select value={filters.genre || "all"} onValueChange={(v) => onChange({ genre: v === "all" ? "" : v })}>
          <SelectTrigger id="genre" className="w-full">
            <SelectValue placeholder="All genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-medium">
          Language
        </label>
        <Select value={filters.language || "all"} onValueChange={(v) => onChange({ language: v === "all" ? "" : v })}>
          <SelectTrigger id="language" className="w-full">
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <PriceRangeSlider
        key={rangeKey}
        min={priceBounds.min}
        max={priceBounds.max}
        defaultValue={[filters.minPrice ?? priceBounds.min, filters.maxPrice ?? priceBounds.max]}
        onCommit={([lo, hi]) => onChange({ minPrice: lo, maxPrice: hi })}
      />
    </div>
  );
}

/**
 * Search box, uncontrolled: it owns its own text and debounces reporting up via a timer ref, so
 * external resets ("Clear filters") are applied imperatively (via the exposed ref) rather than by
 * mirroring props back into state in an effect.
 */
function SearchBox({
  initialValue,
  onDebouncedChange,
  clearSignal,
}: {
  initialValue: string;
  onDebouncedChange: (value: string) => void;
  /** Bumped by the parent to imperatively clear the field. */
  clearSignal: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  // Imperative DOM sync (not React state) when the parent clears filters — a legitimate effect use.
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = "";
  }, [clearSignal]);

  return (
    <>
      <label htmlFor="book-search" className="sr-only">
        Search by title or author
      </label>
      <Input
        id="book-search"
        ref={inputRef}
        defaultValue={initialValue}
        onChange={(e) => {
          const value = e.target.value;
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => onDebouncedChange(value), 200);
        }}
        placeholder="Search title or author"
        className="max-w-xs flex-1"
        type="search"
      />
    </>
  );
}

/** Toolbar: search, genre/language selects, price slider, sort, result count. All state lives in the URL. */
export function BookFilters(props: BookFiltersProps) {
  const { filters, onChange, resultCount } = props;
  const [clearSignal, setClearSignal] = useState(0);

  const activeCount = [filters.genre, filters.language, filters.minPrice !== null || filters.maxPrice !== null].filter(
    Boolean,
  ).length;

  const clearAll = () => {
    setClearSignal((n) => n + 1);
    onChange({ q: "", genre: "", language: "", minPrice: null, maxPrice: null });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox initialValue={filters.q} onDebouncedChange={(q) => onChange({ q })} clearSignal={clearSignal} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal aria-hidden /> Filters
              {activeCount > 0 ? (
                <Badge variant="highlight" className="absolute -top-2 -right-2">
                  {activeCount}
                </Badge>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="sr-only">Refine the book list</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterControls {...props} />
            </div>
          </SheetContent>
        </Sheet>
        <Select value={filters.sort} onValueChange={(v) => onChange({ sort: v as CatalogFilters["sort"] })}>
          <SelectTrigger className="ml-auto w-44" aria-label="Sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          {formatNumber(resultCount)} {resultCount === 1 ? "book" : "books"}
        </span>
        {activeCount > 0 || filters.q ? (
          <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground">
            <X className="size-3.5" aria-hidden /> Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
