"use client";

import { motion, useReducedMotion } from "motion/react";

/** SVG check that draws in on order confirmation. Falls back to a plain filled check under reduced motion. */
export function OrderConfirmCheck({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="var(--success)"
        strokeWidth="3"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M20 33.5 28 41 44 24"
        fill="none"
        stroke="var(--success)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
