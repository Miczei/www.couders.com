"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Each compact card and its expanded state share a layoutId, so Framer
 * Motion's shared-layout projection animates the card growing from its own
 * grid slot into a centered overlay — not a shared side panel. The grid
 * itself never changes shape: the source card just goes invisible (opacity 0)
 * while its clone is open, so nothing reflows.
 */
export default function ThreePillars({ content }: { content: CoudersContent["pillars"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? content.items[openIndex] : null;

  return (
    <section id="pillars" className="relative z-10 bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[11px] sm:tracking-[0.32em]">
          {content.eyebrow}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-4 max-w-2xl text-balance text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>

        {/* Frozen 3-col grid — always the same shape, open or closed. */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {content.items.map((item, i) => (
            <motion.button
              key={item.title}
              type="button"
              layoutId={`pillar-card-${i}`}
              onClick={() => setOpenIndex(i)}
              initial={{ y: 32 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              animate={{ opacity: openIndex === i ? 0 : 1 }}
              transition={{ duration: 0.5, delay: openIndex === null ? i * 0.1 : 0, ease: EASE }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-black/40 p-6 text-left backdrop-blur-md transition-colors duration-500 hover:border-[#C06C4C]/60 sm:p-8"
            >
              <motion.span
                layout="position"
                className="bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178] bg-clip-text font-mono text-sm text-transparent"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <motion.h3
                layout="position"
                className="mt-4 text-lg font-semibold tracking-[-0.01em] text-[#F5F5F7] sm:text-xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                {item.title}
              </motion.h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                {item.teaser}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#C06C4C] transition-transform duration-300 group-hover:translate-x-1">
                {content.detailsLabel}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && openIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[999997] bg-black/70 backdrop-blur-sm"
              onClick={() => setOpenIndex(null)}
              aria-hidden="true"
            />
            <motion.div
              layoutId={`pillar-card-${openIndex}`}
              role="dialog"
              aria-modal="true"
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed inset-4 z-[999998] flex flex-col overflow-y-auto rounded-3xl border border-[#C06C4C]/40 bg-[#0A0A0B] p-6 shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[85vh] sm:w-[min(560px,90vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-10"
            >
              <button
                type="button"
                aria-label={content.closeLabel}
                onClick={() => setOpenIndex(null)}
                className="absolute right-4 top-4 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors duration-300 hover:text-white sm:right-6 sm:top-6"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <motion.span
                layout="position"
                className="bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178] bg-clip-text font-mono text-sm text-transparent"
                aria-hidden="true"
              >
                {String(openIndex + 1).padStart(2, "0")}
              </motion.span>
              <motion.h3
                layout="position"
                className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                {active.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="mt-5 text-pretty text-sm leading-relaxed text-zinc-300 sm:text-base"
              >
                {active.expanded}
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
