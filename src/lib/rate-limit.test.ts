import { beforeEach, describe, expect, it } from "vitest";

import { rateLimit, resetRateLimit } from "./rate-limit";

const opts = { limit: 2, windowMs: 1000 };

describe("rateLimit", () => {
  beforeEach(resetRateLimit);

  it("allows up to the limit then blocks", () => {
    expect(rateLimit("a", opts, 0)).toBe(true);
    expect(rateLimit("a", opts, 1)).toBe(true);
    expect(rateLimit("a", opts, 2)).toBe(false);
  });

  it("tracks keys independently", () => {
    rateLimit("a", opts, 0);
    rateLimit("a", opts, 0);
    expect(rateLimit("b", opts, 0)).toBe(true);
  });

  it("resets after the window", () => {
    rateLimit("a", opts, 0);
    rateLimit("a", opts, 0);
    expect(rateLimit("a", opts, 1000)).toBe(true);
  });
});
