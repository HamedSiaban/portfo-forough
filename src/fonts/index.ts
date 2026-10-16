/**
 * Project fonts, loaded with next/font/local (self-hosted, no layout shift).
 *
 * Roles (see docs/DESIGN_SPEC.md §3):
 *   --font-frama          PP Frama         → display headlines (needs "ss01", applied in globals.css)
 *   --font-neue-montreal  PP Neue Montreal → body copy, card headings, labels
 *   --font-supply-mono    PP Supply Mono   → buttons, chips, credential rows (uppercase)
 *
 * LICENSING: these are Pangram Pangram commercial fonts. The current files are the
 * reference site's web builds, for local development only. Before production, buy the
 * web licenses and replace the files (see ./README.md). Only the paths below change.
 */
import localFont from "next/font/local";

export const frama = localFont({
  src: [
    { path: "./PPFrama-Regular.woff2", weight: "400", style: "normal" },
    { path: "./PPFrama-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-frama",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const neueMontreal = localFont({
  src: [
    // Book and Regular both declare weight 400 internally; Book is mapped to 350 so both can coexist.
    { path: "./PPNeueMontreal-Book.woff2", weight: "350", style: "normal" },
    { path: "./PPNeueMontreal-Regular.woff2", weight: "400", style: "normal" },
    { path: "./PPNeueMontreal-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-neue-montreal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const supplyMono = localFont({
  src: [{ path: "./PPSupplyMono-Medium.woff2", weight: "500", style: "normal" }],
  variable: "--font-supply-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/** Apply to <html> in app/layout.tsx: className={fontVariables} */
export const fontVariables = [frama.variable, neueMontreal.variable, supplyMono.variable].join(" ");
