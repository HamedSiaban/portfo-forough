"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

function useIsTouch(): boolean {
  return useMediaQuery("(pointer: coarse)");
}

export { useIsTouch };
