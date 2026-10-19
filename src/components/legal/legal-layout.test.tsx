import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { privacyPolicy } from "@/content/legal";

import { LegalLayout } from "./legal-layout";

describe("LegalLayout", () => {
  it("renders one h1 and an anchored h2 per section", () => {
    const { container } = render(<LegalLayout doc={privacyPolicy} />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy" })).toBeInTheDocument();
    for (const s of privacyPolicy.sections) {
      expect(container.querySelector(`h2#${s.id}`)).not.toBeNull();
    }
  });

  it("replaces inline tokens with links", () => {
    render(<LegalLayout doc={privacyPolicy} />);
    expect(screen.getAllByRole("link", { name: /@/ })[0]).toHaveAttribute(
      "href",
      expect.stringMatching(/^mailto:/),
    );
    expect(document.body.textContent).not.toMatch(/\{\w+\}/);
  });
});

describe("privacy content", () => {
  const text = JSON.stringify(privacyPolicy).toLowerCase();

  it("names the processors", () => {
    for (const name of ["netlify", "umami", "clarity"]) expect(text).toContain(name);
  });
});
