// Lightweight, in-memory abuse protection for the AI route. This project
// has no database (per project constraints), so this is intentionally
// simple rather than a distributed limiter. It meaningfully throttles a
// script hammering a single warm serverless instance, but resets if
// Netlify spins up a fresh instance — an honest, documented limitation,
// not a claim of bulletproof protection.

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

const requestLog = new Map(); // ip -> array of timestamps

export function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

export function getClientIp(req) {
  // Netlify sets this header; x-forwarded-for is the general fallback.
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export const MAX_MESSAGE_LENGTH = 2000;