"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GlassStage from "./GlassStage";

/**
 * Mission control: the assistant's shift, rendered as the console an operator
 * would actually watch.
 *
 * Enterprise buyers are not moved by adjectives, they are moved by evidence
 * that something is running. A panel with a live event log, a response-time
 * trace and channel health does that in a way no headline can — it looks like
 * the inside of the product rather than an ad for it.
 *
 * Everything here is a scripted replay, not real telemetry, and the caption
 * says so. Faking a live feed on a marketing page is a lie a buyer will
 * eventually check.
 *
 * Needs GlassStage.tsx. Nothing else.
 */

type Event = {
  time: string;
  channel: "WhatsApp" | "Telefon" | "E-mail" | "Formularz";
  text: string;
  ms: number;
  human?: boolean;
};

const FEED: Event[] = [
  { time: "23:38:12", channel: "Formularz", text: "Wycena — 54 m², Wilanów", ms: 820 },
  { time: "23:41:07", channel: "WhatsApp", text: "Pytanie o gwarancję", ms: 640 },
  { time: "23:52:44", channel: "Telefon", text: "Nieodebrane → oddzwonienie zaplanowane", ms: 1120 },
  { time: "00:14:03", channel: "E-mail", text: "Zapytanie ofertowe, 3 lokale", ms: 2400, human: true },
  { time: "00:31:29", channel: "WhatsApp", text: "Zmiana terminu pomiaru", ms: 710 },
  { time: "01:02:55", channel: "Formularz", text: "Prośba o katalog materiałów", ms: 590 },
  { time: "01:32:18", channel: "E-mail", text: "Reklamacja — eskalacja", ms: 3100, human: true },
  { time: "02:10:41", channel: "WhatsApp", text: "Wykończenie 78 m² pod klucz", ms: 680 },
  { time: "03:04:16", channel: "Formularz", text: "Pytanie o terminy realizacji", ms: 760 },
  { time: "04:22:38", channel: "Telefon", text: "Nieodebrane → SMS z ofertą", ms: 940 },
];

const CHANNELS = ["WhatsApp", "Telefon", "E-mail", "Formularz"] as const;

/** Visible rows in the log. Older ones slide out of the top. */
const WINDOW = 5;
const STEP = 1.15;

