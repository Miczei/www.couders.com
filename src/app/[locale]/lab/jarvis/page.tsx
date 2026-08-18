import type { Metadata } from "next";
import GlassNav from "@/components/premium/GlassNav";
import AssistantOrb from "@/components/premium/AssistantOrb";
import OpsDeck from "@/components/premium/OpsDeck";

/**
 * Second round of drop-in proposals, aimed higher than the first: instead of
 * illustrating the product, these two try to *be* it on the page — a surface
 * that reacts to you, and the console the thing runs on.
 *
 * Same rules as /lab/sections: site fonts, site palette, each section a file
 * that can move to the live page on its own.
 */
export const metadata: Metadata = {
  title: "Couders — obecność",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="bg-white text-[#0b0b0c]">
      <GlassNav />

      <section className="flex min-h-[58svh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Propozycje · runda druga
        </p>
        <h1
          className="mt-5 max-w-[24ch] text-balance text-[clamp(1.6rem,3.6vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Zamiast opowiadać o systemie — pokazać, że działa.
        </h1>
        <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-slate-500">
          Dwie sekcje: żywa powierzchnia, która reaguje na kursor i mówi, oraz
          pulpit, na którym widać całą nocną zmianę. Obie same się odtwarzają.
        </p>
        <span className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.28em] text-slate-400">
          przewiń w dół ↓
        </span>
      </section>

      <AssistantOrb />
      <OpsDeck />

      <footer className="border-t border-black/[0.08] bg-white py-10">
        <div className="mx-auto max-w-[1240px] px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Nieindeksowane · treści i liczby są przykładowe
        </div>
      </footer>
    </main>
  );
}
