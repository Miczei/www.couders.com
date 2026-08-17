"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSpotlight } from "@/components/ui/SpotlightCard";
import type { CoudersContent, CoudersPillar } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Bento layout: card 1 is a large featured block, card 2 is standard,
// card 3 is a wide block spanning the full row underneath.
const CARD_SPAN_CLASS = ["md:col-span-2", "md:col-span-1", "md:col-span-3"];

function PillarCard({
  item,
  index,
  href,
  detailsLabel,
}: {
  item: CoudersPillar;
  index: number;
  href: string;
  detailsLabel: string;
}) {
  // The card is a Link, so it can't be a SpotlightCard (a motion.div); the
  // hook gives the same glow while keeping the anchor semantics intact.
  const { onMouseMove, glow } = useSpotlight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.5, ease: EASE }}
      className={CARD_SPAN_CLASS[index]}
    >
      <Link
        href={href}
        onMouseMove={onMouseMove}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:p-10"
      >
        {glow}
        <div className="relative">
          <span className="mb-6 block text-sm font-semibold tracking-widest text-sky-500">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className="mb-4 text-2xl font-bold tracking-tight text-slate-900"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {item.title}
          </h3>
          <p className="max-w-2xl leading-relaxed text-slate-600">{item.teaser}</p>
        </div>
        <span className="relative mt-auto inline-flex items-center gap-2 pt-8 font-medium text-slate-400 transition-colors group-hover:text-sky-500">
          {detailsLabel}
        </span>
      </Link>
    </motion.div>
  );
}

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
    <section id="pillars" className="relative overflow-hidden bg-white px-5 py-24 sm:px-6 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/20 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500 sm:text-[11px] sm:tracking-[0.32em]"
        >
          {content.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mb-12 mt-4 max-w-2xl text-balance text-3xl font-extrabold tracking-tighter text-slate-900 md:text-5xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {content.items.map((item, index) => (
            <PillarCard
              key={item.title}
              item={item}
              index={index}
              href={solutionsHref}
              detailsLabel={content.detailsLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
