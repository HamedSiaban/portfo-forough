import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { inquiry } from "@/content/inquiry";
import { legalNotice, privacyPolicy } from "@/content/legal";

import { LegalLayout } from "./legal-layout";

describe("LegalLayout", () => {
  it("renders one h1 and an anchored h2 per section", () => {
    const { container } = render(<LegalLayout doc={privacyPolicy} />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy policy" })).toBeInTheDocument();
    for (const s of privacyPolicy.sections) {
      expect(container.querySelector(`h2#${s.id}`)).not.toBeNull();
    }
  });

  it("replaces inline tokens with links", () => {
    render(<LegalLayout doc={legalNotice} />);
    expect(screen.getAllByRole("link", { name: /@/ })[0]).toHaveAttribute(
      "href",
      expect.stringMatching(/^mailto:/),
    );
    expect(document.body.textContent).not.toMatch(/\{\w+\}/);
  });
});

describe("privacy content", () => {
  const text = JSON.stringify(privacyPolicy).toLowerCase();

  it("lists every field the inquiry form collects", () => {
    for (const field of Object.values(inquiry.fields)) {
      const name = field
        .replace(/\*$/, "")
        .replace(/^My project is …$/, "message")
        .toLowerCase();
      expect(text).toContain(name);
    }
  });

  it("names the processors", () => {
    expect(text).toContain("resend");
    expect(text).toContain("netlify");
    expect(text).toContain("umami");
    expect(text).toContain("clarity");
  });
});
