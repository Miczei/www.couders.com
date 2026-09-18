/**
 * Tests for the decision logic. Run with:  node --test automation/scripts/
 *
 * These cover the rules whose failure would be expensive and silent: mailing
 * someone who unsubscribed, mailing twice in one day, firing a follow-up
 * early, or sending a demo message with no demo behind it.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { decide, applyRunLimits, isWithinSendWindow, daysBetween } from "./lib/guards.mjs";
import { loadTemplates, render } from "./lib/render.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "templates");

const cfg = {
  stepDelays: [0, 3, 7],
  dailyCap: 2,
  windowStart: 8,
  windowEnd: 17,
  weekdaysOnly: true,
  timezone: "Europe/Warsaw",
};

const empty = { emails: new Set(), domains: new Set() };

const baseRow = {
  rowId: "1",
  email: "a@firma.pl",
  domain: "firma.pl",
  firstName: "Anna",
  company: "Firma",
  demoUrl: "https://couders.com/demo/?id=abc",
  demoExpiry: "25.09",
  detail: "hal stalowych",
  keyword: "hale stalowe",
  cpc: "13",
  status: "nowy",
  sequence: "demo",
  firstSentAt: "",
  lastSentAt: "",
  step: 0,
};

const now = new Date("2026-09-18T09:00:00Z"); // Friday

test("pierwsza wiadomość wychodzi od razu", () => {
  assert.deepEqual(decide(baseRow, cfg, empty, now), { step: 1 });
});

test("sekwencja demo bez demoUrl jest blokowana", () => {
  const r = decide({ ...baseRow, demoUrl: "" }, cfg, empty, now);
  assert.match(r.skip, /demoUrl/);
});

test("adres z listy wypisanych nigdy nie dostaje wiadomości", () => {
  const sup = { emails: new Set(["a@firma.pl"]), domains: new Set() };
  assert.match(decide(baseRow, cfg, sup, now).skip, /wypisanych/);
});

test("cała domena może być zablokowana", () => {
  const sup = { emails: new Set(), domains: new Set(["firma.pl"]) };
  assert.match(decide(baseRow, cfg, sup, now).skip, /firma\.pl/);
});

test("odpowiedź od klienta zatrzymuje automat", () => {
  for (const status of ["odpowiedz", "spotkanie", "klient", "odpadl", "wypisany"]) {
    const r = decide({ ...baseRow, status, step: 1, firstSentAt: "2026-09-01" }, cfg, empty, now);
    assert.ok(r.skip, `status ${status} powinien zatrzymać sekwencję`);
  }
});

test("follow-up nie wychodzi przed czasem, a po czasie tak", () => {
  const row = { ...baseRow, status: "wyslane", step: 1, firstSentAt: "2026-09-17" };
  assert.match(decide(row, cfg, empty, now).skip, /dopiero za 2 dni/);

  const older = { ...row, firstSentAt: "2026-09-15" };
  assert.deepEqual(decide(older, cfg, empty, now), { step: 2 });
});

test("sekwencja kończy się po ostatnim kroku", () => {
  const row = { ...baseRow, status: "wyslane", step: 3, firstSentAt: "2026-08-01" };
  assert.match(decide(row, cfg, empty, now).skip, /zakończona/);
});

test("brak daty pierwszej wysyłki nie powoduje wysyłki na ślepo", () => {
  const row = { ...baseRow, status: "wyslane", step: 1, firstSentAt: "", lastSentAt: "" };
  assert.match(decide(row, cfg, empty, now).skip, /brak daty/);
});

test("dzienny limit obcina kolejkę", () => {
  const items = ["a", "b", "c", "d"].map((x) => ({
    row: { ...baseRow, rowId: x, email: `${x}@${x}.pl`, domain: `${x}.pl` },
    step: 1,
  }));
  const { picked, skipped } = applyRunLimits(items, cfg);
  assert.equal(picked.length, 2);
  assert.equal(skipped.length, 2);
  assert.match(skipped[0].skip, /limit/);
});

test("dwie osoby z tej samej firmy nie dostają wiadomości tego samego dnia", () => {
  const items = [
    { row: { ...baseRow, rowId: "1", email: "a@firma.pl" }, step: 1 },
    { row: { ...baseRow, rowId: "2", email: "b@firma.pl" }, step: 1 },
  ];
  const { picked, skipped } = applyRunLimits(items, cfg);
  assert.equal(picked.length, 1);
  assert.match(skipped[0].skip, /firma\.pl/);
});

test("okno wysyłki respektuje weekend i godziny", () => {
  // Wszystkie daty sprawdzane w strefie Europe/Warsaw.
  assert.equal(isWithinSendWindow(cfg, new Date("2026-09-18T09:00:00Z")).ok, true); // piątek 11:00
  assert.equal(isWithinSendWindow(cfg, new Date("2026-09-21T09:00:00Z")).ok, true); // poniedziałek 11:00
  assert.equal(isWithinSendWindow(cfg, new Date("2026-09-19T09:00:00Z")).ok, false); // sobota
  assert.equal(isWithinSendWindow(cfg, new Date("2026-09-20T09:00:00Z")).ok, false); // niedziela
  assert.equal(isWithinSendWindow(cfg, new Date("2026-09-18T03:00:00Z")).ok, false); // piątek 5:00, za wcześnie
  assert.equal(isWithinSendWindow(cfg, new Date("2026-09-18T16:00:00Z")).ok, false); // piątek 18:00, za późno
});

test("daysBetween liczy dni kalendarzowe", () => {
  assert.equal(daysBetween("2026-09-15", new Date("2026-09-18T23:00:00Z")), 3);
  assert.equal(daysBetween("nonsens", now), null);
});

test("szablon renderuje się i dostaje stopkę", async () => {
  const templates = await loadTemplates(TEMPLATE_DIR);
  const out = render(templates.get("demo-1"), baseRow, {
    senderBlock: "Couders sp. z o.o., NIP 000",
    unsubscribeMailbox: "stop@example.com",
  });
  assert.match(out.subject, /asystent dla Firma/);
  assert.match(out.text, /Dzień dobry Anna/);
  assert.match(out.text, /couders\.com\/demo/);
  assert.match(out.text, /stop@example\.com/);
  assert.doesNotMatch(out.text, /\{\{/);
});

test("brakujące dane blokują wysyłkę zamiast wysłać pustkę", async () => {
  const templates = await loadTemplates(TEMPLATE_DIR);
  assert.throws(
    () => render(templates.get("demo-2"), { ...baseRow, cpc: "" }, { senderBlock: "x", unsubscribeMailbox: "y" }),
    /cpc/
  );
});

test("każdy szablon ma komplet pól i da się wyrenderować", async () => {
  const templates = await loadTemplates(TEMPLATE_DIR);
  assert.ok(templates.size >= 4);
  for (const [id, tpl] of templates) {
    assert.ok(tpl.subject, `${id} nie ma tematu`);
    const out = render(tpl, baseRow, { senderBlock: "x", unsubscribeMailbox: "stop@e.pl" });
    assert.ok(out.text.length > 50, `${id} renderuje się pusto`);
  }
});
