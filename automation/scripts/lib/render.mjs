/**
 * Template loading and variable substitution.
 *
 * Templates are plain text with a small front matter block, so a salesperson
 * can edit the words without touching JavaScript. The one strict rule is that
 * a rendered message may not contain an unfilled placeholder: "Dzień dobry
 * {{firstName}}" landing in someone's inbox is the single most expensive
 * typo in outbound sales, so it is a hard failure rather than a warning.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const VAR_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Minimal front matter: `key: value` lines between two `---` fences. */
function parseFrontMatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length).trim() };
}

export async function loadTemplates(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  const templates = new Map();
  for (const file of files) {
    const raw = await readFile(path.join(dir, file), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    if (!meta.id) throw new Error(`Szablon ${file} nie ma pola "id" we front matter.`);
    templates.set(meta.id, {
      id: meta.id,
      file,
      subject: meta.subject ?? "",
      // A follow-up must stay in the same thread, so it reuses the subject of
      // the message it follows instead of starting a new conversation.
      threadWith: meta.threadWith ?? "",
      requires: (meta.requires ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      body,
    });
  }
  return templates;
}

export function templateIdFor(sequence, step) {
  return `${sequence}-${step}`;
}

function substitute(text, vars) {
  return text.replace(VAR_RE, (_, key) => vars[key] ?? "");
}

/**
 * Renders one message. Returns { subject, text } or throws with a reason the
 * caller can log against the row.
 */
export function render(template, vars, { senderBlock, unsubscribeMailbox }) {
  const missing = template.requires.filter((k) => !vars[k]);
  if (missing.length) {
    throw new Error(`brak danych do szablonu ${template.id}: ${missing.join(", ")}`);
  }

  const subject = substitute(template.subject, vars).trim();
  const bodyText = substitute(template.body, vars).trim();

  const leftover = [...`${subject}\n${bodyText}`.matchAll(VAR_RE)].map((m) => m[1]);
  if (leftover.length) {
    throw new Error(`nieuzupełnione pola w szablonie: ${[...new Set(leftover)].join(", ")}`);
  }
  // The playbook's own placeholder convention, in case a template was pasted
  // straight out of sekwencje.md without being converted.
  const bracketed = bodyText.match(/\[[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż ]{2,20}\]/g);
  if (bracketed) {
    throw new Error(`szablon zawiera nieprzerobione pola z sekwencje.md: ${bracketed.join(", ")}`);
  }

  const footer = [
    "",
    "--",
    senderBlock,
    `Nie chcesz tych wiadomości? Odpisz "STOP" albo napisz na ${unsubscribeMailbox}, usuwamy natychmiast.`,
  ].join("\n");

  return { subject, text: `${bodyText}\n${footer}\n` };
}
