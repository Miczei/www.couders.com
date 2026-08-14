"use client";

import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function MockPanel({
  label,
  labelTone,
  delay,
  chip,
  children,
}: {
  label: string;
  labelTone: "muted" | "accent";
  delay: number;
  chip?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-7"
    >
      {chip && (
        <span className="absolute -right-3 -top-3 z-10 rounded-full border border-[#C06C4C]/40 bg-black/90 px-3 py-1.5 text-[11px] font-medium text-[#E8B8A2] shadow-lg backdrop-blur-md sm:-right-4 sm:-top-4">
          {chip}
        </span>
      )}
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
          labelTone === "accent" ? "text-[#E8B8A2]" : "text-zinc-500"
        }`}
      >
        {label}
      </p>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

function ClientBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[90%] self-start whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-white/[0.07] px-4 py-3 text-[13.5px] leading-relaxed text-zinc-300">
      {text}
    </div>
  );
}

function ConnectorOrb() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
    >
      <motion.span
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C06C4C]/50 bg-black shadow-[0_0_36px_rgba(192,108,76,0.55)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C06C4C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </motion.span>
    </div>
  );
}

export default function ProblemSection({ content }: { content: CoudersContent["problem"] }) {
  return (
    <section
      id="problem"
      className="relative z-10 overflow-hidden bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[11px] sm:tracking-[0.32em]">
          {content.eyebrow}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mt-4 max-w-4xl text-balance text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>

        <div className="relative mt-10 grid grid-cols-1 gap-4 text-left sm:mt-14 md:grid-cols-2">
          <ConnectorOrb />

          <MockPanel label={content.leftLabel} labelTone="muted" delay={0.05}>
            <ClientBubble text={content.clientMessage} />
            <p className="flex items-center gap-2 text-xs text-rose-400/90 sm:text-[13px]">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.7)]" />
              {content.officeStatus}
            </p>
          </MockPanel>

          <MockPanel label={content.rightLabel} labelTone="accent" delay={0.15} chip={content.metricChip}>
            <ClientBubble text={content.clientMessage} />
            <div className="max-w-[90%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm border border-[#C06C4C]/30 bg-[#C06C4C]/15 px-4 py-3 text-[13.5px] leading-relaxed text-zinc-100">
              {content.aiMessage}
            </div>
          </MockPanel>
        </div>
      </div>
    </section>
  );
}
