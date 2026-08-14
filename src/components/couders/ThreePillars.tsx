"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 flex-none text-[#C06C4C] transition-transform duration-300 ease-in-out ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

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
                className={`rounded-2xl border bg-black/40 backdrop-blur-md transition-colors duration-500 ${
                  open ? "border-[#C06C4C]/60 sm:col-span-3" : "border-white/10 hover:border-[#C06C4C]/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full flex-col p-6 text-left sm:p-8"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178] bg-clip-text font-mono text-sm text-transparent"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Chevron open={open} />
                  </div>
                  <h3
                    className="mt-4 text-lg font-semibold tracking-[-0.01em] text-[#F5F5F7] sm:text-xl"
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">{item.teaser}</p>
                </button>

                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-300 sm:px-8 sm:pb-8 sm:text-[15px] md:max-w-3xl">
                      {item.expanded}
                    </p>
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
