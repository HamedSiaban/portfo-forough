import type { Metadata } from "next";

import { LegalLayout } from "@/components/legal/legal-layout";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
};

export default function PrivacyPage() {
  return <LegalLayout doc={privacyPolicy} />;
}
