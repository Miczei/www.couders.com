import type { Metadata } from "next";
import GlassNav from "@/components/premium/GlassNav";
import AgentTrace from "@/components/premium/AgentTrace";
import NightShift from "@/components/premium/NightShift";

/**
 * Drop-in section study. Everything here is a standalone component that can be
 * pasted into the live page one at a time — the site's own fonts (Inter and
 * Space Grotesk) and colours are used throughout, and nothing depends on this
 * route existing.
 *
 * The first screen is intentionally a placeholder: the real hero stays as it
 * is. This page exists to judge what comes *after* it.
 */
export const metadata: Metadata = {
  title: "Couders — sekcje",
  robots: { index: false, follow: false },
};

/** ?trace=0..1 / ?night=0..1 freeze a section at one point, for inspecting a
 *  single frame without fighting the scrub. Same convention as /lab's ?p=. */
function freeze(v: string | string[] | undefined) {
  if (typeof v !== "string" || v === "" || Number.isNaN(Number(v))) return undefined;
  return Math.min(1, Math.max(0, Number(v)));
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  return (
    <main className="bg-white text-[#0b0b0c]">
      <GlassNav />

      <section className="flex min-h-[62svh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Studium sekcji · ekran 2 i 3
        </p>
        <h1
          className="mt-5 max-w-[22ch] text-balance text-[clamp(1.6rem,3.6vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Wasz obecny hero zostaje. To jest to, co ma iść pod nim.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-slate-500">
          Dwie sekcje. Każda odtwarza się sama, kiedy wjedzie w kadr, i każda
          to jeden plik, który wchodzi na stronę osobno.
        </p>
        <span className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.28em] text-slate-400">
          przewiń w dół ↓
        </span>
      </section>

      <AgentTrace debugProgress={freeze(q.trace)} />
      <NightShift debugProgress={freeze(q.night)} />

      <footer className="border-t border-black/[0.08] bg-white py-10">
        <div className="mx-auto max-w-[1240px] px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Nieindeksowane · treści i liczby są przykładowe
        </div>
      </footer>
    </main>
  );
}
