/**
 * Site-wide constants. Values marked (placeholder) are defaults from
 * docs/OPEN_QUESTIONS.md and must be confirmed by Foro before launch (Phase 12 gate).
 */
export const site = {
  name: "Foroughozaman Foroughi",
  shortName: "Foro",
  url: "https://foroughforoughi.com",
  email: "hello@foroughforoughi.com", // placeholder — OPEN_QUESTIONS Q10
  whatsapp: "https://wa.me/37400000000", // placeholder — OPEN_QUESTIONS Q10
  linkedin: "https://www.linkedin.com/in/foroughforoughi", // placeholder — OPEN_QUESTIONS Q10
  location: "Yerevan, Armenia", // placeholder — OPEN_QUESTIONS Q10
  timezone: "UTC+4", // placeholder — OPEN_QUESTIONS Q10
} as const;

/** Fixed header height, in px — shared by Header's own layout and smooth-scroll offsets. */
export const HEADER_OFFSET_PX = 72;
