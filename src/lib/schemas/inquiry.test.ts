import { describe, expect, it } from "vitest";

import { inquirySchema } from "./inquiry";

const valid = { name: "Ada", email: "ada@example.com", budget: "3k-6k" };

describe("inquirySchema", () => {
  it("accepts the minimal payload", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it("normalises a bare domain and allows empty optionals", () => {
    const r = inquirySchema.parse({ ...valid, website: "example.com", startDate: "" });
    expect(r.website).toBe("https://example.com/");
  });

  it("allows an empty website", () => {
    expect(inquirySchema.parse({ ...valid, website: "" }).website).toBe("");
  });

  it("rejects launch before start but allows same day", () => {
    const base = { ...valid, startDate: "2026-05-02" };
    expect(inquirySchema.safeParse({ ...base, launchDate: "2026-05-01" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...base, launchDate: "2026-05-02" }).success).toBe(true);
  });

  it("passes the honeypot through so the route can detect it", () => {
    expect(inquirySchema.parse({ ...valid, companyWebsite: "x" }).companyWebsite).toBe("x");
  });
});
