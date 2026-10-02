/**
 * Shared motion tokens. Every animation in the app reads from here so motion
 * feels like one system. Durations are in seconds (motion and GSAP both use s).
 */
export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.5,
} as const;

export const ease = {
  /** Standard ease-out, used for entrances and most state changes. */
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Spring for tactile, action-driven feedback (heart, badge tick). */
  spring: { type: "spring", stiffness: 420, damping: 30, mass: 0.8 } as const,
  /** Softer spring for layout changes. */
  layout: { type: "spring", stiffness: 300, damping: 34 } as const,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** GSAP equivalent of ease.out. */
export const gsapEase = "expo.out";

/** Distance (px) used by page transitions and reveals. */
export const shift = 8;

/** Above this many visible items, layout animation is switched off. */
export const LAYOUT_ANIMATION_LIMIT = 60;
