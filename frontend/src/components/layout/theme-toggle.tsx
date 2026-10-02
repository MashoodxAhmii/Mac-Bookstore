"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { duration, ease } from "@/lib/motion";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

const subscribe = () => () => { };

/**
 * Light / dark / system theme switch.
 *
 * Theme changes are handled directly by next-themes.
 * We intentionally do not use the View Transitions API here because
 * browser support for animating ::view-transition-new(root) can cause
 * a stale transition layer to remain over the page.
 */
export function ThemeToggle() {
  const { theme = "system", setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reduced = useReducedMotion();

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];

  const change = (next: string) => {
    setTheme(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            mounted
              ? `Theme: ${current.label.toLowerCase()}. Change theme`
              : "Change theme"
          }
        >
          <span className="relative grid size-5 place-items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mounted ? current.value : "placeholder"}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, rotate: -60, scale: 0.6 }
                }
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 1, rotate: 0, scale: 1 }
                }
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, rotate: 60, scale: 0.6 }
                }
                transition={{
                  duration: reduced ? 0 : duration.fast,
                  ease: ease.out,
                }}
                className="absolute"
              >
                {mounted ? (
                  <current.Icon className="size-5" aria-hidden />
                ) : (
                  <Sun className="size-5" aria-hidden />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={change}
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="gap-2 pointer-coarse:min-h-11"
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}