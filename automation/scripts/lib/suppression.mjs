/**
 * The do-not-contact list, as a plain text file next to the sender.
 *
 * One entry per line: a full address, or a bare domain to block a whole
 * company. Lines starting with # are comments. Kept as text rather than a
 * spreadsheet so that adding someone who asked to be left alone takes five
 * seconds, which is the only way such a list stays accurate.
 */

import { readFile } from "node:fs/promises";

export async function loadSuppression(file) {
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return { emails: new Set(), domains: new Set(), file, exists: false };
  }

  const emails = new Set();
  const domains = new Set();
  for (const line of raw.split(/\r?\n/)) {
    const entry = line.split("#")[0].trim().toLowerCase();
    if (!entry) continue;
    if (entry.includes("@")) emails.add(entry);
    else domains.add(entry.replace(/^@/, ""));
  }
  return { emails, domains, file, exists: true };
}

export function isSuppressed(suppression, { to, domain }) {
  if (suppression.emails.has(to)) return `adres ${to} jest na liście wypisanych`;
  if (domain && suppression.domains.has(domain)) {
    return `domena ${domain} jest na liście wypisanych`;
  }
  return null;
}
