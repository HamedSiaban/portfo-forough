"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export { useReducedMotion };
