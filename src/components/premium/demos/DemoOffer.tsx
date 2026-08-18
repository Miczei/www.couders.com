"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Agent 04 — the B2B offer generator. Motion character: precise, constructive.
 *
 * A document builds itself, block by block, in the order a person would write
 * it: letterhead, addressee, the two objections raised in the meeting, the
 * price table, the signature. Then it leaves. Nothing bounces — this agent's
 * pitch is competence under time pressure, so the motion is exact and the
 * clock does the drama.
 */

const FIELDS = [
  { label: "Co oglądał", value: "Linia pakująca LP-400, wariant z podajnikiem" },
  { label: "Czego się obawia", value: "Termin dostawy i serwis w regionie" },
  { label: "Kto decyduje", value: "Prezes + dyrektor produkcji" },
];

const BLOCKS = [
  { w: "38%", h: 10, label: "letterhead" },
  { w: "62%", h: 7, label: "addressee" },
  { w: "100%", h: 5, label: "line" },
  { w: "94%", h: 5, label: "line" },
  { w: "88%", h: 5, label: "objection-1" },
  { w: "100%", h: 5, label: "line" },
  { w: "72%", h: 5, label: "objection-2" },
];

export default function DemoOffer() {
  const reduced = useReducedMotion();
  // 0..2 fields, 3 → assembling, 4 → sending, 5 → sent
  const [stage, setStage] = useState(reduced ? 5 : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = [0, 1, 2, 3, 4, 5].map((s) =>
      window.setTimeout(() => setStage(s), 350 + s * 900),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const clock = ["15:32", "15:32", "15:33", "15:36", "15:41", "15:47"][Math.min(stage, 5)];
  const blocksIn = stage >= 3 ? BLOCKS.length : 0;
  const sent = stage >= 5;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
          Środa · handlowiec wychodzi ze spotkania
        </p>
        <p className="font-mono text-[15px] tabular-nums text-slate-900">{clock}</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
        {/* ---------- what the rep typed ---------- */}
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 sm:p-5">
          <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
            Formularz w telefonie · trzy pola
          </p>
          <ul className="flex flex-col gap-3">
            {FIELDS.map((f, i) => {
              const filled = stage > i;
              return (
                <li key={f.label}>
                  <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-400">
                    {f.label}
                  </span>
                  <span className="mt-1 block h-[30px] overflow-hidden rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-slate-200">
                    <motion.span
                      className="block whitespace-nowrap text-[12.5px] leading-[18px] text-slate-800"
                      initial={false}
                      // Clipped width rather than a fade: it reads as typing,
                      // which is what actually happened.
                      animate={{ clipPath: filled ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                      transition={{ duration: 0.55, ease: "linear" }}
                    >
                      {f.value}
                    </motion.span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- the document ---------- */}
        <div className="relative flex min-h-[236px] items-center justify-center rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 p-5 ring-1 ring-slate-200/70">
          <AnimatePresence>
            {!sent && (
              <motion.div
                key="page"
                initial={false}
                exit={
                  reduced
                    ? {}
                    : { y: 90, scale: 0.42, opacity: 0, transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] } }
                }
                className="w-full max-w-[210px] rounded-md bg-white p-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.45)] ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-2.5">
                  {BLOCKS.map((b, i) => (
                    <motion.span
                      key={i}
                      className="block rounded-sm"
                      style={{
                        height: b.h,
                        background:
                          i === 0
                            ? "#0EA5E9"
                            : b.label.startsWith("objection")
                              ? "#7dd3fc"
                              : "#e2e8f0",
                      }}
                      initial={false}
                      animate={{ width: i < blocksIn ? b.w : "0%" }}
                      transition={{ duration: 0.3, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ))}

                  <motion.span
                    className="mt-2 flex items-center justify-between rounded-sm bg-slate-900 px-2 py-1.5"
                    initial={false}
                    animate={{ opacity: stage >= 4 ? 1 : 0, y: stage >= 4 ? 0 : 6 }}
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
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.25 }}
                className="w-full max-w-[280px] rounded-xl bg-white p-3.5 ring-1 ring-sky-200"
              >
                <span className="flex items-baseline justify-between">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-sky-700">
                    Wysłano 15:47
                  </span>
                  <span className="font-mono text-[9.5px] text-slate-400">PDF · 1,2 MB</span>
                </span>
                <span className="mt-2 block text-[13px] font-medium text-slate-900">
                  Oferta — linia pakująca LP-400
                </span>
                <span className="mt-1 block text-[12px] text-slate-500">
                  do: zarzad@klient.pl · 15 minut po pożegnaniu
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
            {stage < 3
              ? "czeka na dane"
              : stage < 4
                ? "redaguje pod tego klienta"
                : sent
                  ? "dostarczone"
                  : "składa PDF"}
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-slate-500">
        Dwie obawy z rozmowy — termin i serwis — trafiają wprost do treści oferty.
        Klient czyta odpowiedź na swoje wątpliwości, a nie szablon.
      </p>
    </div>
  );
}
