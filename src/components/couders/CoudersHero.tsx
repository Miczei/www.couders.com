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
  light,
}: {
  content: CoudersContent["hero"];
  locale: Locale;
  debugProgress?: number;
  /** Homepage-only light-theme experiment — see page.tsx. Defaults to the
   *  normal dark hero everywhere else (including /lab). */
  light?: boolean;
}) {
  const reduced = useReducedMotion();
  const still = debugProgress !== undefined || !!reduced;
  // Flipped early by FluidMorph's onReveal (~78% through the morph, not at
  // its true end) so the subtitle/chat overlap the logo's final settling
  // phase instead of waiting for it — zero dead pause, zero extra delay.
  const [logoReveal, setLogoReveal] = useState(still);

  return (
    <section className={`relative z-10 overflow-hidden ${light ? "bg-white" : "bg-black"}`}>
      <AmbientGlow
        className="left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2"
        color="rgba(14,165,233,0.12)"
      />
      <AmbientGlow
        className="bottom-0 right-[6%] h-[420px] w-[420px]"
        color="rgba(90,120,150,0.1)"
      />
      {/* pt clears the fixed navbar on phones (burger + brand row is ~60px
          tall); ≥768px the header is a single slim row so 64px is the floor —
          don't reduce md:pt below that or the H1 slides under the navbar. */}
      <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-0 pb-16 pt-20 md:pt-16">
        <FluidMorph
          debugProgress={debugProgress}
          ariaLabel={content.morphAria}
          className="w-[min(72vw,620px)]"
          onReveal={() => setLogoReveal(true)}
          light={light}
        />

        <motion.h1
          initial={still ? false : { opacity: 0, y: 20 }}
          animate={logoReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0, ease: EASE }}
          className={`mt-1 max-w-xl text-balance px-6 text-center text-xl font-semibold tracking-[-0.03em] sm:max-w-2xl sm:text-2xl lg:w-max lg:max-w-none lg:whitespace-nowrap lg:text-3xl ${
            light ? "text-slate-900" : "text-white"
          }`}
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h1}
        </motion.h1>

        <div className="mt-8 w-full max-w-4xl px-6">
          <HeroChat ready={logoReveal} light={light} />
        </div>

        <motion.p
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: logoReveal ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`mt-5 px-6 text-center text-sm uppercase tracking-wider ${
            light ? "text-slate-500" : "text-zinc-400"
          }`}
        >
          {content.chatSubtitle}
        </motion.p>

        <motion.div
          initial={still ? false : { opacity: 0, y: 16 }}
          animate={logoReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
        >
          <Link
            href={`/${locale}/contact`}
            className={`mt-6 inline-block rounded-full px-9 py-4 text-center text-[15px] font-medium transition-transform duration-300 hover:-translate-y-0.5 ${
              light ? "bg-[#0EA5E9] text-white" : "bg-white text-black"
            }`}
          >
            {content.ctaButton}
          </Link>
        </motion.div>

        <motion.div
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: logoReveal ? 1 : 0 }}
          transition={{ duration: 0.8, delay: logoReveal ? 0.9 : 0 }}
          className={`mt-auto flex flex-col items-center gap-2.5 pt-10 ${
            light ? "text-slate-400" : "text-zinc-600"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
            {content.scroll}
          </span>
          <span
            className={`relative block h-9 w-px overflow-hidden ${light ? "bg-black/15" : "bg-white/15"}`}
          >
            <motion.span
              className={`absolute left-0 top-0 h-3 w-px ${light ? "bg-black/60" : "bg-white/70"}`}
              animate={{ y: [-12, 36] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
