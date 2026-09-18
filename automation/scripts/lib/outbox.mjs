/**
 * Loading and validating a batch of ready-to-send messages.
 *
 * In this mode nothing is generated at send time: the research and the
 * copywriting happen in a Claude session, which hands over a finished JSON
 * batch. That keeps the sender free of API keys, and it means every word that
 * reaches a prospect was read by a person first.
 *
 * The validation is strict on purpose. A batch is written once and sent over
 * several hours; a mistake found at message 30 has already cost 29 sends.
 */

import { readFile } from "node:fs/promises";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLACEHOLDER_RE = /\{\{[^}]*\}\}|\[(?:Firma|Imię|Imie|konkret|fraza|link|data)\]/i;

/** One message, after validation. `notatka` never leaves the file. */
function validateMessage(raw, index) {
  const where = `wiadomość #${index + 1}`;
  const problems = [];

  const to = String(raw.to ?? "").trim().toLowerCase();
  const subject = String(raw.temat ?? "").trim();
  const body = String(raw.tresc ?? "").trim();

  if (!to) problems.push("brak adresu");
  else if (!EMAIL_RE.test(to)) problems.push(`adres nie wygląda na poprawny: ${to}`);
  if (!subject) problems.push("brak tematu");
  if (!body) problems.push("brak treści");
  if (body.length < 120) problems.push("treść jest podejrzanie krótka");
  if (body.length > 2500) problems.push("treść jest za długa, nikt tego nie przeczyta");

  // A leftover placeholder is the single most expensive typo in outbound.
  const leftover = `${subject}\n${body}`.match(PLACEHOLDER_RE);
  if (leftover) problems.push(`nieuzupełnione pole: ${leftover[0]}`);

  if (problems.length) {
    throw new Error(`${where} (${raw.firma ?? to ?? "?"}): ${problems.join("; ")}`);
  }

  return {
    to,
    firma: String(raw.firma ?? "").trim(),
    osoba: String(raw.osoba ?? "").trim(),
    subject,
    body,
    domain: to.split("@")[1] ?? "",
    // Why this lead was picked. Useful when reviewing, never sent.
    notatka: String(raw.notatka ?? "").trim(),
  };
}

export async function loadOutbox(file) {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    throw new Error(`Nie mogę wczytać ${file}: ${err.message}`);
  }

  const list = Array.isArray(parsed) ? parsed : parsed.messages;
  if (!Array.isArray(list) || !list.length) {
    throw new Error(`${file} nie zawiera listy wiadomości (pole "messages").`);
  }

  const messages = list.map(validateMessage);

  // Two messages to one address in a single batch is always a mistake.
  const seen = new Map();
  for (const [i, m] of messages.entries()) {
    if (seen.has(m.to)) {
      throw new Error(
        `Adres ${m.to} występuje dwa razy: wiadomość #${seen.get(m.to) + 1} i #${i + 1}.`
      );
    }
    seen.set(m.to, i);
  }

  return {
    batch: String(parsed.batch ?? file),
    sequence: String(parsed.sequence ?? "demo"),
    step: Number(parsed.step ?? 1),
    messages,
  };
}
