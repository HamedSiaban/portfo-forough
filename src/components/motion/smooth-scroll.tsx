"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import * as React from "react";

import { HEADER_OFFSET_PX } from "@/config/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionPrefs } from "@/providers/motion-prefs-provider";

type ScrollTarget = string | number | HTMLElement;

type SmoothScrollContextValue = {
  scrollTo: (target: ScrollTarget, options?: { offset?: number }) => void;
  /** Freeze/resume smooth scrolling (modals). No-op when Lenis is disabled. */
  setPaused: (paused: boolean) => void;
};

const SmoothScrollContext = React.createContext<SmoothScrollContextValue | null>(null);

/**
 * One Lenis instance for the whole app, driven by gsap.ticker (CLAUDE.md §5.6)
 * so Lenis and ScrollTrigger never fight over rAF. Disabled entirely under
 * reduced motion — scrolling stays native, `scrollTo` falls back to `scrollIntoView`.
 */
function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useMotionPrefs();
  const lenisRef = React.useRef<Lenis | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = React.useCallback<SmoothScrollContextValue["scrollTo"]>((target, options) => {
    const lenis = lenisRef.current;
    if (lenis) {
      // Lenis caches the scrollable height and only recomputes it lazily; right
      // after a client-side route change it can still reflect the previous
      // (shorter) page, which silently clamps scrollTo. Force a resync first.
      lenis.resize();
      lenis.scrollTo(target, { offset: options?.offset ?? 0 });
      return;
    }
    const element = typeof target === "string" ? document.querySelector(target) : null;
    element?.scrollIntoView({ behavior: "auto" });
  }, []);

  const setPaused = React.useCallback((paused: boolean) => {
    if (paused) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, []);

  // SmoothScrollProvider lives in the root layout and never remounts on client-side
  // navigation, so a mount-only effect would miss a hash that appears after an
  // in-app nav (e.g. a Pricing link clicked from /legals). Re-check on pathname change.
  // The target section can still be streaming in (Cache Components), so poll a few
  // frames for it to exist instead of firing once and silently missing it.
  React.useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    let frame: number;
    let attempts = 0;
    const tryScroll = () => {
      if (document.querySelector(hash)) {
        scrollTo(hash, { offset: -HEADER_OFFSET_PX });
        return;
      }
      attempts += 1;
      if (attempts < 60) {
        frame = requestAnimationFrame(tryScroll);
      }
    };
    frame = requestAnimationFrame(tryScroll);

    return () => cancelAnimationFrame(frame);
  }, [pathname, scrollTo]);

  const value = React.useMemo(() => ({ scrollTo, setPaused }), [scrollTo, setPaused]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

function useSmoothScroll(): SmoothScrollContextValue {
  const context = React.useContext(SmoothScrollContext);
  if (!context) {
    throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
  }
  return context;
}

export { SmoothScrollProvider, useSmoothScroll };
