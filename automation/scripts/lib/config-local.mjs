/**
 * Configuration for the local drip sender. Read from the environment, with
 * automation/.env loaded automatically so running the script is one command
 * rather than a shell incantation people get wrong at 8am.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_MIN_MINUTES, DEFAULT_MAX_MINUTES } from "./drip.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Minimal .env reader: KEY=value, quotes stripped, # comments ignored. */
function loadDotEnv(env) {
  let raw;
  try {
    raw = readFileSync(path.join(ROOT, ".env"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    // An explicit environment variable always wins over the file.
    if (env[key] !== undefined) continue;
    env[key] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
}

const bool = (v, fallback) =>
  v === undefined || v === "" ? fallback : /^(1|true|yes|tak)$/i.test(v);
const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export function loadLocalConfig(env = process.env) {
  loadDotEnv(env);
  return {
    smtpPreset: env.SMTP_PRESET ?? "gmail",
    smtpHost: env.SMTP_HOST ?? "",
    smtpPort: num(env.SMTP_PORT, 0),
    smtpSecure: env.SMTP_SECURE === undefined ? undefined : bool(env.SMTP_SECURE, true),
    smtpUser: env.SMTP_USER ?? "",
    smtpPass: env.SMTP_PASS ?? "",

    from: env.OUTREACH_FROM ?? "",
    replyTo: env.OUTREACH_REPLY_TO ?? "",
    unsubscribeMailbox: env.OUTREACH_UNSUBSCRIBE_MAILBOX ?? "",
    senderBlock: env.OUTREACH_SENDER_BLOCK ?? "",

    minMinutes: num(env.OUTREACH_MIN_MINUTES, DEFAULT_MIN_MINUTES),
    maxMinutes: num(env.OUTREACH_MAX_MINUTES, DEFAULT_MAX_MINUTES),
    dailyCap: num(env.OUTREACH_DAILY_CAP, 20),
    windowStart: num(env.OUTREACH_WINDOW_START, 8),
    windowEnd: num(env.OUTREACH_WINDOW_END, 17),
    weekdaysOnly: bool(env.OUTREACH_WEEKDAYS_ONLY, true),
    timezone: env.OUTREACH_TIMEZONE ?? "Europe/Warsaw",

    allowPrimaryDomain: bool(env.OUTREACH_ALLOW_PRIMARY_DOMAIN, false),
    primaryDomain: env.OUTREACH_PRIMARY_DOMAIN ?? "couders.com",
  };
}

export function assertSendable(cfg) {
  const missing = [];
  if (!cfg.smtpUser) missing.push("SMTP_USER");
  if (!cfg.smtpPass) missing.push("SMTP_PASS");
  if (!cfg.from) missing.push("OUTREACH_FROM");
  if (!cfg.senderBlock) missing.push("OUTREACH_SENDER_BLOCK");
  if (!cfg.unsubscribeMailbox) missing.push("OUTREACH_UNSUBSCRIBE_MAILBOX");
  if (missing.length) {
    throw new Error(`Brak wymaganych ustawień: ${missing.join(", ")} (patrz automation/.env.example)`);
  }

  const fromDomain = cfg.from.split("@").pop()?.replace(/>$/, "").toLowerCase() ?? "";
  if (fromDomain.endsWith(cfg.primaryDomain.toLowerCase()) && !cfg.allowPrimaryDomain) {
    throw new Error(
      `OUTREACH_FROM (${cfg.from}) używa domeny głównej ${cfg.primaryDomain}.\n` +
        "Zimna wysyłka z tej domeny spali reputację strony i firmowej poczty.\n" +
        "Użyj osobnej domeny albo świadomie ustaw OUTREACH_ALLOW_PRIMARY_DOMAIN=true."
    );
  }

  if (cfg.minMinutes < 1) throw new Error("OUTREACH_MIN_MINUTES musi być większe od zera.");
  if (cfg.maxMinutes < cfg.minMinutes) {
    throw new Error("OUTREACH_MAX_MINUTES nie może być mniejsze niż OUTREACH_MIN_MINUTES.");
  }
}

export function footerFor(cfg) {
  // Two leading newlines: the body ends without one, and a signature needs a
  // blank line above the delimiter to render as a signature rather than as a
  // last paragraph.
  return [
    "",
    "",
    "--",
    cfg.senderBlock || "<ustaw OUTREACH_SENDER_BLOCK>",
    `Nie chcesz tych wiadomości? Odpisz "STOP" albo napisz na ` +
      `${cfg.unsubscribeMailbox || "<ustaw OUTREACH_UNSUBSCRIBE_MAILBOX>"}, usuwamy natychmiast.`,
  ].join("\n");
}
