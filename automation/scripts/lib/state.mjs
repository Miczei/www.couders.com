/**
 * What has already gone out, on disk.
 *
 * The sender runs for hours on a laptop that will be closed, put to sleep, or
 * interrupted with Ctrl+C. Without durable state, a restart re-sends the top
 * of the batch to people who already got it, which is worse than sending
 * nothing at all. The file is written after every single send, not at the end.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function loadState(file) {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return {
      sent: new Map(Object.entries(parsed.sent ?? {})),
      file,
    };
  } catch {
    // A missing or unreadable state file means "nothing sent yet", which is
    // the safe assumption only because every send is recorded immediately.
    return { sent: new Map(), file };
  }
}

export async function recordSent(state, { to, batch, subject, messageId }) {
  state.sent.set(`${batch}::${to}`, {
    at: new Date().toISOString(),
    subject,
    messageId,
  });
  await mkdir(path.dirname(state.file), { recursive: true });
  await writeFile(
    state.file,
    JSON.stringify({ sent: Object.fromEntries(state.sent) }, null, 2),
    "utf8"
  );
}

export function alreadySent(state, { to, batch }) {
  return state.sent.has(`${batch}::${to}`);
}

/** How many messages went out today, in the given timezone. */
export function sentToday(state, timezone, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(now);
  let count = 0;
  for (const entry of state.sent.values()) {
    if (!entry?.at) continue;
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(
      new Date(entry.at)
    );
    if (day === today) count++;
  }
  return count;
}
