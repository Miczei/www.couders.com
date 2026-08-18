"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Agent 03 — the lead qualifier. Motion character: fast and decisive.
 *
 * Leads physically travel: they drop out of the ad, pass a gate, and are
 * thrown left or right. Nothing fades politely — the whole point of this agent
 * is that it makes a call, so the motion commits. Rejected leads leave with a
 * short, flat exit; the one that qualifies gets the only spring on screen.
 */

type Lead = {
  name: string;
  budget: string;
  when: string;
  pass: boolean;
  /** Seconds after form submit that the verdict lands. */
  at: string;
};

const LEADS: Lead[] = [
  { name: "Zapytanie #1", budget: "do 15 tys.", when: "„kiedyś”", pass: false, at: "0:52" },
  { name: "Zapytanie #2", budget: "180 tys.", when: "ten kwartał", pass: true, at: "1:07" },
  { name: "Zapytanie #3", budget: "brak odpowiedzi", when: "—", pass: false, at: "1:44" },
  { name: "Zapytanie #4", budget: "do 20 tys.", when: "„rozglądam się”", pass: false, at: "2:03" },
  { name: "Zapytanie #5", budget: "90 tys.", when: "za dwa tygodnie", pass: true, at: "2:31" },
];

export default function DemoFunnel() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? LEADS.length : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = LEADS.map((_, i) =>
      window.setTimeout(() => setN(i + 1), 500 + i * 780),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const judged = LEADS.slice(0, n);
  const kept = judged.filter((l) => l.pass);
  const dropped = judged.filter((l) => !l.pass);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
          Kampania Google Ads · czwartek 14:02
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-700">
          Odzywa się w 60 sekund
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] md:items-start">
        {/* ---------- kept ---------- */}
        <div className="order-2 rounded-2xl bg-sky-50/70 p-4 ring-1 ring-sky-200/60 md:order-1">
          <p className="mb-3 flex items-baseline justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-sky-700">
            Do handlowca
            <span className="font-mono text-[15px] tabular-nums text-sky-700">
              {String(kept.length).padStart(2, "0")}
            </span>
          </p>
          <ul className="flex min-h-[132px] flex-col gap-2">
            {kept.map((l) => (
              <motion.li
                key={l.name}
                initial={reduced ? false : { opacity: 0, x: 26, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                // The only spring in the scene. Qualifying is the event worth
                // celebrating, so it is the only motion that overshoots.
                transition={{ type: "spring", stiffness: 460, damping: 24 }}
                className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-sky-200/70"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium text-slate-900">{l.name}</span>
                  <span className="font-mono text-[10px] tabular-nums text-sky-600">{l.at}</span>
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  {l.budget} · {l.when}
                </span>
              </motion.li>
            ))}
            {kept.length === 0 && (
              <li className="py-6 text-center text-[12.5px] text-slate-400">
                Jeszcze nikt nie przeszedł.
              </li>
            )}
          </ul>
        </div>

        {/* ---------- the gate ---------- */}
        <div className="order-1 flex items-center justify-center md:order-2 md:h-full md:flex-col md:pt-14">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-900">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-sky-400/60"
              animate={reduced ? {} : { scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative font-mono text-[9px] uppercase tracking-[0.1em] text-white">
              60 s
            </span>
          </div>
        </div>

        {/* ---------- dropped ---------- */}
        <div className="order-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
          <p className="mb-3 flex items-baseline justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-400">
            Odsiane
            <span className="font-mono text-[15px] tabular-nums text-slate-400">
              {String(dropped.length).padStart(2, "0")}
            </span>
          </p>
          <ul className="flex min-h-[132px] flex-col gap-2">
            {dropped.map((l) => (
              <motion.li
                key={l.name}
                initial={reduced ? false : { opacity: 0, x: -26 }}
                animate={{ opacity: 0.62, x: 0 }}
                // Flat and quick: a rejected lead is a non-event, and dressing
                // it up would put the emphasis in the wrong place.
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] text-slate-600 line-through decoration-slate-300">
                    {l.name}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-slate-400">{l.at}</span>
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  {l.budget} · {l.when}
                </span>
              </motion.li>
            ))}
            {dropped.length === 0 && (
              <li className="py-6 text-center text-[12.5px] text-slate-400">
                Na razie czysto.
              </li>
            )}
          </ul>
        </div>
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-slate-500">
        Pięć zgłoszeń z reklamy, dwa warte rozmowy. Handlowiec dzwoni tylko do
        tych dwóch — i ma już ich budżet oraz termin.
      </p>
    </div>
  );
}
