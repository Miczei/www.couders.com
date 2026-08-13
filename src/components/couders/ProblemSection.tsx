"use client";

import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ICONS = [
  // Evening inquiry — crescent moon
  (
    <path
      key="moon"
      d="M20 12.5a8.5 8.5 0 1 1-9.5-8.4 6.8 6.8 0 0 0 9.5 8.4z"
      strokeLinejoin="round"
    />
  ),
  // Silence until morning — clock
  (
    <g key="clock">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" strokeLinecap="round" />
    </g>
  ),
  // Lost to a competitor — arrow exiting
  (
    <g key="exit">
      <path d="M13 5l6 7-6 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12H4" strokeLinecap="round" />
    </g>
  ),
];

export default function ProblemSection({ content }: { content: CoudersContent["problem"] }) {
  return (
    <section id="problem" className="relative z-10 bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[11px] sm:tracking-[0.32em]">
          {content.eyebrow}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base"
        >
          {content.body}
        </motion.p>

        <div className="mx-auto mt-12 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {content.points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.09, ease: EASE }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0A0A0B] p-6 sm:p-7"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C06C4C"
                strokeWidth="1.6"
                className="h-7 w-7"
                aria-hidden="true"
              >
                {ICONS[i]}
              </svg>
              <span className="text-sm font-medium text-zinc-300 sm:text-[15px]">{point}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
