import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimit } from "@/lib/rate-limit";

const sendInquiryEmail = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email", () => ({ sendInquiryEmail }));

import { POST } from "./route";

const valid = { name: "Ada", email: "ada@example.com", budget: "3k-6k" };

function post(body: unknown, ip = "1.1.1.1"): Request {
  return new Request("http://test/api/inquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/inquiry", () => {
  beforeEach(() => {
    resetRateLimit();
    sendInquiryEmail.mockReset().mockResolvedValue(true);
  });

  it("rejects malformed JSON", async () => {
    expect((await POST(post("{nope"))).status).toBe(400);
  });

  it.each([
    ["missing name", { ...valid, name: "" }],
    ["bad email", { ...valid, email: "nope" }],
    ["unknown budget", { ...valid, budget: "free" }],
    ["launch before start", { ...valid, startDate: "2026-05-02", launchDate: "2026-05-01" }],
    ["bad website", { ...valid, website: "not a url" }],
  ])("rejects %s", async (_label, body) => {
    const res = await POST(post(body));
    expect(res.status).toBe(400);
    expect(sendInquiryEmail).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot without sending", async () => {
    const res = await POST(post({ ...valid, companyWebsite: "spam.com" }));
    expect(res.status).toBe(200);
    expect(sendInquiryEmail).not.toHaveBeenCalled();
  });

  it("sends a valid inquiry", async () => {
    const res = await POST(post({ ...valid, website: "example.com" }));
    expect(await res.json()).toEqual({ ok: true });
    expect(sendInquiryEmail).toHaveBeenCalledWith(
      expect.objectContaining({ website: "https://example.com/" }),
    );
  });

  it("returns 502 when delivery fails", async () => {
    sendInquiryEmail.mockResolvedValue(false);
    expect((await POST(post(valid))).status).toBe(502);
  });

  it("rate limits per IP", async () => {
    for (let i = 0; i < 5; i++) await POST(post(valid, "9.9.9.9"));
    expect((await POST(post(valid, "9.9.9.9"))).status).toBe(429);
    expect((await POST(post(valid, "8.8.8.8"))).status).toBe(200);
  });
});
