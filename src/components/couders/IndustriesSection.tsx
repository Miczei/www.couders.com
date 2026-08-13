"use client";

import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ICONS: React.ReactNode[] = [
  // Manufacturing & Machinery — gear
  <path
    key="gear"
    d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM4 12h1.6M18.4 12H20M12 4v1.6M12 18.4V20M6.3 6.3l1.1 1.1M16.6 16.6l1.1 1.1M17.7 6.3l-1.1 1.1M7.4 16.6l-1.1 1.1"
    strokeLinecap="round"
  />,
  // Construction Materials — stacked blocks
  <g key="blocks">
    <rect x="4" y="14" width="7" height="6" rx="1" />
    <rect x="13" y="14" width="7" height="6" rx="1" />
    <rect x="8.5" y="4" width="7" height="6" rx="1" />
  </g>,
  // Real Estate Developers — building
  <g key="building">
    <rect x="6" y="4" width="12" height="16" rx="1" />
    <path d="M9.5 8h1M13.5 8h1M9.5 12h1M13.5 12h1M9.5 16h1M13.5 16h1" strokeLinecap="round" />
  </g>,
  // B2B Services — briefcase
  <g key="briefcase">
    <rect x="3.5" y="8" width="17" height="11" rx="1.5" />
    <path d="M8.5 8V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2" />
    <path d="M3.5 13h17" />
  </g>,
];

export default function IndustriesSection({ content }: { content: CoudersContent["industries"] }) {
  return (
    <section id="industries" className="relative z-10 bg-black px-5 py-16 sm:px-6 sm:py-24 md:py-32">
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

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {content.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-white/[0.08] p-6 transition-colors duration-500 hover:border-[#C06C4C]/50 sm:p-7"
              style={{
                background: "linear-gradient(160deg, #17171A 0%, #0A0A0B 55%, #0A0A0B 100%)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C06C4C"
                strokeWidth="1.5"
                className="h-9 w-9 transition-transform duration-500 sm:group-hover:-translate-y-1"
                aria-hidden="true"
              >
                {ICONS[i]}
              </svg>
              <p
                className="mt-5 text-lg font-medium tracking-[-0.01em] text-[#F5F5F7] transition-transform duration-500 sm:group-hover:-translate-y-1"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                {item.title}
              </p>

              <ul className="mt-4 space-y-1.5 opacity-100 transition-all duration-500 sm:mt-0 sm:max-h-0 sm:translate-y-2 sm:opacity-0 sm:group-hover:mt-4 sm:group-hover:max-h-40 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                {item.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-zinc-400 sm:text-[13px]">
                    <span className="h-1 w-1 flex-none rounded-full bg-[#C06C4C]" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
