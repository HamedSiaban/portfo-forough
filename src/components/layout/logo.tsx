import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

/** Foro's avatar illustration as the header mark (OPEN_QUESTIONS Q13). */
function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Foro — home"
      className={cn(
        "flex size-9 items-center justify-center overflow-hidden rounded-input bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      <Image
        src="/media/avatar.svg"
        alt=""
        width={36}
        height={36}
        unoptimized
        className="size-full object-cover"
      />
    </Link>
  );
}

export { Logo };
