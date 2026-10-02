"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Button } from "@/components/vengeance/button";
import type { Book } from "@/lib/api/types";
import { useSession } from "@/lib/hooks/use-session";

const LampGlow = dynamic(() => import("@/components/motion/lamp-glow"), { ssr: false });

interface HeroProps {
  books: Book[];
}

export function Hero({ books }: HeroProps) {
  const { isAuthed } = useSession();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Take top 3 books for a minimalist fan display
  const topBooks = useMemo(() => books.slice(0, 3), [books]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-[min(90vh,60rem)] flex-col items-center justify-center overflow-hidden border-b border-border px-4 py-20 sm:px-6">
      {/* Deep, clean background with very subtle ambient lighting */}
      <div className="absolute inset-0 -z-10 bg-background dark:bg-[#0b0f1a]">
        {/* Subtle, soft spot glow behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-blue-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />
      </div>
      
      {/* Subtle Lamp Glow for premium feel */}
      <div className="absolute inset-0 -z-10 opacity-60 mix-blend-screen pointer-events-none">
        <LampGlow />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        
        {/* Subtle pill badge */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground"
        >
          <BookOpen className="size-4" />
          <span>Carefully curated literature</span>
        </motion.div>

        {/* Massive, clean typography */}
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-[clamp(3rem,8vw,6rem)] leading-[1.05] font-bold tracking-tighter text-foreground text-balance"
        >
          Read <span className="text-muted-foreground">less.</span> <br className="hidden sm:block" />
          Experience <span className="text-foreground">more.</span>
        </motion.h1>

        {/* Minimalist description */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light text-balance"
        >
          A minimalist haven for readers. No endless feeds, no algorithm—just a beautifully curated collection of books that actually matter.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8 h-14 text-base font-medium transition-transform hover:scale-105 active:scale-95">
            <Link href="/books">
              Explore Collection <ArrowRight className="ml-2 size-5" aria-hidden />
            </Link>
          </Button>
          {!isAuthed && (
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-medium transition-transform hover:scale-105 active:scale-95">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </motion.div>

        {/* Elegant Book Fan Display */}
        <motion.div 
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-24 flex h-64 w-full max-w-3xl items-center justify-center sm:h-80"
        >
          {topBooks.map((book, i) => {
             const isCenter = i === 1;
             const isLeft = i === 0;
             const isRight = i === 2;
             
             // Dynamic positioning for a beautiful layered fan effect
             const xOffset = isLeft ? "-60%" : isRight ? "60%" : "0%";
             const yOffset = isCenter ? "-15%" : "5%";
             const rotation = isLeft ? -12 : isRight ? 12 : 0;
             const zIndex = isCenter ? 30 : 10;
             const scale = isCenter ? 1.05 : 0.90;

             return (
               <motion.div
                 key={book?._id || i}
                 className="absolute w-36 sm:w-48 shadow-2xl transition-all duration-500 hover:!z-50 hover:!scale-110 hover:-translate-y-6"
                 style={{
                   zIndex,
                 }}
                 animate={{
                   x: xOffset,
                   y: yOffset,
                   rotate: rotation,
                   scale: scale,
                 }}
                 transition={{
                   duration: 1,
                   ease: [0.22, 1, 0.36, 1],
                   delay: 0.5 + i * 0.1
                 }}
               >
                 <div className="overflow-hidden rounded-xl ring-1 ring-border/50 shadow-2xl shadow-black/40">
                   <BookCover url={book?.url} title={book?.title} author={book?.author} sizes="20vw" />
                 </div>
               </motion.div>
             )
          })}
        </motion.div>

      </div>
    </section>
  );
}
