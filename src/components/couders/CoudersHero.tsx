"use client";

import { motion, useReducedMotion } from "framer-motion";
import FluidMorph from "./FluidMorph";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const COPY_DELAY = 3.9;

export default function CoudersHero({
  content,
  debugProgress,
}: {
  content: CoudersContent["hero"];
  debugProgress?: number;
}) {
  const reduced = useReducedMotion();
  const still = debugProgress !== undefined || reduced;

  return (
    <section className="relative z-10 bg-black">
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-0 pb-24 pt-24 sm:pb-28">
        <motion.p
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-2 px-6 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[11px] sm:tracking-[0.32em]"
        >
          {content.eyebrow}
        </motion.p>

        <FluidMorph
          debugProgress={debugProgress}
          ariaLabel={content.morphAria}
          className="w-[min(94vw,1160px)]"
        />

        <motion.div
          initial={still ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: COPY_DELAY, ease: EASE }}
          className="flex max-w-2xl flex-col items-center px-6 text-center"
        >
          <h1
            className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#F5F5F7] sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {content.h1}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-zinc-400 antialiased sm:mt-5 sm:text-base md:text-lg">
            {content.sub}
          </p>
          <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-3.5">
            <a
              href="#contact"
              className="w-full max-w-xs rounded-full bg-white px-7 py-3.5 text-center text-[15px] font-medium text-black transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto sm:max-w-none"
            >
              {content.ctaPrimary}
            </a>
            <a
              href="#engine"
              className="w-full max-w-xs rounded-full border border-white/20 px-7 py-3.5 text-center text-[15px] font-medium text-white transition-colors duration-300 hover:border-white/60 sm:w-auto sm:max-w-none"
            >
              {content.ctaSecondary}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: COPY_DELAY + 0.5 }}
          className="absolute bottom-8 flex flex-col items-center gap-2.5 text-zinc-600"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
            {content.scroll}
          </span>
          <span className="relative block h-9 w-px overflow-hidden bg-white/15">
            <motion.span
              className="absolute left-0 top-0 h-3 w-px bg-white/70"
              animate={{ y: [-12, 36] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
