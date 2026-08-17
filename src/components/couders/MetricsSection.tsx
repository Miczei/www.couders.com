"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function MetricsSection({ content }: { content: CoudersContent["metrics"] }) {
  return (
    <section id="metrics" className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Ambient light behind the grid — keeps the section from reading flat
          without putting a hard-edged shape anywhere near the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/20 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 text-balance text-3xl font-extrabold tracking-tighter text-slate-900 md:text-5xl"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {content.h2Lead}
            <br className="hidden md:block" /> {content.h2Tail}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="text-lg font-medium text-slate-600"
          >
            {content.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {content.items.map((item, index) => (
            <SpotlightCard
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5, ease: EASE }}
              className="flex flex-col justify-between rounded-[2.5rem] bg-slate-50 p-10 shadow-sm hover:-translate-y-1 hover:shadow-md md:p-12"
            >
              <div>
                <div
                  className={`mb-6 text-6xl font-black tracking-tighter md:text-7xl ${
                    item.accent
                      ? "text-sky-500"
                      : "bg-gradient-to-br from-slate-800 via-slate-600 to-slate-400 bg-clip-text text-transparent"
                  }`}
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  {item.value}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="font-medium leading-relaxed text-slate-600">{item.body}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
