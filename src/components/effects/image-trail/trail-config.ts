/** Tuning for <ImageTrail />. Distances in px, durations in seconds. */
const trailConfig = {
  /** Pool size — the hard cap on simultaneously live images. */
  poolSize: 10,
  /** Pointer travel needed to spawn the next image. */
  spawnDistance: 90,
  /** Max tilt applied in the direction of travel, degrees. */
  maxTilt: 12,
  scaleIn: 0.25,
  hold: 0.45,
  scaleOut: 0.35,
  /** Touch autoplay: seconds per full loop of the scripted path. */
  autoplayLoop: 9,
} as const;

export { trailConfig };
