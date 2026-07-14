"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function TimelineStep({
  step,
  index,
}: {
  step: CoudersContent["process"]["steps"][number];
  index: number;
}) {
  const fromLeft = index % 2 === 0;

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#C06C4C] shadow-[0_0_10px_rgba(192,108,76,0.65)] md:left-1/2"
      />
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -28 : 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`pl-12 md:w-1/2 md:pl-0 ${
          fromLeft
            ? "md:pr-16 md:text-right"
            : "md:ml-auto md:pl-16 md:text-left"
        }`}
      >
        <span
          className="bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178] bg-clip-text font-mono text-sm text-transparent"
          aria-hidden="true"
        >
          {step.no}
        </span>
        <h3
          className="mt-3 text-lg font-semibold tracking-[-0.01em] text-[#F5F5F7] sm:text-xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">{step.body}</p>
      </motion.div>
    </div>
  );
}

export default function ProcessSection({
  content,
}: {
  content: CoudersContent["process"];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.35"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 60, damping: 22, restDelta: 0.001 });

  return (
    <section id="process" className="relative z-10 bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[11px] sm:tracking-[0.32em]">
          {content.eyebrow}
        </p>
        <h2
          className="mt-4 max-w-2xl text-balance text-2xl font-semibold tracking-[-0.03em] text-[#F5F5F7] sm:text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </h2>

        <div ref={trackRef} className="relative mx-auto mt-14 max-w-3xl sm:mt-20 md:max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-white/[0.12] md:left-1/2"
          >
            <motion.div
              className="absolute inset-x-0 top-0 origin-top bg-[#C06C4C]"
              style={{ height: "100%", scaleY: reduced ? 1 : fill }}
            />
          </div>

          <div className="space-y-14 sm:space-y-16 md:space-y-20">
            {content.steps.map((s, i) => (
              <TimelineStep key={s.no} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
