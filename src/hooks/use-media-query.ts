"use client";

import * as React from "react";

function subscribe(query: string, onChange: () => void) {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

function useMediaQuery(query: string): boolean {
  return React.useSyncExternalStore(
    (onChange) => subscribe(query, onChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export { useMediaQuery };
