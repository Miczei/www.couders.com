"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import FluidMorph from "./FluidMorph";
import HeroChat from "./HeroChat";
import AmbientGlow from "./AmbientGlow";
import type { CoudersContent } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function CoudersHero({
  content,
  locale,
  debugProgress,
}: {
  content: CoudersContent["hero"];
  locale: Locale;
  debugProgress?: number;
}) {
  const reduced = useReducedMotion();
  const still = debugProgress !== undefined || !!reduced;
  // Flipped early by FluidMorph's onReveal (~78% through the morph, not at
  // its true end) so the subtitle/chat overlap the logo's final settling
  // phase instead of waiting for it — zero dead pause, zero extra delay.
  const [logoReveal, setLogoReveal] = useState(still);

  return (
    <section className="relative z-10 overflow-hidden bg-black">
      <AmbientGlow
        className="left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2"
        color="rgba(192,108,76,0.12)"
      />
      <AmbientGlow
        className="bottom-0 right-[6%] h-[420px] w-[420px]"
        color="rgba(90,120,150,0.1)"
      />
      {/* pt clears the fixed navbar on phones (burger + brand row is ~60px
          tall); ≥768px the header is a single slim row so 64px is enough. */}
      <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-0 pb-16 pt-24 md:pt-16">
        <motion.p
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-1 px-6 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[11px] sm:tracking-[0.32em]"
        >
          {content.eyebrow}
        </motion.p>

        <FluidMorph
          debugProgress={debugProgress}
          ariaLabel={content.morphAria}
          className="w-[min(72vw,620px)]"
          onReveal={() => setLogoReveal(true)}
        />

        <motion.h1
          initial={still ? false : { opacity: 0, y: 20 }}
          animate={logoReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0, ease: EASE }}
          className="mt-1 max-w-xl text-balance px-6 text-center text-xl font-semibold tracking-[-0.03em] text-white sm:max-w-2xl sm:text-2xl lg:w-max lg:max-w-none lg:whitespace-nowrap lg:text-3xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h1}
        </motion.h1>

        <motion.p
          initial={still ? false : { opacity: 0, y: 16 }}
          animate={logoReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-4 max-w-xl text-pretty px-6 text-center text-sm leading-relaxed text-zinc-400 sm:max-w-2xl sm:text-base"
        >
          {content.h2}
        </motion.p>

        <motion.div
          initial={still ? false : { opacity: 0, y: 16 }}
          animate={logoReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
        >
          <Link
            href={`/${locale}/contact`}
            className="mt-7 inline-block rounded-full bg-white px-9 py-4 text-center text-[15px] font-medium text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            {content.ctaButton}
          </Link>
        </motion.div>

        <motion.p
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: logoReveal ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-3 mt-10 px-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-[11px]"
        >
          {content.chatSubtitle}
        </motion.p>

        <div className="w-full max-w-4xl px-6">
          <HeroChat ready={logoReveal} />
        </div>

        <motion.div
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: logoReveal ? 1 : 0 }}
          transition={{ duration: 0.8, delay: logoReveal ? 0.9 : 0 }}
          className="mt-auto flex flex-col items-center gap-2.5 pt-10 text-zinc-600"
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
