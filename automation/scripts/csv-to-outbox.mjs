#!/usr/bin/env node
/**
 * Zamienia arkusz leadów zapisany jako CSV na paczkę JSON do wysyłki.
 *
 * Arkusz jest wygodny do czytania i poprawiania treści, ale wysyłacz czyta
 * JSON. Bez tego mostu każda poprawka w Excelu wymagałaby ręcznego przepisania
 * maila, a to jest dokładnie ten moment, w którym do wiadomości wkrada się
 * literówka albo nie ta firma.
 *
 *   W Excelu: Plik > Zapisz jako > CSV UTF-8 (tylko zakładka Leady)
 *   node scripts/csv-to-outbox.mjs leady.csv --batch 2026-09-25-hurtownie
 *
 * Wiersze ze statusem innym niż pusty albo "nowy" są pomijane: to znaczy, że
 * do tej osoby już coś wyszło.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Parser CSV zgodny z RFC 4180. Pisany ręcznie, bo treści maili zawierają
 * przecinki, cudzysłowy i przełamania linii wewnątrz pól, a naiwny split(",")
 * rozsypuje się na każdym z nich.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  // BOM, który Excel dopisuje do CSV UTF-8, inaczej trafiłby do nagłówka.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }  // "" to jeden cudzysłów
        else inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\r") { /* CRLF: \n domknie wiersz */ }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function parseArgs(argv) {
  const args = { file: null, batch: null, sequence: "demo", step: 1, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--batch") args.batch = argv[++i];
    else if (a === "--sequence") args.sequence = argv[++i];
    else if (a === "--step") args.step = Number.parseInt(argv[++i], 10);
    else if (a === "--out") args.out = argv[++i];
    else if (!args.file) args.file = a;
    else throw new Error(`Nieznany argument: ${a}`);
  }
  if (!args.file) throw new Error("Podaj plik CSV: node scripts/csv-to-outbox.mjs leady.csv --batch nazwa");
  return args;
}

const HEADERS = {
  to: ["e-mail", "email", "adres"],
  firma: ["firma"],
  osoba: ["osoba"],
  temat: ["temat maila", "temat"],
  tresc: ["treść maila", "tresc maila", "treść", "tresc"],
  notatka: ["dlaczego ten lead", "sygnał", "sygnal", "notatka"],
  status: ["status"],
  paczka: ["paczka", "batch"],
};

function mapColumns(header) {
  const normalised = header.map((h) => h.trim().toLowerCase());
  const index = {};
  for (const [key, names] of Object.entries(HEADERS)) {
    const at = normalised.findIndex((h) => names.includes(h));
    if (at !== -1) index[key] = at;
  }
  for (const required of ["to", "temat", "tresc"]) {
    if (index[required] === undefined) {
      throw new Error(
        `W CSV brakuje kolumny "${HEADERS[required][0]}". Znalezione nagłówki: ${header.join(", ")}`
      );
    }
  }
  return index;
}

const args = parseArgs(process.argv.slice(2));
const rows = parseCsv(await readFile(args.file, "utf8")).filter((r) => r.some((c) => c.trim()));
if (rows.length < 2) throw new Error("CSV nie ma wierszy z danymi.");

const index = mapColumns(rows[0]);
const get = (row, key) => (index[key] === undefined ? "" : (row[index[key]] ?? "").trim());

const messages = [];
const skipped = [];
for (const row of rows.slice(1)) {
  const status = get(row, "status").toLowerCase();
  const to = get(row, "to");
  if (!to) continue;
  if (status && status !== "nowy") {
    skipped.push(`${to}: status "${status}"`);
    continue;
  }
  if (args.batch && get(row, "paczka") && get(row, "paczka") !== args.batch) {
    skipped.push(`${to}: inna paczka (${get(row, "paczka")})`);
    continue;
  }
  messages.push({
    to,
    firma: get(row, "firma"),
    osoba: get(row, "osoba"),
    notatka: get(row, "notatka"),
    temat: get(row, "temat"),
    tresc: get(row, "tresc"),
  });
}

if (!messages.length) throw new Error("Żaden wiersz nie kwalifikuje się do wysyłki.");

const batch = args.batch ?? path.basename(args.file).replace(/\.csv$/i, "");
const out = args.out ?? path.join(path.dirname(args.file), `${batch}.json`);
await writeFile(
  out,
  JSON.stringify({ batch, sequence: args.sequence, step: args.step, messages }, null, 2),
  "utf8"
);

console.log(`Zapisano ${out}`);
console.log(`Wiadomości: ${messages.length}`);
if (skipped.length) {
  console.log(`Pominięte: ${skipped.length}`);
  for (const s of skipped) console.log(`  - ${s}`);
}
console.log(`\nSprawdź zanim wyślesz:\n  npm run check -- --outbox ${path.relative(process.cwd(), out)} --show`);
