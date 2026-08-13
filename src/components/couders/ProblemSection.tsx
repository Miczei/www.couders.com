"use client";

import { motion } from "framer-motion";
import type { CoudersContent, CoudersTimelineStep } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function TimelineCard({
  title,
  steps,
  variant,
  delay,
}: {
  title: string;
  steps: CoudersTimelineStep[];
  variant: "before" | "after";
  delay: number;
}) {
  const glow = variant === "after";
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${
        glow
          ? "border-[#C06C4C]/40 bg-[#0A0A0B] shadow-[0_0_60px_-15px_rgba(192,108,76,0.35)]"
          : "border-white/[0.08] bg-[#0A0A0B]"
      }`}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(420px circle at 100% 0%, rgba(192,108,76,0.14), transparent 65%)",
          }}
        />
      )}
      <p
        className={`relative font-mono text-[10px] uppercase tracking-[0.22em] ${
          glow ? "text-[#E8B8A2]" : "text-zinc-500"
        }`}
      >
        {title}
      </p>

      <div className="relative mt-6 space-y-5">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-none flex-col items-center">
              <span
                className={`h-2.5 w-2.5 flex-none rounded-full ${
                  glow ? "bg-[#C06C4C] shadow-[0_0_8px_rgba(192,108,76,0.8)]" : "bg-zinc-600"
                }`}
              />
              {i < steps.length - 1 && (
                <span className={`mt-1 w-px flex-1 ${glow ? "bg-[#C06C4C]/25" : "bg-white/10"}`} />
              )}
            </div>
            <div className="pb-1">
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                  glow ? "text-[#E8B8A2]/80" : "text-zinc-500"
                }`}
              >
                {step.time}
              </p>
              <p className={`mt-1 text-sm leading-relaxed sm:text-[15px] ${glow ? "text-zinc-200" : "text-zinc-400"}`}>
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProblemSection({ content }: { content: CoudersContent["problem"] }) {
  return (
    <section id="problem" className="relative z-10 bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-32">
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

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 md:grid-cols-2">
          <TimelineCard title={content.before.title} steps={content.before.steps} variant="before" delay={0.05} />
          <TimelineCard title={content.after.title} steps={content.after.steps} variant="after" delay={0.15} />
        </div>
      </div>
    </section>
  );
}
