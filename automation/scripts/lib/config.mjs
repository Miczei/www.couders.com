/**
 * Runtime configuration for the outreach sender, read once from the
 * environment so every other module stays a pure function of its inputs.
 *
 * Nothing here has a secret as a default. A missing secret is a hard error at
 * startup rather than a silent no-op, because a mailer that quietly sends
 * nothing looks exactly like a mailer that quietly sends everything twice.
 */

const bool = (v, fallback = false) =>
  v === undefined || v === "" ? fallback : /^(1|true|yes|tak)$/i.test(v);

const int = (v, fallback) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
};

export function loadConfig(env = process.env) {
  const cfg = {
    // --- data source (Google Apps Script web app in front of a Sheet) ---
    queueUrl: env.OUTREACH_QUEUE_URL ?? "",
    queueToken: env.OUTREACH_QUEUE_TOKEN ?? "",

    // --- sending ---
    resendKey: env.RESEND_API_KEY ?? "",
    from: env.OUTREACH_FROM ?? "",
    replyTo: env.OUTREACH_REPLY_TO ?? "",
    unsubscribeMailbox: env.OUTREACH_UNSUBSCRIBE_MAILBOX ?? "",
    senderBlock: env.OUTREACH_SENDER_BLOCK ?? "",

    // --- guards ---
    enabled: bool(env.OUTREACH_ENABLED, false),
    dailyCap: int(env.OUTREACH_DAILY_CAP, 20),
    windowStart: int(env.OUTREACH_WINDOW_START, 8),
    windowEnd: int(env.OUTREACH_WINDOW_END, 17),
    weekdaysOnly: bool(env.OUTREACH_WEEKDAYS_ONLY, true),
    allowPrimaryDomain: bool(env.OUTREACH_ALLOW_PRIMARY_DOMAIN, false),
    primaryDomain: env.OUTREACH_PRIMARY_DOMAIN ?? "couders.com",
    timezone: env.OUTREACH_TIMEZONE ?? "Europe/Warsaw",

    // --- cadence, in days after the first message in the thread ---
    stepDelays: (env.OUTREACH_STEP_DELAYS ?? "0,3,7")
      .split(",")
      .map((s) => Number.parseInt(s.trim(), 10)),
  };

  return cfg;
}

/**
 * Fails loudly on anything that would make a run meaningless or dangerous.
 * `dryRun` relaxes the checks that only matter when mail actually leaves.
 */
export function assertUsable(cfg, { dryRun }) {
  const missing = [];
  if (!cfg.queueUrl) missing.push("OUTREACH_QUEUE_URL");
  if (!cfg.queueToken) missing.push("OUTREACH_QUEUE_TOKEN");
  if (!dryRun) {
    if (!cfg.resendKey) missing.push("RESEND_API_KEY");
    if (!cfg.from) missing.push("OUTREACH_FROM");
    if (!cfg.senderBlock) missing.push("OUTREACH_SENDER_BLOCK");
    if (!cfg.unsubscribeMailbox) missing.push("OUTREACH_UNSUBSCRIBE_MAILBOX");
  }
  if (missing.length) {
    throw new Error(`Brak wymaganych zmiennych środowiskowych: ${missing.join(", ")}`);
  }

  // The playbook's first rule: cold mail never leaves the domain the website
  // and the company mailboxes depend on.
  const fromDomain = cfg.from.split("@").pop()?.toLowerCase() ?? "";
  if (
    !dryRun &&
    fromDomain.endsWith(cfg.primaryDomain.toLowerCase()) &&
    !cfg.allowPrimaryDomain
  ) {
    throw new Error(
      `OUTREACH_FROM (${cfg.from}) używa domeny głównej ${cfg.primaryDomain}. ` +
        "Zimna wysyłka spali jej reputację razem z firmową pocztą. " +
        "Użyj osobnej domeny albo świadomie ustaw OUTREACH_ALLOW_PRIMARY_DOMAIN=true."
    );
  }
}
