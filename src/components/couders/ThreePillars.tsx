"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Each card expands anchored to its own edge — left card grows from the
// left, center from the middle, right card from the right — instead of
// converging on one shared spot. The wrapper cell keeps a fixed min-height
// so growing a card never resizes the grid track or its siblings; the card
// itself goes `absolute` once open and overlaps whatever's below it, so the
// footer/next section never gets pushed down either.
const OPEN_ANCHOR_CLASS = [
  "sm:left-0 sm:right-auto",
  "sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
  "sm:left-auto sm:right-0",
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

  // A section with its own z-index creates a stacking context: a z-20 card
  // inside a z-10 section still loses to a *sibling* z-10 section that comes
  // later in the DOM (the marquee), because descendant z-index never leaks
  // out to compete with sibling stacking contexts. Bumping this section's
  // own z-index above the marquee's while a card is open is what actually
  // lets the expanded card float above it instead of getting painted under.
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

        {/* Click-outside-to-close backdrop. Sibling of the cards (not a
            wrapper), so hit-testing alone already keeps clicks on the open
            card from reaching it; stopPropagation on the card is a defensive
            second layer. z-10 sits above closed cards (z-0) and below the
            open one (z-20), and the section's own z-40-while-open bump (see
            below) lifts this whole layer, backdrop included, above the rest
            of the page. */}
        {openIndex !== null && (
          <div
            aria-hidden="true"
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-10 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300"
          />
        )}

        <div className="mt-10 grid grid-cols-1 items-stretch gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {content.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative min-h-[230px] sm:min-h-[250px]"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute inset-x-0 top-0 flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8 ${
                    open
                      ? `z-20 border-[#0EA5E9]/60 shadow-2xl sm:w-[130%] ${light ? "bg-white" : "bg-[#0A0A0B]"} ${OPEN_ANCHOR_CLASS[i]}`
                      : light
                        ? "z-0 bottom-0 h-full border-slate-200 bg-black/[0.02] hover:border-[#0EA5E9]/50 sm:w-full"
                        : "z-0 bottom-0 h-full border-white/10 bg-black/40 hover:border-[#0EA5E9]/40 sm:w-full"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex flex-1 flex-col text-left"
                  >
                    <span
                      className={`bg-clip-text font-mono text-sm text-transparent ${
                        light
                          ? "bg-gradient-to-b from-slate-900 via-slate-600 to-slate-400"
                          : "bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178]"
                      }`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`mt-4 text-lg font-semibold tracking-[-0.01em] transition-transform duration-500 sm:text-xl ${
                        open ? "scale-[1.03]" : ""
                      } ${light ? "text-slate-900" : "text-[#F5F5F7]"}`}
                      style={{ fontFamily: "var(--font-display), sans-serif", transformOrigin: "left" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-3 flex-1 text-sm leading-relaxed sm:text-[15px] ${
                        light ? "text-slate-600" : "text-zinc-400"
                      }`}
                    >
                      {item.teaser}
                    </p>
                    {!open && (
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0EA5E9]">
                        {content.detailsLabel}
                      </span>
                    )}
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`text-sm leading-relaxed sm:text-[15px] ${
                          light ? "text-slate-700" : "text-zinc-300"
                        }`}
                      >
                        {item.expanded}
                      </p>
                      <Link
                        href={solutionsHref}
                        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
                      >
                        {content.ctaLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
