"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { duration, ease, shift } from "@/lib/motion";

// The very first paint must be visible (server HTML, no flash); only later navigations animate.
let hasNavigatedGlobally = false;

/** Subtle fade and 8px shift between routes. Used from app/template.tsx. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [skipInitial] = useState(() => {
    if (typeof window === "undefined") return true;
    const skip = !hasNavigatedGlobally;
    hasNavigatedGlobally = true;
    return skip;
  });

  return (
    <motion.div
      initial={skipInitial ? false : { opacity: 0, y: shift }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
