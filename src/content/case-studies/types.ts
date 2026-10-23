/**
 * Typed case-study copy. A study is an ordered list of sections, each an ordered list of blocks —
 * add text, images and videos by appending blocks; the layout does the rest.
 *
 * Media lives in `public/media/work/<slug>/` and `public/video/<slug>/`. An image block without
 * `src` renders a labelled placeholder, so a draft page never breaks.
 */
type ImageBlock = {
  type: "image";
  /** Path under /public, e.g. "/media/work/wondrfly/context.webp". Omit while drafting. */
  src?: string;
  /** Dark-theme variant of `src`; when set, the image swaps with the theme (CSS only, no flash). */
  srcDark?: string;
  alt: string;
  caption?: string;
  /** Intrinsic size, to reserve space (no layout shift). Defaults to 1600×900. */
  width?: number;
  height?: number;
  /** "text" keeps the reading column; "wide" breaks out for diagrams and screens. */
  size?: "text" | "wide";
};

type VideoBlock = {
  type: "video";
  src?: string;
  poster?: string;
  /** WebVTT captions (WCAG: video needs captions or a transcript). */
  captions?: string;
  /** Accessible name; also shown as the caption when `caption` is omitted. */
  title: string;
  caption?: string;
};

type CaseStudyBlock =
  | { type: "p"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | { type: "metrics"; items: { value: string; label: string }[] }
  | ImageBlock
  | VideoBlock;

type CaseStudySection = { id: string; heading: string; blocks: CaseStudyBlock[] };

type CaseStudy = {
  slug: string;
  title: string;
  /** One-sentence summary: hero subtitle, meta description, social card. */
  summary: string;
  /** Short at-a-glance facts shown under the title. */
  meta: { label: string; value: string }[];
  /** Headline outcomes shown in the hero. */
  results: string[];
  cover?: Omit<ImageBlock, "type" | "caption" | "size">;
  sections: CaseStudySection[];
};

export type { CaseStudy, CaseStudyBlock, CaseStudySection, ImageBlock, VideoBlock };
