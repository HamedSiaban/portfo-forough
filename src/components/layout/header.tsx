"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { useSmoothScroll } from "@/components/motion/smooth-scroll";
import { Button, buttonVariants } from "@/components/ui/button";
import { HEADER_OFFSET_PX } from "@/config/site";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useUiStore } from "@/stores/ui-store";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

/**
 * Fixed header. The row wrapper is pointer-events-none and only the Logo/nav
 * group opt back in, so the empty space between them doesn't swallow clicks
 * or wheel events meant for the section underneath.
 */
function Header() {
  const openInquiry = useUiStore((state) => state.openInquiry);
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const headerRef = React.useRef<HTMLElement>(null);
  const [isDark, setIsDark] = React.useState(false);

  // Header legibility over dark panels (DESIGN_SPEC §4): sections opt in with
  // data-header-theme="dark"; none do yet (first dark panel lands Phase 03/06+),
  // so this is wired but visually unexercised until then.
  useGSAP(
    () => {
      const darkSections = gsap.utils.toArray<HTMLElement>('[data-header-theme="dark"]');
      const triggers = darkSections.map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: `top top+=${HEADER_OFFSET_PX}`,
          end: `bottom top+=${HEADER_OFFSET_PX}`,
          onToggle: (self) => setIsDark(self.isActive),
        }),
      );
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-wrap items-start justify-between gap-2 p-4 md:px-12"
    >
      <Logo className="pointer-events-auto shrink-0" />
      <div className="pointer-events-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
        <Link
          href="/#work"
          className={cn(
            buttonVariants({ variant: isDark ? "secondary" : "outline", size: "md" }),
            !isDark && "bg-transparent",
          )}
          onClick={(event) => {
            // On the home page scroll via Lenis (offset for this fixed header); elsewhere let
            // the link navigate — SmoothScroll resolves the hash after the route change.
            if (pathname !== "/") return;
            event.preventDefault();
            scrollTo("#work", { offset: -HEADER_OFFSET_PX });
          }}
        >
          Projects
        </Link>
        <Button variant={isDark ? "secondary" : "solid"} size="md" onClick={() => openInquiry()}>
          Start a conversation
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

export { Header };
