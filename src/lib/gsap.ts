import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once here (CLAUDE.md §5.6) — every other module imports gsap/ScrollTrigger
// from this file instead of the packages directly.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
