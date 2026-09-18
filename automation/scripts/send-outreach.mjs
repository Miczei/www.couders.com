#!/usr/bin/env node
/**
 * Outreach sender: one pass over the lead queue, sending at most the daily cap.
 *
 * Runs from GitHub Actions on a weekday-morning schedule (see
 * .github/workflows/outreach.yml) or by hand:
 *
 *   node automation/scripts/send-outreach.mjs              # dry run, prints what it would do
 *   node automation/scripts/send-outreach.mjs --send       # actually sends
 *   node automation/scripts/send-outreach.mjs --limit 5    # smaller batch
 *
 * A dry run is the default and needs no API key. Sending requires both the
 * --send flag and OUTREACH_ENABLED=true: two switches, because "oops, it was
 * live" is not a recoverable mistake with cold email.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, assertUsable } from "./lib/config.mjs";
import { fetchRows, fetchSuppression, markSent, markFailed } from "./lib/queue.mjs";
import { decide, applyRunLimits, isWithinSendWindow } from "./lib/guards.mjs";
import { loadTemplates, templateIdFor, render } from "./lib/render.mjs";
import { sendEmail } from "./lib/mailer.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(HERE, "..", "templates");

function parseArgs(argv) {
  const args = { send: false, limit: null, forceWindow: false, sequence: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--send") args.send = true;
    else if (a === "--force-window") args.forceWindow = true;
    else if (a === "--limit") args.limit = Number.parseInt(argv[++i], 10);
    else if (a === "--sequence") args.sequence = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
    else throw new Error(`Nieznany argument: ${a}`);
  }
  return args;
}

const HELP = `
Wysyłka sekwencji outreachowych.

  --send            wyślij naprawdę (domyślnie: dry run, nic nie wychodzi)
  --limit N         nadpisz dzienny limit na ten przebieg
  --sequence NAZWA  tylko wiersze z tą sekwencją (np. demo, zgoda)
  --force-window    pomiń sprawdzenie godzin wysyłki
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return 0;
  }

  const dryRun = !args.send;
  const cfg = loadConfig();
  if (Number.isFinite(args.limit)) cfg.dailyCap = args.limit;

  // The kill switch is checked before anything else so that a scheduled run
  // with sending turned off finishes green and quiet. A cron that fails every
  // morning gets muted, and a muted cron hides the failures that matter.
  if (!dryRun && !cfg.enabled) {
    console.log(
      "OUTREACH_ENABLED nie jest ustawione na true, więc nic nie wysyłam.\n" +
        "To główny włącznik: ustaw go na true, gdy podgląd wygląda dobrze."
    );
    return 0;
  }

  assertUsable(cfg, { dryRun });

  const now = new Date();
  if (!dryRun && !args.forceWindow) {
    const window = isWithinSendWindow(cfg, now);
    if (!window.ok) {
      console.log(`Nic nie wysyłam: ${window.reason}.`);
      return 0;
    }
  }

  const [templates, rows, suppression] = await Promise.all([
    loadTemplates(TEMPLATE_DIR),
    fetchRows(cfg),
    fetchSuppression(cfg),
  ]);

  console.log(
    `Wierszy w kolejce: ${rows.length} | na liście wypisanych: ` +
      `${suppression.emails.size} adresów, ${suppression.domains.size} domen`
  );

  const eligible = [];
  const skipped = [];
  for (const row of rows) {
    if (args.sequence && row.sequence !== args.sequence) continue;
    const verdict = decide(row, cfg, suppression, now);
    if (verdict.skip) skipped.push({ row, skip: verdict.skip });
    else eligible.push({ row, step: verdict.step });
  }

  // Oldest contact first, so nobody sits in the queue forever behind a
  // steady drip of freshly added leads.
  eligible.sort((a, b) => (a.row.lastSentAt || "").localeCompare(b.row.lastSentAt || ""));

  const { picked, skipped: capped } = applyRunLimits(eligible, cfg);
  skipped.push(...capped);

  const results = { sent: 0, failed: 0, skipped: skipped.length };

  for (const { row, step } of picked) {
    const templateId = templateIdFor(row.sequence, step);
    const template = templates.get(templateId);
    if (!template) {
      skipped.push({
        row,
        skip: `sekwencja "${row.sequence}" nie ma kroku ${step}, kończy się wcześniej`,
      });
      results.skipped++;
      continue;
    }

    let message;
    try {
      message = render(template, row, {
        // A dry run does not require the sender identity to be configured, so
        // show what is still missing instead of rendering a silently empty
        // footer that looks fine in the preview and is illegal in the inbox.
        senderBlock: cfg.senderBlock || "<ustaw OUTREACH_SENDER_BLOCK>",
        unsubscribeMailbox: cfg.unsubscribeMailbox || "<ustaw OUTREACH_UNSUBSCRIBE_MAILBOX>",
      });
    } catch (err) {
      skipped.push({ row, skip: err.message });
      results.skipped++;
      continue;
    }

    // A follow-up keeps the original subject so it threads under the first
    // message instead of opening a second conversation.
    const subject = template.threadWith ? `Re: ${message.subject}` : message.subject;

    if (dryRun) {
      console.log(`\n--- [DRY RUN] ${row.email} | ${row.company} | krok ${step} (${templateId})`);
      console.log(`Temat: ${subject}`);
      console.log(message.text);
      results.sent++;
      continue;
    }

    try {
      const { messageId } = await sendEmail(cfg, {
        to: row.email,
        subject,
        text: message.text,
      });
      await markSent(cfg, { rowId: row.rowId, step, messageId, at: now.toISOString() });
      results.sent++;
      console.log(`wysłano  ${row.email.padEnd(34)} krok ${step}  ${row.company}`);
    } catch (err) {
      results.failed++;
      console.error(`BŁĄD     ${row.email.padEnd(34)} ${err.message}`);
      await markFailed(cfg, { rowId: row.rowId, error: err.message }).catch(() => {});
    }
  }

  if (skipped.length) {
    console.log("\nPominięte:");
    const counts = new Map();
    for (const s of skipped) counts.set(s.skip, (counts.get(s.skip) ?? 0) + 1);
    for (const [reason, count] of [...counts].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(4)}  ${reason}`);
    }
  }

  console.log(
    `\n${dryRun ? "DRY RUN" : "WYSŁANE"}: ${results.sent} | błędy: ${results.failed} | pominięte: ${results.skipped}`
  );
  return results.failed > 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\nPrzerwane: ${err.message}`);
    process.exit(1);
  });
