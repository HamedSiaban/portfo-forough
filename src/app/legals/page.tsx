import type { Metadata } from "next";

import { LegalLayout } from "@/components/legal/legal-layout";
import { legalNotice } from "@/content/legal";

export const metadata: Metadata = {
  title: legalNotice.title,
  description: legalNotice.description,
};

export default function LegalsPage() {
  return <LegalLayout doc={legalNotice} />;
}
