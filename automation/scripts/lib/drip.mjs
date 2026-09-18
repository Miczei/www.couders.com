/**
 * Pacing. The point of a drip is that the stream of messages looks like a
 * person working through a list, because a provider that decides otherwise
 * stops delivering and takes the sender's reputation with it.
 *
 * Three things do that work together, and the interval alone is the weakest
 * of them:
 *   - a random gap between sends, so no two are the same distance apart;
 *   - a working-hours window, because nobody types cold e-mails at 04:00;
 *   - a daily cap, because volume is what actually trips rate heuristics.
 */

export const DEFAULT_MIN_MINUTES = 10;
export const DEFAULT_MAX_MINUTES = 12;

/**
 * A uniformly random gap in the configured range, to the second.
 *
 * Rounding to whole minutes would put every send on a minute boundary and
 * hand back the regularity the randomness was there to remove, so the
 * resolution stays at one second.
 */
export function nextDelayMs(cfg, random = Math.random) {
  const min = Math.min(cfg.minMinutes, cfg.maxMinutes);
  const max = Math.max(cfg.minMinutes, cfg.maxMinutes);
  const seconds = Math.round((min + random() * (max - min)) * 60);
  return seconds * 1000;
}

export function formatDelay(ms) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/** A Ctrl+C-able sleep: resolves early when the process is asked to stop. */
export function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    const timer = setTimeout(done, ms);
    const onAbort = () => {
      clearTimeout(timer);
      done();
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    function done() {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }
  });
}
