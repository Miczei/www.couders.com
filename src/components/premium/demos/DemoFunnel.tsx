"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Agent 03 — the lead qualifier. Motion character: fast and decisive.
 *
 * The first version showed chips landing in two labelled piles and nobody
 * could tell what the agent was actually doing. The fix was not to simplify
 * the motion — it was to show the work. You now watch the three questions get
 * asked and answered, and only then does the lead get thrown left or right.
 * "Kwalifikacja" is an abstraction; a person answering "do 15 tysięcy" is not.
 *
 * Rejected leads leave flat and quick. The one spring on screen belongs to a
 * lead worth calling, because that is the only event worth celebrating.
 */

type Lead = {
  who: string;
  source: string;
  answers: [string, string, string];
  pass: boolean;
  verdict: string;
  at: string;
};

const QUESTIONS = ["Jaki budżet?", "Kiedy chcecie zacząć?", "Kto podejmuje decyzję?"];

const LEADS: Lead[] = [
  {
    who: "Marek W.",
    source: "reklama na Facebooku",
    answers: ["Do 15 tysięcy", "Jeszcze nie wiem", "Sam się rozglądam"],
    pass: false,
    verdict: "Za mały budżet, brak terminu",
    at: "52 s",
  },
  {
    who: "Anna K.",
    source: "reklama w Google",
    answers: ["Około 180 tysięcy", "W tym kwartale", "Ja i prezes"],
    pass: true,
    verdict: "Budżet i termin się zgadzają",
    at: "1 min 07 s",
  },
  {
    who: "Tomasz R.",
    source: "reklama na Facebooku",
    answers: ["Nie odpowiedział", "—", "—"],
    pass: false,
    verdict: "Nie odpisał na trzy wiadomości",
    at: "1 min 44 s",
  },
  {
    who: "Biuro Nowak",
    source: "reklama w Google",
    answers: ["90 tysięcy", "Za dwa tygodnie", "Właściciel"],
    pass: true,
    verdict: "Gotowy do rozmowy, termin bliski",
    at: "2 min 31 s",
  },
];

export default function DemoFunnel() {
  const reduced = useReducedMotion();
  // Each lead runs: ask q1, q2, q3, verdict. Four ticks per lead.
  const [tick, setTick] = useState(reduced ? LEADS.length * 4 : 0);

  useEffect(() => {
    if (reduced) return;
    const total = LEADS.length * 4;
    const timers = Array.from({ length: total }, (_, i) =>
      window.setTimeout(() => setTick(i + 1), 500 + i * 620),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const idx = Math.min(LEADS.length - 1, Math.floor(tick / 4));
  const within = tick - idx * 4; // 0..4 — how far through the current lead
  const lead = LEADS[idx];
  const settled = LEADS.slice(0, Math.floor(tick / 4));
  const kept = settled.filter((l) => l.pass);
  const dropped = settled.filter((l) => !l.pass);
  const done = tick >= LEADS.length * 4;

  return (
    <div>
      {/* The one-liner the first version was missing. Without it the panel is
          a diagram of a process the reader has not been told about. */}
      <p className="max-w-[68ch] text-[14.5px] leading-relaxed text-slate-600">
        Ktoś klika Waszą reklamę i zostawia numer. Zwykle oddzwaniacie za kilka
        godzin — <strong className="font-medium text-slate-900">agent odzywa się w minutę</strong> i
        zadaje trzy pytania. Do handlowca trafiają tylko ci, którzy na nie
        odpowiedzą sensownie.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)]">
        {/* ---------- the questions, actually asked ---------- */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
              Rozmowa z leadem
            </p>
            <p className="font-mono text-[10px] tabular-nums text-sky-700">
              {done ? "koniec" : lead.at}
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={idx}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4"
            >
              <p className="text-[13.5px] font-medium text-slate-900">{lead.who}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">z {lead.source}</p>

              <ul className="mt-4 flex min-h-[168px] flex-col gap-3">
                {QUESTIONS.map((q, i) => {
                  const asked = within > i;
                  return (
                    <motion.li
                      key={q}
                      initial={false}
                      animate={{ opacity: asked ? 1 : 0.3 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[46px]"
                    >
                      <span className="block text-[13px] text-slate-500">{q}</span>
                      {/* Rendered only once asked, rather than sitting there
                          at opacity 0 — a delayed fade can leave the answer
                          permanently invisible if the frame loop stalls, and
                          an answer nobody sees is the whole demo lost. */}
                      {asked && (
                        <motion.span
                          className="mt-1 block text-[13.5px] font-medium text-slate-900"
                          initial={reduced ? false : { opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {lead.answers[i]}
                        </motion.span>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <motion.p
                initial={false}
                animate={{ opacity: within >= 4 ? 1 : 0, y: within >= 4 ? 0 : 6 }}
                transition={{ duration: 0.3 }}
                className="mt-3 rounded-lg px-3 py-2 text-[12.5px] font-medium"
                style={{
                  background: lead.pass ? "rgba(14,165,233,0.10)" : "rgba(100,116,139,0.08)",
                  color: lead.pass ? "#0369a1" : "#64748b",
                }}
              >
                {lead.pass ? "→ Warto zadzwonić: " : "→ Odsiany: "}
                {lead.verdict}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---------- the two piles ---------- */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-sky-50/70 p-4 ring-1 ring-sky-200/60">
            <p className="flex items-baseline justify-between text-[12.5px] font-medium text-sky-800">
              Warci telefonu
              <span className="font-mono text-[17px] tabular-nums">
                {String(kept.length).padStart(2, "0")}
              </span>
            </p>
            <ul className="mt-2.5 flex min-h-[52px] flex-col gap-1.5">
              {kept.map((l) => (
                <motion.li
                  key={l.who}
                  initial={reduced ? false : { opacity: 0, x: 26, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 460, damping: 24 }}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 ring-1 ring-sky-200/70"
                >
                  {l.who}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
            <p className="flex items-baseline justify-between text-[12.5px] font-medium text-slate-500">
              Nie teraz
              <span className="font-mono text-[17px] tabular-nums">
                {String(dropped.length).padStart(2, "0")}
              </span>
            </p>
            <ul className="mt-2.5 flex min-h-[52px] flex-col gap-1.5">
              {dropped.map((l) => (
                <motion.li
                  key={l.who}
                  initial={reduced ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] text-slate-500 ring-1 ring-slate-200"
                >
                  {l.who}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-slate-500">
        Cztery zgłoszenia z reklamy, dwa warte rozmowy. Handlowiec dzwoni tylko
        do tych dwóch i zna już ich budżet oraz termin.
      </p>
    </div>
  );
}
