type TrailSpawn = { x: number; y: number; angle: number };

type TrailSpawner = {
  /** Feed a pointer position; returns a spawn when enough distance has been travelled. */
  push: (x: number, y: number) => TrailSpawn | null;
  reset: () => void;
};

/**
 * Spawns by distance travelled, not by time (DESIGN_SPEC §5): a slow cursor leaves a sparse
 * trail, a fast one a dense one. `angle` is the travel direction in degrees (0 = right).
 */
function createTrailSpawner(threshold: number): TrailSpawner {
  let last: { x: number; y: number } | null = null;
  let travelled = 0;

  return {
    push(x, y) {
      if (!last) {
        last = { x, y };
        return null;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      travelled += Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      last = { x, y };
      if (travelled < threshold) return null;
      travelled = 0;
      return { x, y, angle };
    },
    reset() {
      last = null;
      travelled = 0;
    },
  };
}

/** Maps a travel angle to a small tilt: horizontal travel leans little, vertical leans most. */
function tiltFromAngle(angle: number, maxTilt: number): number {
  return Math.sin((angle * Math.PI) / 180) * maxTilt;
}

export { createTrailSpawner, tiltFromAngle };
export type { TrailSpawn };
