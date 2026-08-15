"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
  const openItem = openIndex !== null ? content.items[openIndex] : null;
  const closeLabel = locale === "pl" ? "Zamknij" : "Close";

  // Standard modal hygiene, matching the deep-dive modal on /methodology:
  // Escape closes it, and background scroll is locked while it's open.
  useEffect(() => {
    if (!openItem) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openItem]);

  return (
    <section
      id="pillars"
      className={`relative z-10 px-5 py-16 sm:px-6 sm:py-24 md:py-32 ${light ? "bg-white" : "bg-black"}`}
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

        {/* Plain in-flow grid cards — CSS Grid stretches every cell in a row
            to match the tallest one by default, so h-full on each card is
            all that's needed for guaranteed equal heights, regardless of
            teaser length. No absolute positioning, no manual pixel heights. */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 md:grid-cols-3">
          {content.items.map((item, i) => (
            <motion.div
              key={item.title}
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
          ))}
        </div>
      </div>

      {/* Deep-dive modal, portaled straight to <body>: sidesteps every
          ancestor stacking-context/z-index fight since it's no longer a
          descendant of this section (or any other homepage section) at all. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {openItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpenIndex(null)}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                  className="no-scrollbar max-h-[85vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
                >
                  <div className="flex items-start justify-between gap-6">
                    <h3
                      className="text-2xl font-semibold tracking-[-0.02em] text-slate-900"
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {openItem.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(null)}
                      aria-label={closeLabel}
                      className="rounded-full border border-slate-300 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900"
                    >
                      {closeLabel}
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                    {openItem.expanded}
                  </p>
                  <Link
                    href={solutionsHref}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
                  >
                    {content.ctaLabel}
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
