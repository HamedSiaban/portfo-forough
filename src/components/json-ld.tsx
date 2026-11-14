import { site } from "@/config/site";

/** Person structured data for search engines; rendered once from the root layout. */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    jobTitle: "Senior Product & UX Designer",
    url: site.url,
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin],
  };
  return (
    <script
      type="application/ld+json"

      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export { JsonLd };
