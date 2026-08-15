"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Each card grows outward from its own grid slot instead of converging on
// one shared spot: left anchors its top-left corner and grows down/right,
// center grows down from a fixed horizontal center, right anchors its
// top-right corner and grows down/left.
const EXPAND_ANCHOR_CLASS = [
  "top-0 left-0 origin-top-left",
  "top-0 left-1/2 -translate-x-1/2 origin-top",
  "top-0 right-0 origin-top-right",
];

export default function ThreePillars({
  content,
  locale,
  light,
}: {
  content: CoudersContent["pillars"];
  locale: Locale;
  light?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const solutionsHref = `/${locale}/methodology`;

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex]);

  return (
    <section
      id="pillars"
      className={`relative px-5 py-16 sm:px-6 sm:py-24 md:py-32 ${light ? "bg-white" : "bg-black"} ${
        openIndex !== null ? "z-40" : "z-10"
      }`}
    >
      <div className="mx-auto max-w-6xl">
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
          className={`mt-4 max-w-2xl text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl md:text-5xl ${
            light ? "text-slate-900" : "text-white"
          }`}
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>

        {openIndex !== null && (
          <div
            aria-hidden="true"
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
          />
        )}

        {/* Relative wrapper per the blueprint: the grid itself never
            collapses or resizes when a card opens (every cell keeps
            contributing its normal in-flow size to the row), since the
            expanded version is a z-50 absolute overlay anchored to its own
            cell's relative wrapper — it grows outward without touching
            the grid's track sizing at all. */}
        <div className="relative mt-10 grid grid-cols-1 gap-6 sm:mt-14 md:grid-cols-3">
          {content.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.title} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  onClick={() => setOpenIndex(i)}
                  className={`flex h-full cursor-pointer flex-col justify-between rounded-2xl border p-8 transition-shadow hover:shadow-lg ${
                    light
                      ? "border-slate-200 bg-white"
                      : "border-white/10 bg-[#0A0A0B] hover:border-[#0EA5E9]/40"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <span className={`text-sm font-medium ${light ? "text-slate-500" : "text-zinc-500"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`text-xl font-bold leading-tight ${light ? "text-slate-900" : "text-[#F5F5F7]"}`}
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className={`leading-relaxed ${light ? "text-slate-600" : "text-zinc-400"}`}>
                      {item.teaser}
                    </p>
                  </div>
                  <div className="pt-8">
                    <span className="inline-block font-medium text-sky-500 transition-colors hover:text-sky-600">
                      {content.detailsLabel}
                    </span>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute z-50 w-[90vw] rounded-2xl border p-8 shadow-2xl transition-all duration-300 md:w-[250%] ${
                        EXPAND_ANCHOR_CLASS[i]
                      } ${light ? "border-slate-200 bg-white" : "border-white/10 bg-[#0A0A0B]"}`}
                    >
                      <span className={`text-sm font-medium ${light ? "text-slate-500" : "text-zinc-500"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`mt-4 text-xl font-bold leading-tight ${
                          light ? "text-slate-900" : "text-[#F5F5F7]"
                        }`}
                        style={{ fontFamily: "var(--font-display), sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`mt-4 text-sm leading-relaxed sm:text-[15px] ${
                          light ? "text-slate-700" : "text-zinc-300"
                        }`}
                      >
                        {item.expanded}
                      </p>
                      <Link
                        href={solutionsHref}
                        className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
                      >
                        {content.ctaLabel}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
