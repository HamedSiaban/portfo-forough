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
  className?: string;
};

export type { WaveFieldPalette, WaveFieldProps };
