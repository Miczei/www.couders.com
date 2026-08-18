"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GlassStage from "./GlassStage";

/**
 * The three positions from the offer, as a roster you hire from.
 *
 * The offer already has the right metaphor — "zatrudnij pracownika, który nie
 * śpi" — and a structure most pricing tables throw away: each tier contains
 * the one below it. Showing inherited capabilities greyed out under the new
 * ones makes the upgrade legible in a way three parallel bullet lists never
 * do; the buyer sees they are adding, not switching.
 *
 * Everything the roster claims is written communication. The offer is explicit
 * that Couders does not build voice or phone bots, so no channel here is a
 * phone call.
 *
 * Needs GlassStage.tsx. Nothing else.
 */

type Role = {
  no: string;
  name: string;
  promise: string;
  rollout: string;
  badge?: string;
  /** Only what this tier adds. Lower tiers are inherited automatically. */
  adds: string[];
  /** What it actually did last night, in outcomes rather than metrics. */
  shift: { at: string; via: string; did: string; human?: boolean }[];
};

const ROLES: Role[] = [
  {
    no: "01",
    name: "Wirtualna Recepcja",
    promise: "Koniec z klientami utraconymi po godzinach",
    rollout: "Wdrożenie od 7 dni",
    adds: [
      "Odpowiada natychmiast — całą dobę, też w święta",
      "Zbiera kontakt, zanim ktoś zdąży się rozmyślić",
      "Gorący lead trafia na Twojego maila od razu",
      "Rano czeka uporządkowana lista rozmów",
      "Wie, kiedy odpuścić i oddać sprawę człowiekowi",
      "Zna Waszą ofertę, cennik i typowe pytania",
    ],
    shift: [
      { at: "23:41", via: "WhatsApp", did: "Odpowiedział na pytanie o gwarancję" },
      { at: "00:12", via: "Formularz", did: "Zapisał kontakt, wysłał Ci powiadomienie" },
      { at: "02:10", via: "E-mail", did: "Uznał sprawę za trudną i oddał ją człowiekowi", human: true },
      { at: "08:00", via: "Podsumowanie", did: "Położył na biurku listę dziewięciu rozmów" },
    ],
  },
  {
    no: "02",
    name: "Inteligentny Handlowiec",
    promise: "Zespół sprzedaje, zamiast klepać dane",
    rollout: "Wdrożenie od 14 dni",
    badge: "Najczęściej wybierany",
    adds: [
      "Sam umawia spotkania — sprawdza kalendarz i rezerwuje",
      "Każdy lead ląduje w CRM z kompletem informacji",
      "Rozmawia po polsku, angielsku, niemiecku i dziesiątkach innych",
      "Zna Wasze katalogi i regulaminy — cytuje je klientom",
      "Kwalifikuje: odsiewa ciekawskich, poważnych kieruje do Was",
    ],
    shift: [
      { at: "23:41", via: "WhatsApp", did: "Odpowiedział na pytanie o gwarancję" },
      { at: "01:30", via: "Kalendarz", did: "Umówił pomiar na czwartek, 10:00" },
      { at: "01:31", via: "CRM", did: "Założył lead z transkryptem i wyceną" },
      { at: "03:04", via: "E-mail", did: "Odpowiedział po niemiecku, zacytował katalog" },
      { at: "08:00", via: "Podsumowanie", did: "Dwa spotkania w kalendarzu, zero wpisywania ręcznie" },
    ],
  },
  {
    no: "03",
    name: "Autonomiczny Agent",
    promise: "Firma rośnie. Liczba etatów — nie",
    rollout: "Wycena po analizie procesów",
    adds: [
      "Segreguje i odpowiada na firmową skrzynkę przed Waszą kawą",
      "Prowadzi sprawy od zgłoszenia do zamknięcia",
      "Spina Wasze narzędzia — dane same płyną tam, gdzie trzeba",
      "Dziesięć spraw czy tysiąc — koszt zostaje przewidywalny",
      "Raportuje, co zrobił, bez zaglądania mu przez ramię",
    ],
    shift: [
      { at: "05:00", via: "Skrzynka", did: "Przejrzał 41 maili, odpisał na 28" },
      { at: "05:40", via: "Proces", did: "Przyjął zgłoszenie serwisowe i wszczął sprawę" },
      { at: "06:15", via: "Proces", did: "Domknął reklamację — zwrot zgłoszony w systemie" },
      { at: "07:02", via: "Integracje", did: "Zsynchronizował trzy narzędzia bez Waszego udziału" },
      { at: "08:00", via: "Raport", did: "Wysłał raport z nocy: co zrobił i czego nie ruszył" },
    ],
  },
];

