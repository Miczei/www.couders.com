"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Bento layout: card 1 is a large featured block, card 2 is standard,
// card 3 is a wide block spanning the full row underneath.
const CARD_SPAN_CLASS = ["md:col-span-2", "md:col-span-1", "md:col-span-3"];

export default function ThreePillars({
  content,
  locale,
}: {
  content: CoudersContent["pillars"];
  locale: Locale;
  light?: boolean;
}) {
  const solutionsHref = `/${locale}/methodology`;

  return (
    <section id="pillars" className="relative bg-white px-5 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500 sm:text-[11px] sm:tracking-[0.32em]">
          {content.eyebrow}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 mt-4 max-w-2xl text-balance text-3xl font-extrabold tracking-tighter text-slate-900 md:text-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {content.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className={CARD_SPAN_CLASS[i]}
            >
              <Link
                href={solutionsHref}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:p-10"
              >
                <div>
                  <span className="mb-6 block text-sm font-semibold tracking-widest text-sky-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="mb-4 text-2xl font-bold tracking-tight text-slate-900"
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="max-w-2xl leading-relaxed text-slate-600">{item.teaser}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 font-medium text-slate-400 transition-colors group-hover:text-sky-500">
                  {content.detailsLabel}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
