/**
 * Typed legal copy (DESIGN_SPEC §7). Inline tokens in strings: `{email}` renders the contact
 * mailto link, `{privacy}` links to /privacy, `{legals}` links to /legals.
 */
type LegalBlock = { type: "p"; text: string } | { type: "list"; items: string[] };

type LegalSection = { id: string; heading: string; blocks: LegalBlock[] };

type LegalDocument = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export type { LegalBlock, LegalDocument, LegalSection };
