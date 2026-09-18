#!/usr/bin/env node
/**
 * Local drip sender: works through a batch of ready-written messages and
 * sends them from your own mailbox, one every ten to twelve minutes.
 *
 *   npm run check                 # validate the batch and show the plan
 *   npm run send                  # actually send, then keep running
 *   node scripts/send-local.mjs --send --outbox outbox/2026-09-18.json
 *
 * It is meant to be left running in a terminal for the working day. Every
 * send is written to disk the moment it happens, so closing the laptop, a
 * dropped connection or Ctrl+C costs at most the message in flight: on the
 * next run it picks up exactly where it stopped and never repeats an address.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLocalConfig, assertSendable, footerFor } from "./lib/config-local.mjs";
import { loadOutbox } from "./lib/outbox.mjs";
import { loadState, recordSent, alreadySent, sentToday } from "./lib/state.mjs";
import { loadSuppression, isSuppressed } from "./lib/suppression.mjs";
import { nextDelayMs, formatDelay, sleep } from "./lib/drip.mjs";
import { isWithinSendWindow } from "./lib/guards.mjs";
import { createTransport, verifyTransport, sendMessage } from "./lib/smtp.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const HELP = `
Wysyłka lokalna, jedna wiadomość co 10-12 minut z Twojej skrzynki.

  --send             wyślij naprawdę (domyślnie tylko sprawdzenie i podgląd)
  --outbox <plik>    paczka wiadomości (domyślnie outbox/biezacy.json)
  --limit N          wyślij najwyżej N wiadomości w tym przebiegu
  --show             w trybie sprawdzania wypisz pełną treść każdej wiadomości
  --force-window     pomiń sprawdzanie godzin i dni roboczych
`;

function parseArgs(argv) {
  const args = {
    send: false,
    show: false,
    forceWindow: false,
    limit: null,
    outbox: path.join(ROOT, "outbox", "biezacy.json"),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--send") args.send = true;
    else if (a === "--show") args.show = true;
    else if (a === "--force-window") args.forceWindow = true;
    else if (a === "--limit") args.limit = Number.parseInt(argv[++i], 10);
    else if (a === "--outbox") args.outbox = path.resolve(argv[++i]);
    else if (a === "--help" || a === "-h") args.help = true;
    else throw new Error(`Nieznany argument: ${a}`);
  }
  return args;
}

function clock(date, timezone) {
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return 0;
  }

  const cfg = loadLocalConfig();
  const outbox = await loadOutbox(args.outbox);
  const state = await loadState(path.join(ROOT, ".state", "wyslane.json"));
  const suppression = await loadSuppression(path.join(ROOT, "wypisani.txt"));

  // Decide the queue before touching the network, so the plan printed in
  // check mode is exactly the plan that will run.
  const queue = [];
  const skipped = [];
  for (const message of outbox.messages) {
    if (alreadySent(state, { to: message.to, batch: outbox.batch })) {
      skipped.push({ message, reason: "już wysłane w tej paczce" });
      continue;
    }
    const suppressedReason = isSuppressed(suppression, message);
    if (suppressedReason) {
      skipped.push({ message, reason: suppressedReason });
      continue;
    }
    queue.push(message);
  }

  const alreadyToday = sentToday(state, cfg.timezone);
  let budget = Math.max(0, cfg.dailyCap - alreadyToday);
  if (Number.isFinite(args.limit)) budget = Math.min(budget, args.limit);

  const plan = queue.slice(0, budget);
  const overBudget = queue.length - plan.length;

  console.log(`Paczka:        ${outbox.batch}`);
  console.log(`Wiadomości:    ${outbox.messages.length}`);
  console.log(`Do wysłania:   ${plan.length}`);
  if (overBudget > 0) {
    console.log(`Poza limitem:  ${overBudget} (dzienny limit ${cfg.dailyCap}, dziś już ${alreadyToday})`);
  }
  if (skipped.length) {
    console.log(`Pominięte:     ${skipped.length}`);
    for (const s of skipped) console.log(`   - ${s.message.to}: ${s.reason}`);
  }
  if (!suppression.exists) {
    console.log(`\nUwaga: nie ma pliku ${suppression.file}. Załóż go, gdy ktoś poprosi o wypisanie.`);
  }

  const avgMinutes = (cfg.minMinutes + cfg.maxMinutes) / 2;
  const estMinutes = Math.round(Math.max(0, plan.length - 1) * avgMinutes);
  console.log(
    `\nTempo:         co ${cfg.minMinutes}-${cfg.maxMinutes} min losowo, ` +
      `okno ${cfg.windowStart}:00-${cfg.windowEnd}:00 ${cfg.timezone}` +
      (cfg.weekdaysOnly ? ", dni robocze" : "")
  );
  console.log(
    `Szacowany czas: ok. ${Math.floor(estMinutes / 60)} h ${estMinutes % 60} min ` +
      `(${plan.length} wiadomości)`
  );

  if (!args.send) {
    console.log(`\nTryb sprawdzania. Nic nie wyszło.`);
    if (args.show) {
      for (const m of plan) {
        console.log(`\n${"=".repeat(70)}\nDo:    ${m.to}  (${m.firma})`);
        if (m.notatka) console.log(`Powód: ${m.notatka}`);
        console.log(`Temat: ${m.subject}\n`);
        console.log(m.body + footerFor(cfg));
      }
    } else if (plan.length) {
      const first = plan[0];
      console.log(`\nPodgląd pierwszej wiadomości (--show pokaże wszystkie):`);
      console.log(`${"=".repeat(70)}\nDo:    ${first.to}  (${first.firma})`);
      console.log(`Temat: ${first.subject}\n`);
      console.log(first.body + footerFor(cfg));
    }
    console.log(`\nGdy wygląda dobrze: npm run send`);
    return 0;
  }

  if (!plan.length) {
    console.log("\nNie ma czego wysyłać.");
    return 0;
  }

  assertSendable(cfg);

  const transport = createTransport(cfg);
  await verifyTransport(transport);
  console.log(`\nSkrzynka OK: ${cfg.smtpUser}`);

  // Ctrl+C stops after the current message instead of killing it mid-send.
  const controller = new AbortController();
  let stopping = false;
  process.on("SIGINT", () => {
    if (stopping) process.exit(1);
    stopping = true;
    console.log("\nKończę po bieżącej wiadomości. Postęp jest zapisany.");
    controller.abort();
  });

  const footer = footerFor(cfg);
  let sent = 0;
  let failed = 0;

  for (const [index, message] of plan.entries()) {
    if (stopping) break;

    if (!args.forceWindow) {
      const window = isWithinSendWindow(cfg, new Date());
      if (!window.ok) {
        console.log(`\nZatrzymuję się: ${window.reason}. Uruchom ponownie w oknie wysyłki.`);
        break;
      }
    }

    try {
      const { messageId } = await sendMessage(transport, cfg, {
        to: message.to,
        subject: message.subject,
        text: message.body + footer,
      });
      await recordSent(state, {
        to: message.to,
        batch: outbox.batch,
        subject: message.subject,
        messageId,
      });
      sent++;
      console.log(
        `[${clock(new Date(), cfg.timezone)}] ${String(sent).padStart(2)}/${plan.length}  ` +
          `${message.to.padEnd(34)} ${message.firma}`
      );
    } catch (err) {
      failed++;
      console.error(
        `[${clock(new Date(), cfg.timezone)}] BŁĄD  ${message.to.padEnd(34)} ${err.message}`
      );
      // A refused recipient is one bad row; a broken connection or a hit
      // sending limit will refuse everything, so stop rather than burn the
      // rest of the batch against a wall.
      if (failed >= 3 && sent === 0) {
        console.error("\nTrzy błędy z rzędu i zero wysłanych. Zatrzymuję się, sprawdź skrzynkę.");
        break;
      }
    }

    const isLast = index === plan.length - 1;
    if (isLast || stopping) break;

    const delay = nextDelayMs(cfg);
    const nextAt = new Date(Date.now() + delay);
    console.log(
      `           następna za ${formatDelay(delay)} (${clock(nextAt, cfg.timezone)})`
    );
    await sleep(delay, controller.signal);
  }

  transport.close();
  console.log(`\nWysłane: ${sent} | błędy: ${failed} | zostało w paczce: ${plan.length - sent - failed}`);
  console.log(`Stan zapisany w ${state.file}. Kolejny przebieg pominie wysłane adresy.`);
  return failed > 0 && sent === 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`\nPrzerwane: ${err.message}`);
    process.exit(1);
  });
