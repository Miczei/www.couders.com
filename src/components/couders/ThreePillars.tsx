"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";
import Modal from "./Modal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ThreePillars({ content }: { content: CoudersContent["pillars"] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? content.items[activeIndex] : null;

  return (
    <section id="pillars" className="relative z-10 bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-32">
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

        {/* Grid is always frozen: opening a card's detail never resizes or
            reorders these tiles, since detail renders in a fixed overlay. */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {content.items.map((item, i) => (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-black/40 p-6 text-left backdrop-blur-md transition-colors duration-500 hover:border-[#C06C4C]/60 sm:p-8"
            >
              <span
                className="bg-gradient-to-b from-white via-[#C7CCD6] to-[#6E7178] bg-clip-text font-mono text-sm text-transparent"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="mt-4 text-lg font-semibold tracking-[-0.01em] text-[#F5F5F7] sm:text-xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                {item.teaser}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#C06C4C] transition-transform duration-300 group-hover:translate-x-1">
                {content.detailsLabel}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Modal open={active !== null} onClose={() => setActiveIndex(null)} closeLabel={content.closeLabel}>
        {active && (
          <>
            <h3
              className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              {active.title}
            </h3>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-zinc-300 sm:text-base">
              {active.expanded}
            </p>
          </>
        )}
      </Modal>
    </section>
  );
}
