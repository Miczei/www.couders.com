"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Sector, SectorsContent } from "@/i18n/sectors";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ACCENT = "#C06C4C";
const SILVER = "#C7CCD6";

/* Continuous single-stroke hero paths per sector (viewBox 0 0 320 130). */
const VISUALS: Record<Sector["id"], string> = {
  // Heart-rate line that curls into a neural node.
  healthcare:
    "M 8 78 L 74 78 L 84 60 L 96 96 L 108 46 L 120 84 L 128 78 L 176 78 " +
    "C 208 78 216 56 236 52 C 262 47 276 66 268 84 C 260 101 234 98 230 80 " +
    "C 227 66 240 55 254 58",
  // Abstract scales of justice: left pan, beam, right pan, stem retrace.
  legal:
    "M 44 84 A 26 26 0 0 0 96 84 L 70 46 L 160 30 L 250 46 L 224 84 " +
    "A 26 26 0 0 0 276 84 L 250 46 L 160 30 L 160 108 L 128 112 L 192 112",
  // Two interlocking parametric gears.
  industrial:
    "M 96 34 L 110 42 L 126 36 L 132 52 L 148 58 L 142 74 L 150 88 L 136 96 " +
    "L 130 112 L 114 106 L 100 114 L 92 100 L 76 96 L 80 80 L 72 66 L 86 58 Z " +
    "M 150 88 L 168 84 L 178 72 L 192 78 L 206 70 L 212 82 L 228 84 L 226 98 " +
    "L 236 108 L 224 116 L 220 126 L 206 122 L 194 128 L 188 116 L 174 112 L 176 98 Z",
};

function SectorVisual({ sector, aria }: { sector: Sector["id"]; aria: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 320 130" fill="none" role="img" aria-label={aria} className="w-full max-w-md">
      <defs>
        <filter id="sector-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {/* Breathing terracotta glow */}
      <motion.path
        d={VISUALS[sector]}
        stroke={ACCENT}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sector-glow)"
        animate={reduced ? undefined : { opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        opacity={0.3}
      />
      {/* Continuous line drawing itself on every sector switch */}
      <motion.path
        d={VISUALS[sector]}
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
    </svg>
  );
}

export default function SectorHub({ content }: { content: SectorsContent }) {
  const [active, setActive] = useState<Sector["id"]>("healthcare");
  const sector = content.sectors.find((s) => s.id === active) ?? content.sectors[0];

  return (
    <section className="relative z-10 bg-black px-5 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-6xl">
        {/* Animated pill sub-navigation */}
        <div
          role="tablist"
          aria-label={content.eyebrow}
          className="inline-flex flex-wrap gap-1 rounded-full border border-white/[0.1] bg-[#0A0A0B] p-1"
        >
          {content.sectors.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className="relative rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.22em]"
              style={{ color: active === s.id ? SILVER : "#52525B" }}
            >
              {active === s.id && (
                <motion.span
                  layoutId="sector-pill"
                  className="absolute inset-0 rounded-full border border-white/[0.18] bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Cross-fading sector views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-10 sm:mt-14"
          >
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-6">
              {/* Sector hero tile with the continuous-line visual */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.12] bg-[#0A0A0B] p-6 sm:p-8 md:col-span-6 md:flex-row md:items-center md:gap-12 md:p-10">
                <div className="max-w-md">
                  <h2
                    className="text-2xl font-semibold tracking-[-0.02em] text-[#F5F5F7] sm:text-3xl"
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {sector.h2}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                    {sector.lead}
                  </p>
                </div>
                <div className="mt-8 md:mt-0 md:w-2/5">
                  <SectorVisual sector={sector.id} aria={sector.visualAria} />
                </div>
              </div>

              {sector.tiles.map((t) => (
                <div
                  key={t.title}
                  className={`rounded-2xl border border-white/[0.08] bg-[#0A0A0B] p-6 transition-colors duration-500 hover:border-white/[0.22] sm:p-8 ${t.span}`}
                >
                  <h3
                    className="text-lg font-semibold tracking-[-0.01em] text-[#F5F5F7] sm:text-xl"
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
