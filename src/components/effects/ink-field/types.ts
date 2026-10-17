type InkFieldPalette = "accent" | "dark" | { core: string; soft: [string, string, string] };

type InkFieldProps = {
  /** Where to read tint colors from. Custom overrides the CSS-var lookup. */
  palette?: InkFieldPalette;
  /** Splat strength multiplier. */
  intensity?: number;
  /** Dye fade rate, applied as `pow(dissipation, dt)` so the fade duration is frame-rate independent. */
  dissipation?: number;
  /** Base halftone dot size in px at the display resolution. */
  dotSize?: number;
  /** Jacobi pressure-solve iteration count. Higher = more incompressible fluid, more cost. */
  pressureIterations?: number;
  halftone?: boolean;
  chromatic?: boolean;
  /** Slow autonomous emitter that runs when there's no real pointer input (touch, first paint). */
  idleDrift?: boolean;
  className?: string;
};

export type { InkFieldPalette, InkFieldProps };
