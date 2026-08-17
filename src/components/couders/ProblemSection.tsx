"use client";

import { motion } from "framer-motion";
import type { CoudersContent, CoudersTimelineEvent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function TimelineRow({ time, label, tone }: CoudersTimelineEvent & { tone: "muted" | "accent" }) {
  return (
    <div className="flex gap-3">
      <span
        className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${
          tone === "accent" ? "bg-sky-500" : "bg-slate-400"
        }`}
      />
      <div>
        <p className={`font-mono text-xs font-semibold ${tone === "accent" ? "text-sky-600" : "text-slate-500"}`}>
          {time}
        </p>
        <p className={`mt-0.5 text-sm leading-relaxed ${tone === "accent" ? "text-slate-800" : "text-slate-500"}`}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function ProblemSection({ content }: { content: CoudersContent["problem"]; light?: boolean }) {
  return (
    <section id="problem" className="relative bg-white px-5 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl text-balance text-3xl font-bold tracking-tighter text-slate-900 md:text-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{content.subtitle}</p>

        <div className="grid grid-cols-1 items-stretch gap-8 py-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col rounded-3xl border border-slate-200 bg-slate-100/70 p-8 opacity-80"
          >
            <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              {content.leftBadge}
            </span>
            <div className="mt-6 flex flex-col gap-5">
              {content.leftEvents.map((event) => (
                <TimelineRow key={event.time} time={event.time} label={event.label} tone="muted" />
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-red-200/50 bg-red-100/50 p-3 text-sm font-medium text-red-500">
              {content.leftOutcome}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-sky-400/30 bg-white p-8 shadow-[0_20px_50px_rgba(14,165,233,0.1)]"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
              </span>
              {content.rightBadge}
            </span>
            <div className="mt-6 flex flex-col gap-5">
              {content.rightEvents.map((event) => (
                <TimelineRow key={event.time} time={event.time} label={event.label} tone="accent" />
              ))}
            </div>
            <p className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-sky-200/60 bg-sky-50 p-3 text-sm font-semibold text-sky-700">
              <span>{content.rightOutcome}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 flex-none"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
