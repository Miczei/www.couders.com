"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const GRADIENTS = [
  "radial-gradient(120% 100% at 0% 0%, rgba(14,165,233,0.16), transparent 60%)",
  "radial-gradient(120% 100% at 100% 0%, rgba(14,165,233,0.16), transparent 60%)",
  "radial-gradient(120% 100% at 100% 100%, rgba(14,165,233,0.16), transparent 60%)",
  "radial-gradient(120% 100% at 0% 100%, rgba(14,165,233,0.16), transparent 60%)",
];

export default function IndustriesSection({
  content,
  light,
}: {
  content: CoudersContent["industries"];
  light?: boolean;
}) {
  const [active, setActive] = useState(0);
  const item = content.items[active];

  return (
    <section
      id="industries"
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

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 md:grid-cols-5 md:gap-6">
          {/* Tabs: horizontal scroll-snap row on mobile, vertical stack from md: up. */}
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:col-span-2 md:mx-0 md:flex-col md:gap-3 md:overflow-visible md:px-0 md:pb-0">
            {content.items.map((tab, i) => {
              const isActive = i === active;
              return (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`min-w-[200px] flex-none snap-start rounded-2xl border px-5 py-4 text-left transition-colors duration-300 md:min-w-0 ${
                    isActive
                      ? "border-[#0EA5E9]/70 bg-[#0EA5E9]/10 shadow-[0_0_24px_rgba(14,165,233,0.25)]"
                      : light
                        ? "border-slate-200 bg-black/[0.02] hover:border-slate-300"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <span
                    className={`text-[15px] font-medium tracking-[-0.01em] sm:text-base ${
                      isActive ? (light ? "text-slate-900" : "text-white") : light ? "text-slate-500" : "text-zinc-400"
                    }`}
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic display area — fixed height so tab switches never jump
              the section's height; the paragraph scrolls internally instead. */}
          <div
            className={`relative h-[400px] overflow-hidden rounded-2xl border sm:h-[380px] md:col-span-3 ${
              light ? "border-slate-200" : "border-white/10"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0 flex flex-col p-6 sm:p-10"
                style={{ background: light ? "white" : undefined }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: GRADIENTS[active % GRADIENTS.length] }}
                  aria-hidden="true"
                />
                <div className="relative flex flex-none items-center gap-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="1.4"
                    className="h-9 w-9 flex-none"
                    aria-hidden="true"
                  >
                    {ICONS[active % ICONS.length]}
                  </svg>
                  <p
                    className={`text-lg font-semibold tracking-[-0.02em] sm:text-2xl ${
                      light ? "text-slate-900" : "text-white"
                    }`}
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {item.title}
                  </p>
                </div>
                <div className="relative mt-5 flex-1 overflow-y-auto pr-1">
                  <p
                    className={`text-pretty text-sm leading-relaxed sm:text-[15px] ${
                      light ? "text-slate-700" : "text-zinc-300"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
