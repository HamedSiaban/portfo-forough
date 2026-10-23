import type { CaseStudy } from "./types";
import { wondrfly } from "./wondrfly";

/** Order here is the "next case study" order at the bottom of each page. */
const caseStudies: CaseStudy[] = [wondrfly];

function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/** The study after `slug`, wrapping around; undefined when there is only one. */
function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  return next && next.slug !== slug ? next : undefined;
}

export { caseStudies, getCaseStudy, getNextCaseStudy };
export type { CaseStudy, CaseStudyBlock, CaseStudySection, ImageBlock, VideoBlock } from "./types";
