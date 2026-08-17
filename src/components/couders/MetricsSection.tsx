"use client";

import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function MetricsSection({ content }: { content: CoudersContent["metrics"] }) {
  return (
    <section id="metrics" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-6 text-balance text-3xl font-extrabold tracking-tighter text-slate-900 md:text-5xl"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {content.h2Lead}
            <br className="hidden md:block" /> {content.h2Tail}
          </motion.h2>
          <p className="text-lg font-medium text-slate-600">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {content.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="flex flex-col justify-between rounded-[2.5rem] border border-slate-200/60 bg-slate-50 p-10 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md md:p-12"
            >
              <div>
                <div
                  className={`mb-6 text-6xl font-black tracking-tighter md:text-7xl ${
                    item.accent
                      ? "text-sky-500"
                      : "bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent"
                  }`}
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  {item.value}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="font-medium leading-relaxed text-slate-600">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
