/**
 * Every rule that decides whether a given row may receive a given message
 * today. Kept separate from I/O so the decisions can be reasoned about (and
 * unit-tested) without a sheet or an API key.
 *
 * The bias throughout is towards not sending. A message skipped today costs
 * one day; a message sent to someone who asked to be left alone costs the
 * domain, and under the Polish Prawo komunikacji elektronicznej it can cost
 * more than that.
 */

/** Statuses that mean a human is already in the conversation, or it is over. */
const TERMINAL = new Set([
  "odpowiedz",
  "odpowiedź",
  "spotkanie",
  "oferta",
  "klient",
  "odpadl",
  "odpadł",
  "wypisany",
  "unsubscribed",
  "bounce",
  "bounced",
  "blad",
  "błąd",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DAY_MS = 86_400_000;

/** Calendar days between two dates, ignoring the clock time within a day. */
export function daysBetween(fromIso, now) {
  const then = new Date(fromIso);
  if (Number.isNaN(then.getTime())) return null;
  const a = Date.UTC(then.getUTCFullYear(), then.getUTCMonth(), then.getUTCDate());
  const b = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((b - a) / DAY_MS);
}

/** Local hour and weekday in the configured timezone, without a date library. */
export function localParts(now, timezone) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "numeric",
    weekday: "short",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    hour: Number.parseInt(parts.hour, 10),
    weekday: parts.weekday, // Mon, Tue, ...
  };
}

export function isWithinSendWindow(cfg, now = new Date()) {
  const { hour, weekday } = localParts(now, cfg.timezone);
  if (cfg.weekdaysOnly && ["Sat", "Sun"].includes(weekday)) {
    return { ok: false, reason: `weekend (${weekday})` };
  }
  if (hour < cfg.windowStart || hour >= cfg.windowEnd) {
    return {
      ok: false,
      reason: `poza oknem ${cfg.windowStart}:00-${cfg.windowEnd}:00 (jest ${hour}:00 ${cfg.timezone})`,
    };
  }
  return { ok: true };
}

/**
 * Which message, if any, this row is due for right now.
 * Returns { step } or { skip: "<human readable reason>" }.
 */
export function decide(row, cfg, suppression, now = new Date()) {
  if (!row.email) return { skip: "brak adresu e-mail" };
  if (!EMAIL_RE.test(row.email)) return { skip: `adres nie wygląda na poprawny (${row.email})` };
  if (TERMINAL.has(row.status)) return { skip: `status "${row.status}" zamyka sekwencję` };
  if (suppression.emails.has(row.email)) return { skip: "adres na liście wypisanych" };
  if (row.domain && suppression.domains.has(row.domain)) {
    return { skip: `domena ${row.domain} na liście wypisanych` };
  }

  const nextStep = (row.step || 0) + 1;
  if (nextStep > cfg.stepDelays.length) return { skip: "sekwencja zakończona" };

  // Step 1 of the demo sequence is pointless without a demo to link to. That
  // is the whole premise of the message, so it is a hard requirement.
  if (row.sequence === "demo" && nextStep === 1 && !row.demoUrl) {
    return { skip: "brak demoUrl (sekwencja demo wymaga działającego demo)" };
  }

  if (nextStep === 1) return { step: 1 };

  const anchor = row.firstSentAt || row.lastSentAt;
  if (!anchor) return { skip: "brak daty pierwszej wysyłki, nie wiadomo kiedy wysłać follow-up" };
  const elapsed = daysBetween(anchor, now);
  if (elapsed === null) return { skip: `nieczytelna data wysyłki (${anchor})` };

  const due = cfg.stepDelays[nextStep - 1];
  if (elapsed < due) {
    return { skip: `follow-up ${nextStep} dopiero za ${due - elapsed} dni` };
  }
  return { step: nextStep };
}

/**
 * Applies the run-level limits to an already-eligible list: the daily cap and
 * one message per company per run, so two decision makers at the same firm
 * never get the same pitch on the same morning.
 */
export function applyRunLimits(eligible, cfg) {
  const picked = [];
  const skipped = [];
  const seenDomains = new Set();
  for (const item of eligible) {
    if (picked.length >= cfg.dailyCap) {
      skipped.push({ ...item, skip: `dzienny limit ${cfg.dailyCap} wyczerpany` });
      continue;
    }
    if (item.row.domain && seenDomains.has(item.row.domain)) {
      skipped.push({ ...item, skip: `inna osoba z ${item.row.domain} dostaje dziś wiadomość` });
      continue;
    }
    if (item.row.domain) seenDomains.add(item.row.domain);
    picked.push(item);
  }
  return { picked, skipped };
}
