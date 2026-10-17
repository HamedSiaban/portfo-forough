"use client";

import * as React from "react";

import { useIsTouch } from "@/hooks/use-is-touch";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type MotionPrefs = {
  reducedMotion: boolean;
  isTouch: boolean;
};

const MotionPrefsContext = React.createContext<MotionPrefs | null>(null);

/** Shares one reduced-motion/touch read across the tree instead of every effect re-subscribing. */
function MotionPrefsProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();
  const value = React.useMemo(() => ({ reducedMotion, isTouch }), [reducedMotion, isTouch]);

  return <MotionPrefsContext.Provider value={value}>{children}</MotionPrefsContext.Provider>;
}

function useMotionPrefs(): MotionPrefs {
  const context = React.useContext(MotionPrefsContext);
  if (!context) {
    throw new Error("useMotionPrefs must be used within a MotionPrefsProvider");
  }
  return context;
}

export { MotionPrefsProvider, useMotionPrefs };
