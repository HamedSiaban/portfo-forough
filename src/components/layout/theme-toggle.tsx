"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/cn";

/** True only after hydration, without setState-in-effect (avoids a hydration mismatch). */
function useHasMounted(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={mounted && !isDark}
        aria-label="Light theme"
        onClick={() => setTheme("light")}
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted focus-visible:outline-none",
          mounted && !isDark && "bg-surface text-foreground",
        )}
      >
        <SunIcon className="size-3.5" weight="bold" />
      </button>
      <button
        type="button"
        aria-pressed={isDark}
        aria-label="Dark theme"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted focus-visible:outline-none",
          isDark && "bg-surface text-foreground",
        )}
      >
        <MoonIcon className="size-3.5" weight="bold" />
      </button>
    </div>
  );
}

export { ThemeToggle };