export default function OpsDeck() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [i, setI] = useState(reduced ? FEED.length - 1 : -1);
  const [running, setRunning] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    tl.current?.kill();
    setRunning(true);
    setI(-1);
    const t = gsap.timeline({ onComplete: () => setRunning(false) });
    FEED.forEach((_, k) => {
      t.call(() => setI(k), undefined, `+=${k === 0 ? 0.5 : STEP}`);
    });
    t.to({}, { duration: 0.6 });
    tl.current = t;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 68%",
        once: true,
        onEnter: play,
      });
      return () => st.kill();
    }, el);
    return () => {
      ctx.revert();
      tl.current?.kill();
      tl.current = null;
    };
  }, [reduced, play]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) tl.current?.pause();
      else tl.current?.resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const seen = FEED.slice(0, i + 1);
  const rows = seen.slice(-WINDOW).reverse();
  const handled = seen.filter((e) => !e.human).length;
  const escalated = seen.filter((e) => e.human).length;
  const avg = seen.length
    ? Math.round(seen.reduce((s, e) => s + e.ms, 0) / seen.length)
    : 0;

  // Sparkline over response times so far, newest on the right.
  const trace = seen.slice(-18);
  const max = Math.max(1200, ...trace.map((e) => e.ms));
  const path = trace
    .map((e, k) => {
      const x = trace.length === 1 ? 100 : (k / (trace.length - 1)) * 100;
      const y = 30 - (e.ms / max) * 26;
      return `${k === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <section
      ref={root}
      className="relative bg-white py-24 text-[#0b0b0c] md:py-32"
      aria-label="Pulpit pracy asystenta"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Pulpit · noc z wtorku na środę
        </p>
        <h2
          className="mt-4 max-w-[20ch] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Tak wygląda zmiana, której nikt nie musiał brać.
        </h2>
      </div>

      <div className="mt-12 px-6">
        <GlassStage dark>
          <div className="relative bg-[#07090D] text-[#E9EDF4]">
            <div
              className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}
            >
              <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/45">
                Odtworzenie dyżuru · 23:38 → 04:22
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <motion.span
                  className="block h-1.5 w-1.5 rounded-full bg-[#22E0C8]"
                  animate={reduced || !running ? {} : { opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#22E0C8]">
                  {running ? "w trakcie" : "koniec zmiany"}
                </span>
              </span>
            </div>

            <div className="grid gap-px bg-white/[0.08] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              {/* ---------- event log ---------- */}
              <div className="bg-[#07090D] p-5 sm:p-7">
                <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40">
                  Strumień zdarzeń
                </p>

                <ul className="flex min-h-[260px] flex-col gap-1.5">
                  <AnimatePresence initial={false} mode="popLayout">
                    {rows.length === 0 && (
                      <motion.li
                        key="idle"
                        exit={{ opacity: 0 }}
                        className="py-8 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white/30"
                      >
                        Cisza. Biuro zamknięte.
                      </motion.li>
                    )}
                    {rows.map((e) => (
                      <motion.li
                        key={e.time}
                        layout
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 460, damping: 34 }}
                        className="grid grid-cols-[68px_minmax(0,1fr)_auto] items-baseline gap-3 rounded-lg px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-white/45">
                          {e.time}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13.5px] leading-snug">
                            {e.text}
                          </span>
                          <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35">
                            {e.channel}
                          </span>
                        </span>
                        <span
                          className="font-mono text-[11px] tabular-nums"
                          style={{ color: e.human ? "#F0B45E" : "#22E0C8" }}
                        >
                          {e.human ? "→ człowiek" : `${e.ms} ms`}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* ---------- readouts ---------- */}
              <div className="flex flex-col gap-6 bg-[#07090D] p-5 sm:p-7">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { v: String(handled).padStart(2, "0"), l: "obsłużone", c: "#22E0C8" },
                    { v: String(escalated).padStart(2, "0"), l: "do człowieka", c: "#F0B45E" },
                    { v: avg ? `${avg}` : "—", l: "śr. ms", c: "#E9EDF4" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div
                        className="font-mono text-[clamp(1.5rem,3vw,2.1rem)] font-medium tabular-nums leading-none"
                        style={{ color: s.c }}
                      >
                        {s.v}
                      </div>
                      <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/35">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/35">
                    Czas odpowiedzi
                  </p>
                  <svg
                    viewBox="0 0 100 32"
                    preserveAspectRatio="none"
                    className="h-16 w-full"
                    aria-hidden="true"
                  >
                    <line
                      x1="0"
                      y1="30"
                      x2="100"
                      y2="30"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.4"
                    />
                    {path && (
                      <path
                        d={path}
                        fill="none"
                        stroke="#22E0C8"
                        strokeWidth="1"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                    {trace.length > 0 && (
                      <circle
                        cx="100"
                        cy={30 - (trace[trace.length - 1].ms / max) * 26}
                        r="1.6"
                        fill="#22E0C8"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </svg>
                </div>

                <div>
                  <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/35">
                    Kanały
                  </p>
                  <ul className="flex flex-col gap-2">
                    {CHANNELS.map((c) => {
                      const hot = seen.length > 0 && seen[seen.length - 1].channel === c;
                      return (
                        <li key={c} className="flex items-center gap-2.5">
                          <span
                            className="block h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 motion-reduce:transition-none"
                            style={{
                              background: hot ? "#22E0C8" : "rgba(34,224,200,0.35)",
                              boxShadow: hot ? "0 0 10px rgba(34,224,200,0.9)" : "none",
                            }}
                          />
                          <span className="text-[13px] text-white/75">{c}</span>
                          <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">
                            {seen.filter((e) => e.channel === c).length || "—"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </GlassStage>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap items-end justify-between gap-6 px-6">
        <p className="max-w-[58ch] text-[15px] leading-relaxed text-slate-500">
          Odtworzenie jednej nocy, nie podgląd na żywo — dane są przykładowe.
          Na wdrożeniu ten sam pulpit pokazuje Wasz własny ruch.
        </p>

        {!reduced && (
          <button
            type="button"
            onClick={play}
            aria-hidden={running}
            tabIndex={running ? -1 : 0}
            className={`group flex shrink-0 items-center gap-2.5 rounded-full border border-black/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 transition-all duration-500 hover:border-black/25 hover:text-[#0b0b0c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none ${
              running ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97" strokeLinecap="round" />
              <path d="M13.2 1.6v3.1h-3.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Odtwórz dyżur
          </button>
        )}
      </div>
    </section>
  );
}
