import type { Metadata } from "next";
import GlassNav from "@/components/premium/GlassNav";
import { getShowcase } from "@/i18n/showcase";
import AgentShowcase from "@/components/premium/AgentShowcase";
import AgentRoster from "@/components/premium/AgentRoster";
import FrozenSections from "./FrozenSections";
import OpsDeck from "@/components/premium/OpsDeck";

/**
 * The running board of drop-in proposals. New rounds get appended here rather
 * than starting a new route, so everything stays comparable in one scroll.
 *
 * Everything is a standalone component that can be pasted into the live page
 * one at a time — the site's own fonts (Inter and Space Grotesk) and colours
 * throughout, and nothing depends on this route existing.
 *
 * The first screen is intentionally a placeholder: the real hero stays as it
 * is. This page exists to judge what comes *after* it.
 */
export const metadata: Metadata = {
  title: "Couders — sekcje",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="bg-white text-[#0b0b0c]">
      <GlassNav />

      <section className="flex min-h-[58svh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Studium sekcji · pięć propozycji
        </p>
        <h1
          className="mt-5 max-w-[22ch] text-balance text-[clamp(1.6rem,3.6vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Wasz obecny hero zostaje. To jest to, co ma iść pod nim.
        </h1>
        <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-slate-500">
          Każda sekcja odtwarza się sama, kiedy wjedzie w kadr, i każda to jeden
          plik, który wchodzi na stronę osobno.
        </p>
        <span className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.28em] text-slate-400">
          przewiń w dół ↓
        </span>
      </section>

      {/* Newest first. The showcase is the merge of the live "Trzy sposoby"
          cards with the roster's click-to-open replay. */}
      <AgentShowcase content={getShowcase("pl")} />
      <AgentRoster />
      <OpsDeck />
      <FrozenSections />

      <footer className="border-t border-black/[0.08] bg-white py-10">
        <div className="mx-auto max-w-[1000px] px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Nieindeksowane · treści i liczby są przykładowe
        </div>
      </footer>
    </main>
  );
}
