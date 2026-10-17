import type { RefObject } from "react";

type WaveFieldPalette = "accent" | "dark" | { core: string; soft: [string, string, string] };

type WaveFieldProps = {
  /** Where to read the glow color from. Custom overrides the CSS-var lookup. */
  palette?: WaveFieldPalette;
  /** Glow size multiplier (scales both the resting and the full-speed radius). */
  intensity?: number;
  /** Base halftone dot size in px at the display resolution. */
  dotSize?: number;
  halftone?: boolean;
  chromatic?: boolean;
  /** Slow autonomous glow that runs when there's no real pointer input (touch, first paint). */
  idleDrift?: boolean;
  /**
   * Render the built-in static halftone behind the canvas. Turn off when a parent already
   * draws one (e.g. `<Panel />`) so the dots aren't doubled.
   */
  backdrop?: boolean;
  /**
   * Element that receives pointer events instead of the field itself — needed when the field
   * is stacked above content with `pointer-events: none`.
   */
  pointerTarget?: RefObject<HTMLElement | null>;
  className?: string;
};

export type { WaveFieldPalette, WaveFieldProps };
