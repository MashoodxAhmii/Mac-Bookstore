"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useFinePointer } from "@/lib/hooks/use-pointer";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

/** Pointer-driven 3D tilt. Disabled on touch devices and under prefers-reduced-motion. */
export function Tilt({ children, className, max = 8 }: TiltProps) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), ease.layout);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), ease.layout);

  return (
    <motion.div
      className={cn("[transform-style:preserve-3d]", className)}
      style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      onPointerMove={(event) => {
        if (!enabled || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
