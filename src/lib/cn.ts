import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// DESIGN_SPEC §3 type-scale utilities (globals.css `@utility text-*`) set family,
// weight, size, line-height and tracking together. Without this, tailwind-merge's
// default "text-*" grouping treats them as plain font-size/text-color classes and
// silently drops them whenever a variant also sets a `text-{color}` utility.
const twMerge = extendTailwindMerge<"font-type-scale">({
  extend: {
    classGroups: {
      "font-type-scale": [
        "text-display-xl",
        "text-display-lg",
        "text-display-md",
        "text-price",
        "text-heading",
        "text-title",
        "text-body-lg",
        "text-body",
        "text-label",
        "text-mono-ui",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
