import { duration } from "@/lib/motion";

/**
 * Sends a small copy of the cover from `from` toward the cart icon.
 * Uses the Web Animations API on a short-lived element, animating transform and opacity only.
 * Does nothing under prefers-reduced-motion or when the cart icon is not on screen.
 */
export function flyToCart(from: HTMLElement | null, url: string | undefined): void {
  if (typeof window === "undefined" || !from) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target) return;

  const start = from.getBoundingClientRect();
  const end = target.getBoundingClientRect();
  if (start.width === 0 || end.width === 0) return;

  const width = Math.min(72, start.width);
  const height = width * 1.5;

  const ghost = document.createElement("div");
  Object.assign(ghost.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: "4px",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "2000",
    background: "var(--surface-raised)",
    boxShadow: "var(--elevation-hover)",
    willChange: "transform, opacity",
  } satisfies Partial<CSSStyleDeclaration>);

  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "";
    img.decoding = "async";
    Object.assign(img.style, { width: "100%", height: "100%", objectFit: "cover" });
    img.onerror = () => img.remove();
    ghost.appendChild(img);
  }
  document.body.appendChild(ghost);

  const fromX = start.left + start.width / 2 - width / 2;
  const fromY = start.top + start.height / 2 - height / 2;
  const toX = end.left + end.width / 2 - width / 2;
  const toY = end.top + end.height / 2 - height / 2;

  const animation = ghost.animate(
    [
      { transform: `translate(${fromX}px, ${fromY}px) scale(1)`, opacity: 1 },
      { transform: `translate(${(fromX + toX) / 2}px, ${Math.min(fromY, toY) - 48}px) scale(0.7)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${toX}px, ${toY}px) scale(0.15)`, opacity: 0.2 },
    ],
    { duration: duration.slow * 1400, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
  );
  const cleanup = () => ghost.remove();
  animation.onfinish = cleanup;
  animation.oncancel = cleanup;
}
