import Link from "next/link";

import { cn } from "@/lib/cn";

/** "F" monogram placeholder (OPEN_QUESTIONS Q13) — not the reference site's mark. */
function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Foro — home"
      className={cn(
        "flex size-9 items-center justify-center rounded-input bg-foreground text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      <span className="text-mono-ui" aria-hidden="true">
        F
      </span>
    </Link>
  );
}

export { Logo };
