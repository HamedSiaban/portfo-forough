/**
 * Work-section copy and data. PLACEHOLDER — OPEN_QUESTIONS
 * Q7 (showreel) is unresolved; projects are Foro's four real case studies. Replace with Foro's own material before
 * launch; never reuse the reference site's text. Defaults: generated showreel placeholder,
 * a poster-less "coming soon" showreel, four case-study cards.
 */
type Project = {
  title: string;
  /** Short chips under the title (discipline, product area). */
  tags: string[];
  /** Slug of an internal case study (`/work/<slug>`). Omit for NDA work. */
  slug?: string;
  /** Card image (decorative; the cover art carries the title). `srcDark` swaps in under the dark theme. */
  cover?: { src: string; srcDark?: string };
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
  projects: Project[];
};

const work: WorkContent = {
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
  delivery: {
    title: "Latest delivery",
    note: "New projects typically start within 2 weeks.",
    cta: "Request a quote",
    projectsLabel: "Recent projects",
  },
  projects: [
    {
      title: "From Figma to sprint-ready: an AI handoff pipeline.",
      tags: ["AI workflow", "Design ops"],
      slug: "ai-spec-gen",
      cover: {
        src: "/media/work/covers/ai-spec-gen-light.webp",
        srcDark: "/media/work/covers/ai-spec-gen-dark.webp",
      },
    },
    {
      title: "Wondrfly Pro: a 0-1 marketplace launch.",
      tags: ["Strategy", "Monetisation"],
      slug: "wondrfly-pro",
      cover: { src: "/media/work/covers/wondrfly-pro.webp" },
    },
    {
      title: "Wondrfly's Trust Shift: designing for parent confidence.",
      tags: ["Trust", "Conversion"],
      slug: "wondrfly-trust",
      cover: { src: "/media/work/covers/wondrfly-trust.webp" },
    },
    {
      title: "Clearing the path to go live: provider homepage redesign.",
      tags: ["Activation", "Dashboard"],
      slug: "wondrfly-home",
      cover: { src: "/media/work/covers/wondrfly-home.webp" },
    },
  ],
};

export { work };
export type { PlayerLabels, Project, WorkContent };
