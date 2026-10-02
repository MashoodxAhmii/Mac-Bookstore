"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease, stagger as staggerTokens } from "@/lib/motion";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Delay before the first word starts, in seconds. */
  delay?: number;
  as?: "h1" | "h2" | "p";
}

/** Word-by-word reveal for the hero headline. One signature moment — used only here. */
export function SplitText({ text, className, delay = 0, as = "h1" }: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.15em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduced ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: duration.slow,
                ease: ease.out,
                delay: reduced ? 0 : delay + i * staggerTokens.loose,
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
