"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import ShaderBackdrop from "@/components/couders/ShaderBackdrop";
import FluidMorph from "@/components/couders/FluidMorph";

const SplitHeadline = dynamic(
  () => import("@/components/couders/SplitHeadline"),
  { ssr: false },
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PremiumHero() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(!!reduced);

  // The subtitle and CTA are gated on the logo morph handing over. If that
  // never happens — SVG failed, or rAF starved because the tab loaded in the
  // background — the page would sit there with no call to action at all.
  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 3500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <ShaderBackdrop tone="paper" />

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 pt-32">
        <FluidMorph
          ariaLabel="Couders"
          className="w-[min(70vw,560px)] -mb-1 sm:-mb-3"
          onReveal={() => setRevealed(true)}
          light
        />

        <SplitHeadline
          text="Nikt już nie czeka do poniedziałku."
          ready={revealed}
          className="mt-2 max-w-[16ch] text-balance text-center text-[clamp(2.4rem,6.4vw,5rem)] font-semibold leading-[0.96] tracking-[-0.042em] text-[color:var(--p-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="mt-7 max-w-[54ch] text-center text-[17.5px] leading-relaxed text-[color:var(--p-muted)]"
        >
          Asystent AI, który odbiera telefon, czyta maile i odpisuje na formularze
          o każdej porze — a rano zostawia Wam gotowe leady zamiast listy nieodebranych.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#kontakt"
            className="rounded-full bg-[color:var(--p-ink)] px-8 py-3.5 text-[15px] font-medium text-[color:var(--p-paper)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none"
          >
            Umów rozmowę
          </a>
          <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[color:var(--p-muted)]">
            Wdrożenie w 14 dni
          </span>
        </motion.div>
      </div>
    </section>
  );
}
