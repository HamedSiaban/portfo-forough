/** `m:ss` (or `h:mm:ss`) for the player's time readout. Non-finite input reads as 0:00. */
function formatTime(seconds: number): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = String(total % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${secs}` : `${minutes}:${secs}`;
}

/** Seek target clamped to the playable range; an unknown duration only clamps at 0. */
function clampSeek(current: number, delta: number, duration: number): number {
  const next = Math.max(0, current + delta);
  return Number.isFinite(duration) && duration > 0 ? Math.min(next, duration) : next;
}

type PlayerKeyAction = "toggle" | "back" | "forward" | "mute" | "captions";

/** Keyboard map (Space, ←/→, M, C). Returns null for keys the player ignores. */
function keyAction(key: string): PlayerKeyAction | null {
  switch (key) {
    case " ":
      return "toggle";
    case "ArrowLeft":
      return "back";
    case "ArrowRight":
      return "forward";
    case "m":
    case "M":
      return "mute";
    case "c":
    case "C":
      return "captions";
    default:
      return null;
  }
}

/** Shows/hides the first text track; returns whether captions are now showing. */
function setCaptions(video: HTMLVideoElement, show: boolean): boolean {
  const track = video.textTracks[0];
  if (!track) return false;
  track.mode = show ? "showing" : "hidden";
  return show;
}

/**
 * Hides the shared-element origin while the player frame stands in for it (opacity, not
 * visibility, so it stays focusable for focus return). Returns the restore function.
 */
function hideOrigin(origin: HTMLElement): () => void {
  const previous = origin.style.opacity;
  origin.style.opacity = "0";
  return () => {
    origin.style.opacity = previous;
  };
}

export { clampSeek, formatTime, hideOrigin, keyAction, setCaptions };
export type { PlayerKeyAction };
