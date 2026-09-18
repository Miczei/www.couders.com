/**
 * Tests for the local drip sender. Run with:
 *   node --test automation/scripts/local.test.mjs
 *
 * The rules covered here are the ones whose failure is silent and expensive:
 * sending the same person twice after a restart, sending to someone who asked
 * to be left alone, letting a half-written message out, or drifting into a
 * fixed interval that looks like a machine.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { nextDelayMs, formatDelay } from "./lib/drip.mjs";
import { loadOutbox } from "./lib/outbox.mjs";
import { loadState, recordSent, alreadySent, sentToday } from "./lib/state.mjs";
import { loadSuppression, isSuppressed } from "./lib/suppression.mjs";
import { footerFor, assertSendable, loadLocalConfig } from "./lib/config-local.mjs";

const cfg = { minMinutes: 10, maxMinutes: 12 };

async function tmp() {
  return mkdtemp(path.join(tmpdir(), "outreach-"));
}

const goodBody =
  "Dzień dobry Michale,\n\nzajrzałem na stronę i zatrzymałem się na formularzu " +
  "zapytania o wycenę. Sprawdziłem też, że reklamujecie się na frazę hale stalowe, " +
  "gdzie kliknięcie kosztuje około 13 zł.\n\n15 minut w przyszłym tygodniu?";

function batch(messages, extra = {}) {
  return JSON.stringify({ batch: "test", messages, ...extra });
}

test("odstęp zawsze mieści się w zadanym zakresie", () => {
  for (let i = 0; i < 2000; i++) {
    const ms = nextDelayMs(cfg);
    assert.ok(ms >= 10 * 60000, `${ms} poniżej 10 minut`);
    assert.ok(ms <= 12 * 60000, `${ms} powyżej 12 minut`);
  }
});

test("odstęp ma rozdzielczość sekundową, nie minutową", () => {
  // Gdyby odstęp był zaokrąglany do pełnych minut, wysyłka lądowałaby zawsze
  // na granicy minuty i losowość niczego by nie dawała. Sprawdzone na
  // ustalonych losowaniach, żeby test nie zależał od szczęścia.
  assert.equal(nextDelayMs(cfg, () => 0.3), 636_000); // 10 min 36 s
  assert.equal(nextDelayMs(cfg, () => 0.77), 692_000); // 11 min 32 s
  assert.notEqual(nextDelayMs(cfg, () => 0.3) % 60_000, 0);
});

test("odstępy nie są stałe", () => {
  const samples = Array.from({ length: 200 }, () => nextDelayMs(cfg));
  // Zakres 10-12 min ma 121 możliwych wartości sekundowych, więc przy 200
  // losowaniach spodziewamy się około 95 różnych. Próg jest nisko, bo to test
  // na "to nie jest stała", a nie na jakość generatora.
  assert.ok(new Set(samples).size > 50, "za mało różnych wartości, wygląda jak stały odstęp");
  const wholeMinutes = samples.filter((ms) => ms % 60_000 === 0).length;
  assert.ok(wholeMinutes < samples.length / 4, "za dużo odstępów równych pełnym minutom");
});

test("skrajne losowania trafiają w krańce zakresu", () => {
  assert.equal(nextDelayMs(cfg, () => 0), 10 * 60000);
  assert.equal(nextDelayMs(cfg, () => 0.999999), 12 * 60000);
});

test("formatDelay czyta się jak zegar", () => {
  assert.equal(formatDelay(10 * 60000 + 5000), "10:05");
  assert.equal(formatDelay(11 * 60000), "11:00");
});

test("poprawna paczka wczytuje się i normalizuje adres", async () => {
  const dir = await tmp();
  const file = path.join(dir, "b.json");
  await writeFile(file, batch([
    { to: "  Prezes@Firma.PL ", firma: "Firma", osoba: "Jan", temat: "temat", tresc: goodBody },
  ]));
  const out = await loadOutbox(file);
  assert.equal(out.messages.length, 1);
  assert.equal(out.messages[0].to, "prezes@firma.pl");
  assert.equal(out.messages[0].domain, "firma.pl");
  await rm(dir, { recursive: true });
});

test("paczka z nieuzupełnionym polem jest odrzucana", async () => {
  const dir = await tmp();
  const file = path.join(dir, "b.json");
  await writeFile(file, batch([
    { to: "a@b.pl", firma: "B", temat: "oferta dla {{firma}}", tresc: goodBody },
  ]));
  await assert.rejects(() => loadOutbox(file), /nieuzupełnione pole/);
  await rm(dir, { recursive: true });
});

test("paczka z polem w nawiasach kwadratowych też jest odrzucana", async () => {
  const dir = await tmp();
  const file = path.join(dir, "b.json");
  await writeFile(file, batch([
    { to: "a@b.pl", firma: "B", temat: "temat", tresc: goodBody + "\n\nPozdrawiam, [Imię]" },
  ]));
  await assert.rejects(() => loadOutbox(file), /nieuzupełnione pole/);
  await rm(dir, { recursive: true });
});

test("ten sam adres dwa razy w paczce to błąd", async () => {
  const dir = await tmp();
  const file = path.join(dir, "b.json");
  await writeFile(file, batch([
    { to: "a@b.pl", firma: "B", temat: "t", tresc: goodBody },
    { to: "A@B.pl", firma: "B", temat: "t2", tresc: goodBody },
  ]));
  await assert.rejects(() => loadOutbox(file), /występuje dwa razy/);
  await rm(dir, { recursive: true });
});

test("zły adres i pusta treść są łapane", async () => {
  const dir = await tmp();
  const file = path.join(dir, "b.json");
  await writeFile(file, batch([{ to: "nie-adres", firma: "B", temat: "t", tresc: goodBody }]));
  await assert.rejects(() => loadOutbox(file), /nie wygląda na poprawny/);
  await writeFile(file, batch([{ to: "a@b.pl", firma: "B", temat: "t", tresc: "krótko" }]));
  await assert.rejects(() => loadOutbox(file), /podejrzanie krótka/);
  await rm(dir, { recursive: true });
});

test("po restarcie wysłane adresy są pomijane", async () => {
  const dir = await tmp();
  const file = path.join(dir, "state.json");

  const first = await loadState(file);
  assert.equal(alreadySent(first, { to: "a@b.pl", batch: "test" }), false);
  await recordSent(first, { to: "a@b.pl", batch: "test", subject: "t", messageId: "1" });

  // Nowy proces, ten sam plik: to jest scenariusz "zamknąłem laptopa".
  const second = await loadState(file);
  assert.equal(alreadySent(second, { to: "a@b.pl", batch: "test" }), true);
  assert.equal(alreadySent(second, { to: "inny@b.pl", batch: "test" }), false);
  // Ta sama osoba w innej paczce to inna wiadomość, więc nie jest blokowana.
  assert.equal(alreadySent(second, { to: "a@b.pl", batch: "wrzesien" }), false);
  await rm(dir, { recursive: true });
});

test("licznik dzienny liczy tylko dzisiejsze wysyłki", async () => {
  const dir = await tmp();
  const file = path.join(dir, "state.json");
  const state = await loadState(file);
  state.sent.set("test::stary@b.pl", { at: "2020-01-01T10:00:00Z" });
  await recordSent(state, { to: "nowy@b.pl", batch: "test", subject: "t", messageId: "1" });
  assert.equal(sentToday(state, "Europe/Warsaw"), 1);
  await rm(dir, { recursive: true });
});

test("lista wypisanych działa po adresie i po domenie", async () => {
  const dir = await tmp();
  const file = path.join(dir, "wypisani.txt");
  await writeFile(file, "# ktoś poprosił\nJan@Firma.pl\nkonkurencja.pl   # cała domena\n\n");
  const sup = await loadSuppression(file);
  assert.ok(isSuppressed(sup, { to: "jan@firma.pl", domain: "firma.pl" }));
  assert.ok(isSuppressed(sup, { to: "ktokolwiek@konkurencja.pl", domain: "konkurencja.pl" }));
  assert.equal(isSuppressed(sup, { to: "inny@firma.pl", domain: "firma.pl" }), null);
  await rm(dir, { recursive: true });
});

test("brak pliku z wypisanymi nie wywraca wysyłki", async () => {
  const sup = await loadSuppression("/nie/ma/takiego/pliku.txt");
  assert.equal(sup.exists, false);
  assert.equal(isSuppressed(sup, { to: "a@b.pl", domain: "b.pl" }), null);
});

test("stopka ma pustą linię, identyfikację i sposób wypisania się", () => {
  const footer = footerFor({ senderBlock: "Couders, Kraków, NIP 000", unsubscribeMailbox: "stop@x.pl" });
  assert.match(footer, /^\n\n--\n/);
  assert.match(footer, /Couders, Kraków/);
  assert.match(footer, /stop@x\.pl/);
});

test("wysyłka z domeny głównej jest blokowana", () => {
  const base = {
    smtpUser: "u", smtpPass: "p", senderBlock: "b", unsubscribeMailbox: "s@x.pl",
    minMinutes: 10, maxMinutes: 12, primaryDomain: "couders.com", allowPrimaryDomain: false,
  };
  assert.throws(() => assertSendable({ ...base, from: "michal@couders.com" }), /domeny głównej/);
  assert.throws(
    () => assertSendable({ ...base, from: "Michał <michal@couders.com>" }),
    /domeny głównej/
  );
  assert.doesNotThrow(() => assertSendable({ ...base, from: "michal@couders-ai.com" }));
  assert.doesNotThrow(() =>
    assertSendable({ ...base, from: "michal@couders.com", allowPrimaryDomain: true })
  );
});

test("odwrócony zakres odstępu jest odrzucany", () => {
  const base = {
    smtpUser: "u", smtpPass: "p", senderBlock: "b", unsubscribeMailbox: "s@x.pl",
    from: "a@inna.pl", primaryDomain: "couders.com", allowPrimaryDomain: false,
  };
  assert.throws(() => assertSendable({ ...base, minMinutes: 12, maxMinutes: 10 }), /mniejsze/);
  assert.throws(() => assertSendable({ ...base, minMinutes: 0, maxMinutes: 10 }), /większe od zera/);
});

test("domyślna konfiguracja to 10-12 minut i limit dzienny", () => {
  const c = loadLocalConfig({});
  assert.equal(c.minMinutes, 10);
  assert.equal(c.maxMinutes, 12);
  assert.equal(c.dailyCap, 20);
  assert.equal(c.weekdaysOnly, true);
});