export default function AgentRoster() {
  const reduced = useReducedMotion();
  const [pick, setPick] = useState(1);

  const role = ROLES[pick];
  // Everything the tiers below this one already do. Shown, but quiet: the
  // point is that you are adding to a job, not swapping one for another.
  const inherited = ROLES.slice(0, pick).flatMap((r) => r.adds);

  return (
    <section
      className="relative bg-white py-24 text-[#0b0b0c] md:py-32"
      aria-label="Trzy stanowiska do obsadzenia"
    >
      <div className="mx-auto max-w-[1000px] px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Trzy stanowiska
        </p>
        <h2
          className="mt-4 max-w-[21ch] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Wybierzcie, kogo zatrudniacie. Zobaczcie jego zmianę.
        </h2>
        <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-slate-500">
          Każde kolejne stanowisko robi wszystko to, co poprzednie — i coś
          jeszcze. Nie wymieniacie pracownika, tylko poszerzacie mu zakres.
        </p>

        {/* ---------- pick a role ---------- */}
        <div
          role="tablist"
          aria-label="Stanowiska"
          className="mt-10 grid gap-2 sm:grid-cols-3"
        >
          {ROLES.map((r, i) => {
            const on = i === pick;
            return (
              <button
                key={r.no}
                role="tab"
                aria-selected={on}
                onClick={() => setPick(i)}
                className={`relative rounded-xl border p-4 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none ${
                  on
                    ? "border-[#0b0b0c] bg-[#0b0b0c] text-white"
                    : "border-black/10 bg-white text-[#0b0b0c] hover:border-black/25"
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    on ? "text-white/45" : "text-slate-400"
                  }`}
                >
                  Nr {r.no}
                </span>
                <span className="mt-1.5 block text-[15px] font-semibold tracking-[-0.015em]">
                  {r.name}
                </span>
                <span
                  className={`mt-1 block text-[12.5px] leading-snug ${
                    on ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  {r.promise}
                </span>
                {r.badge && (
                  <span
                    className={`mt-2.5 inline-block rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      on ? "bg-[#22E0C8] text-[#0b0b0c]" : "bg-[#22E0C8]/15 text-[#0a8e7e]"
                    }`}
                  >
                    {r.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- the role's file ---------- */}
      <div className="mx-auto mt-8 max-w-[1000px] px-6">
        <GlassStage
          label={`${role.name} · zakres obowiązków`}
          status={
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500">
              {role.rollout}
            </span>
          }
        >
          <div className="grid gap-px bg-black/[0.06] md:grid-cols-2">
            {/* what it adds */}
            <div className="bg-white p-5 sm:p-7">
              <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
                {pick === 0 ? "Co robi" : "Co dochodzi na tym stanowisku"}
              </p>

              <ul key={pick} className="flex flex-col gap-2.5">
                {role.adds.map((a, i) => (
                  <motion.li
                    key={a}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] block h-1.5 w-1.5 rounded-full bg-[#22E0C8]"
                    />
                    <span className="text-[14px] leading-snug">{a}</span>
                  </motion.li>
                ))}
              </ul>

              {inherited.length > 0 && (
                <div className="mt-6 border-t border-black/[0.07] pt-5">
                  <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
                    Plus wszystko z niższych stanowisk
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {inherited.map((a) => (
                      <li
                        key={a}
                        className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-3 text-[13px] leading-snug text-slate-400"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[6px] block h-1 w-1 rounded-full bg-slate-300"
                        />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* what it did */}
            <div className="bg-[#FBFBFB] p-5 sm:p-7">
              <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
                Jego ostatnia zmiana
              </p>

              <ul key={pick} className="flex flex-col gap-2">
                {role.shift.map((e, i) => (
                  <motion.li
                    key={e.at + e.did}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ delay: i * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-lg bg-white px-3.5 py-3 ring-1 ring-black/[0.06]"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] tabular-nums text-slate-500">
                        {e.at}
                      </span>
                      <span
                        className="font-mono text-[9.5px] uppercase tracking-[0.14em]"
                        style={{ color: e.human ? "#A15C00" : "#0a8e7e" }}
                      >
                        {e.via}
                      </span>
                    </div>
                    <p className="mt-1 text-[13.5px] leading-snug">{e.did}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </GlassStage>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[46ch] text-[14px] leading-relaxed text-slate-500">
            Przykładowa zmiana. Na wdrożeniu wypełniamy ją Waszymi rozmowami.
          </p>
          <a
            href="#kontakt"
            className="rounded-full bg-[#0b0b0c] px-6 py-3 text-[14px] font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none"
          >
            Bezpłatne demo, 30 minut
          </a>
        </div>
      </div>
    </section>
  );
}
