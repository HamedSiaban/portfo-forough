/**
 * Fixed-window in-memory rate limiter, keyed by caller (IP).
 * Dev/single-instance only: serverless instances don't share memory, so production
 * should swap this for Upstash Ratelimit behind the same `rateLimit()` signature.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now: number = Date.now(),
): boolean {
  // Opportunistic sweep keeps the map from growing without a timer.
  if (buckets.size > 1000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

function resetRateLimit(): void {
  buckets.clear();
}

export { rateLimit, resetRateLimit };
