import { describe, expect, it } from "vitest";

import { clampSeek, formatTime, keyAction } from "./video-player";

describe("formatTime", () => {
  it("formats minutes and seconds", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65.9)).toBe("1:05");
  });
  it("adds hours when needed and survives NaN", () => {
    expect(formatTime(3725)).toBe("1:02:05");
    expect(formatTime(Number.NaN)).toBe("0:00");
  });
});

describe("clampSeek", () => {
  it("clamps to [0, duration]", () => {
    expect(clampSeek(2, -5, 60)).toBe(0);
    expect(clampSeek(58, 5, 60)).toBe(60);
    expect(clampSeek(10, 5, 60)).toBe(15);
  });
  it("only clamps at 0 while duration is unknown", () => {
    expect(clampSeek(10, 5, Number.NaN)).toBe(15);
  });
});

describe("keyAction", () => {
  it("maps the documented keys", () => {
    expect(keyAction(" ")).toBe("toggle");
    expect(keyAction("ArrowLeft")).toBe("back");
    expect(keyAction("ArrowRight")).toBe("forward");
    expect(keyAction("m")).toBe("mute");
    expect(keyAction("C")).toBe("captions");
    expect(keyAction("x")).toBeNull();
  });
});
