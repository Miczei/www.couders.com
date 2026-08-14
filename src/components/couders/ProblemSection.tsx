"use client";

import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function MockPanel({
  label,
  labelTone,
  delay,
  chip,
  light,
  children,
}: {
  label: string;
  labelTone: "muted" | "accent";
  delay: number;
  chip?: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`relative flex flex-col gap-4 rounded-2xl border p-5 backdrop-blur-md sm:p-7 ${
        light ? "border-slate-200 bg-black/[0.03]" : "border-white/10 bg-white/[0.04]"
      }`}
    >
      {chip && (
        <span
          className={`absolute -right-3 -top-3 z-10 rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur-md sm:-right-4 sm:-top-4 ${
            light ? "border-[#0EA5E9]/40 bg-white text-[#9A4E30]" : "border-[#0EA5E9]/40 bg-black/90 text-[#E8B8A2]"
          }`}
        >
          {chip}
        </span>
      )}
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
          labelTone === "accent" ? (light ? "text-[#9A4E30]" : "text-[#E8B8A2]") : light ? "text-slate-500" : "text-zinc-500"
        }`}
      >
        {label}
      </p>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

function ClientBubble({ text, light }: { text: string; light?: boolean }) {
  return (
    <div
      className={`max-w-[90%] self-start whitespace-pre-wrap rounded-2xl rounded-bl-sm px-4 py-3 text-[13.5px] leading-relaxed ${
        light ? "bg-black/[0.05] text-slate-700" : "bg-white/[0.07] text-zinc-300"
      }`}
    >
      {text}
    </div>
  );
}

function ConnectorOrb({ light }: { light?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
    >
      <motion.span
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-[#0EA5E9]/50 shadow-[0_0_36px_rgba(14,165,233,0.55)] ${
          light ? "bg-white" : "bg-black"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0EA5E9"
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

export default function ProblemSection({
  content,
  light,
}: {
  content: CoudersContent["problem"];
  light?: boolean;
}) {
  return (
    <section
      id="problem"
      className={`relative z-10 overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32 ${
        light ? "bg-white" : "bg-black"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.16)"
          } 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <p
          className={`font-mono text-[10px] uppercase tracking-[0.26em] sm:text-[11px] sm:tracking-[0.32em] ${
            light ? "text-slate-500" : "text-zinc-500"
          }`}
        >
          {content.eyebrow}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`mx-auto mt-4 max-w-4xl text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-5xl lg:text-6xl ${
            light ? "text-slate-900" : "text-white"
          }`}
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>

        <div className="relative mt-10 grid grid-cols-1 gap-4 text-left sm:mt-14 md:grid-cols-2">
          <ConnectorOrb light={light} />

          <MockPanel label={content.leftLabel} labelTone="muted" delay={0.05} light={light}>
            <ClientBubble text={content.clientMessage} light={light} />
            <p
              className={`flex items-center gap-2 text-xs sm:text-[13px] ${
                light ? "text-rose-600" : "text-rose-400/90"
              }`}
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.7)]" />
              {content.officeStatus}
            </p>
          </MockPanel>

          <MockPanel
            label={content.rightLabel}
            labelTone="accent"
            delay={0.15}
            chip={content.metricChip}
            light={light}
          >
            <ClientBubble text={content.clientMessage} light={light} />
            <div
              className={`max-w-[90%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm border border-[#0EA5E9]/30 bg-[#0EA5E9]/15 px-4 py-3 text-[13.5px] leading-relaxed ${
                light ? "text-slate-900" : "text-zinc-100"
              }`}
            >
              {content.aiMessage}
            </div>
          </MockPanel>
        </div>
      </div>
    </section>
  );
}
