"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ShowcaseContent } from "@/i18n/showcase";

/**
 * Agent 02 — the phone receptionist. Motion character: urgent, then calm.
 *
 * Nothing here is a list. The ring is genuinely insistent — expanding rings on
 * a loop, a handset that shakes — and the moment it is answered everything
 * settles: rings stop, a live waveform takes over, the transcript arrives at
 * talking speed. That drop in energy at pickup *is* the argument, because it
 * is exactly what the caller feels.
 */

const BARS = 22;

export default function DemoCall({ c }: { c: ShowcaseContent["call"] }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"ring" | "live" | "done">(reduced ? "done" : "ring");
  const [turn, setTurn] = useState(reduced ? c.turns.length : 0);
  const [secs, setSecs] = useState(reduced ? 128 : 0);

  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        setPhase("live");
        c.turns.forEach((_, i) =>
          timers.push(window.setTimeout(() => setTurn(i + 1), 900 + i * 1050)),
        );
        timers.push(window.setTimeout(() => setPhase("done"), 900 + c.turns.length * 1050));
      }, 1500),
    );
    const tick = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(tick);
    };
  }, [reduced, c]);

  const ringing = phase === "ring";
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
      {/* ---------- the handset ---------- */}
      <div className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
        {/* Rings only exist while it is ringing. Leaving them looping under a
            live call would say "still waiting", which is the opposite. */}
        <AnimatePresence>
          {ringing &&
            !reduced &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute h-24 w-24 rounded-full border border-sky-400/50"
                initial={{ scale: 0.6, opacity: 0.7 }}
                animate={{ scale: 2.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
              />
            ))}
        </AnimatePresence>

        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: ringing ? "#0EA5E9" : "#22E0C8" }}
          animate={
            ringing && !reduced
              ? { rotate: [0, -12, 12, -8, 8, 0] }
              : { rotate: 0, scale: 1 }
          }
          transition={ringing ? { duration: 0.9, repeat: Infinity, repeatDelay: 0.5 } : { type: "spring", stiffness: 400, damping: 22 }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#0b1220" strokeWidth="2">
            <path
              d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <p className="relative mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {ringing ? c.incoming : phase === "live" ? c.live : c.ended}
        </p>
        <p className="relative mt-1.5 font-mono text-[15px] tabular-nums">
          {ringing ? c.number : mmss}
        </p>

        {/* Waveform replaces the rings — same visual budget, opposite mood. */}
        <div className="relative mt-5 flex h-8 items-center gap-[3px]">
          {Array.from({ length: BARS }).map((_, i) => {
            const seed = Math.abs(Math.sin(i * 7.13) * 4531) % 1;
            return (
              <motion.span
                key={i}
                className="block w-[2px] rounded-full bg-[#22E0C8]"
                animate={
                  phase === "live" && !reduced
                    ? { height: [3, 6 + seed * 20, 4, 5 + seed * 14, 3] }
                    : { height: 3, opacity: ringing ? 0.15 : 0.35 }
                }
                transition={
                  phase === "live" && !reduced
                    ? { duration: 0.55 + seed * 0.45, repeat: Infinity, ease: "easeInOut", delay: i * 0.02 }
                    : { duration: 0.3 }
                }
              />
            );
          })}
        </div>
      </div>

      {/* ---------- transcript + outcome ---------- */}
      <div className="flex flex-col gap-4">
        <div className="min-h-[168px] rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 sm:p-5">
          <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
            {c.transcriptTitle}
          </p>
          {turn === 0 ? (
            <p className="py-6 text-center text-[13px] text-slate-400">
              {c.idle}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {c.turns.slice(0, turn).map((t, i) => (
                <motion.li
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-[62px_minmax(0,1fr)] gap-2.5"
                >
                  <span
                    className="font-mono text-[9.5px] uppercase tracking-[0.12em]"
                    style={{ color: i % 2 === 0 ? "#0284c7" : "#94a3b8" }}
                  >
                    {t.who}
                  </span>
                  <span className="text-[13px] leading-snug text-slate-800">{t.text}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <AnimatePresence>
          {(phase === "done" || reduced) && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="flex items-center gap-3 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white font-mono text-[13px] font-medium text-sky-700 ring-1 ring-sky-200">
                9
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-medium text-slate-900">
                  {c.outcomeTitle}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-sky-700">
                  {c.outcomeNote}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
