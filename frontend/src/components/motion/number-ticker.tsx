"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { duration } from "@/lib/motion";

interface NumberTickerProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
}

/** Counts up to `value`. Writes to the DOM directly, so it does not re-render on every frame. */
export function NumberTicker({ value, format = (n) => String(Math.round(n)), className }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const reduced = useReducedMotion();
  const formatRef = useRef(format);

  useEffect(() => {
    formatRef.current = format;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      node.textContent = formatRef.current(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: duration.slow * 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = formatRef.current(latest);
      },
      onComplete: () => {
        previous.current = value;
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      {format(value)}
    </span>
  );
}
