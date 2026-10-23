import type { PatternArtVariant } from "@/components/effects/pattern-art";

/**
 * Work-section copy and data. PLACEHOLDER — OPEN_QUESTIONS Q4 (quote), Q6 (trail art),
 * Q7 (showreel) and Q8 (projects) are unresolved. Replace with Foro's own material before
 * launch; never reuse the reference site's text. Defaults: generated PatternArt tiles for the
 * trail, a poster-less "coming soon" showreel, four placeholder projects.
 */
type TrailImage = {
  pattern: PatternArtVariant;
  seed: string;
};

type Project = {
  title: string;
  region: string;
  duration: string;
  /** Slug of an internal case study (`/work/<slug>`). Omit for NDA work. */
  slug?: string;
  nda?: boolean;
};

/** Accessible names for the showreel player's chrome. */
type PlayerLabels = {
  title: string;
  description: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  captionsOn: string;
  captionsOff: string;
  captionsUnavailable: string;
  scrub: string;
  close: string;
};

type WorkContent = {
  heading: string[];
  /** Touch devices get no hover trail (it auto-plays), so the copy drops "feel". */
  touchHeading: string[];
  trail: { images: TrailImage[] };
  quote: { text: string[]; author: string; role?: string };
  showreel: {
    label: string;
    /** Q7: no reel yet. When all three are set the tile plays a muted preview. */
    poster?: string;
    previewSrc?: string;
    videoSrc?: string;
    captions?: string;
    comingSoon: string;
    player: PlayerLabels;
  };
  delivery: { title: string; note: string; cta: string; projectsLabel: string };
  /** Scroll-gate prompt under the section (progress ring + label). */
  gate: { label: string };
  projects: Project[];
};

const work: WorkContent = {
  heading: ["Details you", "can feel."],
  touchHeading: ["Details worth", "a closer look."],
  trail: {
    images: [
      { pattern: "steps", seed: "trail-1" },
      { pattern: "circles", seed: "trail-2" },
      { pattern: "diamond", seed: "trail-3" },
      { pattern: "snake", seed: "trail-4" },
      { pattern: "steps", seed: "trail-5" },
      { pattern: "diamond", seed: "trail-6" },
      { pattern: "circles", seed: "trail-7" },
      { pattern: "snake", seed: "trail-8" },
    ],
  },
  quote: {
    // One entry per visual line; each gets its own reveal mask.
    text: [
      "I design for BOTH:",
      "The user and the business.",
      "One without the other is half a job.",
      "Great products don't just solve human problems—they drive growth.",
    ],
    author: "Foro",
  },
  showreel: {
    label: "Showreel",
    comingSoon: "Reel coming soon",
    player: {
      title: "Showreel",
      description:
        "Showreel player. Space plays or pauses, arrows seek, M mutes, C toggles captions, Escape closes.",
      play: "Play",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      captionsOn: "Hide captions",
      captionsOff: "Show captions",
      captionsUnavailable: "Captions unavailable",
      scrub: "Seek",
      close: "Close showreel",
    },
  },
  gate: { label: "Want to know me more?" },
  delivery: {
    title: "Latest delivery",
    note: "New projects typically start within 2 weeks.",
    cta: "Request a quote",
    projectsLabel: "Recent projects",
  },
  projects: [
    {
      title: "Onboarding redesign for a fintech mobile app.",
      region: "Europe",
      duration: "6 weeks",
      nda: true,
    },
    {
      title: "Wondrfly: from marketplace to a product families rely on.",
      region: "US",
      duration: "10 weeks",
      slug: "wondrfly",
    },
    {
      title: "Marketing site and product tour for a health startup.",
      region: "UK",
      duration: "4 weeks",
    },
    {
      title: "Dashboard UX overhaul for a logistics tool.",
      region: "Australia",
      duration: "8 weeks",
    },
  ],
};

export { work };
export type { PlayerLabels, Project, TrailImage, WorkContent };
