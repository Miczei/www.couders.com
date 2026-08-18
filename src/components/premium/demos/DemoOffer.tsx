"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Agent 04 — the B2B offer generator. Motion character: precise, constructive.
 *
 * The first version built the document out of grey placeholder bars, which is
 * a designer's shorthand for "text goes here" and means nothing to a buyer.
 * The page now writes actual readable sentences, in the order a person writes
 * them, and the two worries the client raised in the meeting appear verbatim
 * in the offer — which is the entire claim this agent makes.
 *
 * A caption names each phase in plain Polish, because a document assembling
 * itself is only impressive once you know what you are watching.
 */

const FIELDS = [
  { label: "Co klient oglądał", value: "Linia pakująca LP-400 z podajnikiem" },
  { label: "Czego się obawia", value: "Terminu dostawy i serwisu w regionie" },
  { label: "Kto decyduje", value: "Prezes i dyrektor produkcji" },
];

const PHASES = [
  "Handlowiec wpisuje trzy rzeczy w telefonie",
  "Agent czyta notatkę i wyłapuje obawy klienta",
  "Pisze ofertę pod tego klienta, nie z szablonu",
  "Składa PDF w Waszej szacie graficznej",
  "Wysyła na maila — 15 minut po pożegnaniu",
];

/** Lines of the document, in writing order. `worry` marks the two sentences
 *  that answer what the client actually said out loud at the meeting. */
const DOC: { text: string; worry?: boolean; big?: boolean }[] = [
  { text: "Oferta — linia pakująca LP-400", big: true },
  { text: "dla: Zakład Produkcyjny Nowak sp. z o.o." },
  { text: "Konfiguracja z podajnikiem, zgodnie z ustaleniami ze spotkania." },
  { text: "Dostawa i uruchomienie: 8 tygodni od zamówienia.", worry: true },
  { text: "Serwis: technik w Waszym województwie, dojazd do 24 h.", worry: true },
  { text: "Szkolenie operatorów w cenie, dwa dni na miejscu." },
];

export default function DemoOffer() {
  const reduced = useReducedMotion();
  // 0 typing, 1 reading, 2 writing, 3 assembling, 4 sent
  const [stage, setStage] = useState(reduced ? 4 : 0);
  // Lines are counted rather than staggered by delay. A delayed opacity tween
  // leaves the text present-but-invisible if a frame is missed, and an offer
  // nobody can read is the whole point of this demo lost.
  const [lines, setLines] = useState(reduced ? DOC.length : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = [1, 2, 3, 4].map((s) =>
      window.setTimeout(() => setStage(s), s * 1400),
    );
    DOC.forEach((_, i) =>
      timers.push(window.setTimeout(() => setLines(i + 1), 2 * 1400 + i * 150)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const clock = ["15:32", "15:33", "15:36", "15:41", "15:47"][stage];
  const sent = stage >= 4;

  return (
    <div>
      <p className="max-w-[68ch] text-[14.5px] leading-relaxed text-slate-600">
        Handlowiec wychodzi ze spotkania i wpisuje w telefonie trzy rzeczy: co
        klient oglądał, czego się obawiał i kto decyduje.{" "}
        <strong className="font-medium text-slate-900">
          Piętnaście minut później klient ma gotową ofertę w skrzynce
        </strong>{" "}
        — z odpowiedzią dokładnie na te obawy, o których mówił.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
        {/* ---------- what the rep typed ---------- */}
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
              Notatka ze spotkania
            </p>
            <p className="font-mono text-[13px] tabular-nums text-slate-900">{clock}</p>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {FIELDS.map((f) => (
              <li key={f.label}>
                <span className="block text-[12px] text-slate-500">{f.label}</span>
                <span className="mt-1 block overflow-hidden rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-200">
                  <motion.span
                    className="block whitespace-nowrap text-[12.5px] leading-[18px] text-slate-900"
                    initial={false}
                    // Clipped rather than faded: it reads as typing, which is
                    // what actually happened.
                    animate={{ clipPath: stage >= 1 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                    transition={{ duration: 0.7, ease: "linear" }}
                  >
                    {f.value}
                  </motion.span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 border-t border-slate-200 pt-3 text-[12.5px] leading-snug text-sky-700">
            {PHASES[stage]}
          </p>
        </div>

        {/* ---------- the document ---------- */}
        <div className="relative flex min-h-[268px] items-center justify-center rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 p-5 ring-1 ring-slate-200/70">
          <AnimatePresence>
            {!sent && (
              <motion.div
                key="page"
                initial={false}
                exit={
                  reduced
                    ? {}
                    : {
                        y: 110,
                        scale: 0.4,
                        opacity: 0,
                        transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] },
                      }
                }
                className="w-full max-w-[268px] rounded-md bg-white px-4 py-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.45)] ring-1 ring-slate-200"
              >
                <span className="mb-3 block h-1 w-10 rounded-full bg-sky-500" />
                <div className="flex flex-col gap-2">
                  {DOC.slice(0, lines).map((l) => (
                    <motion.p
                      key={l.text}
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={
                        l.big
                          ? "text-[11.5px] font-bold leading-tight text-slate-900"
                          : l.worry
                            ? "rounded-sm bg-sky-50 px-1.5 py-1 text-[9.5px] leading-snug text-sky-900"
                            : "text-[9.5px] leading-snug text-slate-500"
                      }
                    >
                      {l.text}
                    </motion.p>
                  ))}

                  <motion.span
                    className="mt-1.5 flex items-center justify-between rounded-sm bg-slate-900 px-2 py-1.5"
                    initial={false}
                    animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 6 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/55">
                      Razem netto
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-white">
                      412 000 zł
                    </span>
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sent && (
              <motion.div
                key="inbox"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.3 }}
                className="w-full max-w-[290px] rounded-xl bg-white p-4 ring-1 ring-sky-200"
              >
                <span className="flex items-baseline justify-between">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-sky-700">
                    Skrzynka klienta · 15:47
                  </span>
                  <span className="font-mono text-[9.5px] text-slate-400">PDF</span>
                </span>
                <span className="mt-2 block text-[13px] font-medium text-slate-900">
                  Oferta — linia pakująca LP-400
                </span>
                <span className="mt-1 block text-[12px] leading-snug text-slate-500">
                  Klient czyta ją tego samego popołudnia, a nie w przyszły wtorek.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-slate-500">
        Dwa zdania na niebiesko to dokładnie te obawy, o których klient mówił na
        spotkaniu. Nie ma ich w szablonie — agent wyciągnął je z notatki.
      </p>
    </div>
  );
}
