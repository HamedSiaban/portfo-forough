import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins truthy class values", () => {
    expect(cn("flex", false && "hidden", undefined, "gap-2")).toBe("flex gap-2");
  });

  it("resolves conflicting tailwind utilities, last one wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
