import { describe, expect, it } from "vitest";

import { inquirySchema } from "./inquiry";

const valid = { name: "Ada", email: "ada@example.com" };

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

  it("accepts known employment types and work setups only", () => {
    expect(
      inquirySchema.safeParse({ ...valid, employmentType: "full-time", workSetup: "remote" })
        .success,
    ).toBe(true);
    expect(inquirySchema.safeParse({ ...valid, employmentType: "free" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, workSetup: "moon" }).success).toBe(false);
  });

  it("passes the honeypot through so the route can detect it", () => {
    expect(inquirySchema.parse({ ...valid, companyWebsite: "x" }).companyWebsite).toBe("x");
  });
});
