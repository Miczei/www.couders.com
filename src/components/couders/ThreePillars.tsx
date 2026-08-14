"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Each card expands anchored to its own edge — left card grows from the
// left, center from the middle, right card from the right — instead of
// converging on one shared spot. The wrapper cell keeps a fixed min-height
// so growing a card never resizes the grid track or its siblings; the card
// itself goes `absolute` once open and overlaps whatever's below it, so the
// footer/next section never gets pushed down either.
const OPEN_ANCHOR_CLASS = [
  "sm:left-0 sm:right-auto",
  "sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
  "sm:left-auto sm:right-0",
];

export default function ThreePillars({ content }: { content: CoudersContent["pillars"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {content.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative min-h-[230px] sm:min-h-[250px]"
              >
                <div
                  className={`absolute inset-x-0 top-0 flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8 ${
                    open
                      ? `z-20 border-[#C06C4C]/60 bg-[#0A0A0B] shadow-2xl sm:w-[130%] ${OPEN_ANCHOR_CLASS[i]}`
                      : "z-0 border-white/10 bg-black/40 hover:border-[#C06C4C]/40 sm:w-full"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex flex-col text-left"
                  >
                    <span
                      className="bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178] bg-clip-text font-mono text-sm text-transparent"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`mt-4 text-lg font-semibold tracking-[-0.01em] text-[#F5F5F7] transition-transform duration-500 sm:text-xl ${
                        open ? "scale-[1.03]" : ""
                      }`}
                      style={{ fontFamily: "var(--font-display), sans-serif", transformOrigin: "left" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">{item.teaser}</p>
                    {!open && (
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#C06C4C]">
                        {content.detailsLabel}
                      </span>
                    )}
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-zinc-300 sm:text-[15px]">{item.expanded}</p>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(null)}
                        className="mt-4 text-sm font-medium text-[#C06C4C]"
                      >
                        {content.closeLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
