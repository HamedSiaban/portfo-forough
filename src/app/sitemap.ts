import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { caseStudies } from "@/content/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", ...caseStudies.map(({ slug }) => `/work/${slug}`)].map((path) => ({
    url: `${site.url}${path}`,
  }));
}
