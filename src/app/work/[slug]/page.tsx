import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyLayout } from "@/components/case-study/case-study-layout";
import { caseStudies, getCaseStudy, getNextCaseStudy } from "@/content/case-studies";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  return study ? { title: study.title, description: study.summary } : {};
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyLayout study={study} next={getNextCaseStudy(slug)} />;
}
