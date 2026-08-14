"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CoudersContent } from "@/i18n/couders";
import type { Locale } from "@/i18n/config";

export default function CtaSection({
  content,
  email,
  locale,
  light,
}: {
  content: CoudersContent["cta"];
  email: string;
  locale: Locale;
  light?: boolean;
}) {
  return (
    <section
      id="contact"
      className={`relative z-10 px-5 py-24 sm:px-6 sm:py-32 md:py-48 ${light ? "bg-white" : "bg-black"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <h2
          className={`text-balance bg-clip-text text-3xl font-semibold tracking-[-0.04em] text-transparent sm:text-4xl md:text-6xl ${
            light
              ? "bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500"
              : "bg-gradient-to-b from-white via-[#E8EAEE] to-[#9BA1AB]"
          }`}
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </h2>
        <Link
          href={`/${locale}/contact`}
          className={`mt-8 w-full max-w-xs rounded-full px-9 py-4 text-center text-[15px] font-medium transition-transform duration-300 hover:-translate-y-0.5 sm:mt-10 sm:w-auto sm:max-w-none ${
            light ? "bg-[#C06C4C] text-white" : "bg-white text-black"
          }`}
        >
          {content.button}
        </Link>
        <p
          className={`mt-6 px-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em] ${
            light ? "text-slate-400" : "text-zinc-600"
          }`}
        >
          {content.emailLabel}:{" "}
          <a
            href={`mailto:${email}`}
            className={light ? "text-slate-600 hover:text-slate-900" : "text-zinc-400 hover:text-white"}
          >
            {email}
          </a>
        </p>
      </motion.div>
    </section>
  );
}
