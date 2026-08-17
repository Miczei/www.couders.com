"use client";

import ShaderBackdrop from "@/components/couders/ShaderBackdrop";
import LiquidGlass from "./LiquidGlass";

/**
 * The one place the glass has something worth refracting. The shader runs
 * full-bleed behind the card, so the pane bends live colour instead of the
 * flat paper it would get anywhere else on the page.
 */
export default function GlassCta() {
  return (
    <section id="kontakt" className="relative isolate overflow-hidden py-32 md:py-44">
      {/* Turned up here, unlike every other section: the pane above it has to
          have something with structure to bend, or the refraction is invisible
          and the whole thing collapses into a white box. */}
      <ShaderBackdrop tone="vivid" scrim={0.45} />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <LiquidGlass
          radius={32}
          strength={54}
          bezel={0.14}
          blur={4}
          className="mx-auto max-w-3xl"
        >
          <div className="px-8 py-14 text-center md:px-16 md:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--p-muted)]">
              Następny krok
            </p>
            <h2 className="mx-auto mt-6 max-w-[17ch] text-balance text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[color:var(--p-ink)] [font-family:var(--font-display)]">
              Zobaczcie, jak odpowiada na Wasze zapytania.
            </h2>
            <p className="mx-auto mt-6 max-w-[46ch] text-[16.5px] leading-relaxed text-[color:var(--p-muted)]">
              Dwadzieścia minut. Puszczamy asystenta na Waszych prawdziwych pytaniach
              i pokazujemy, co trafiłoby do CRM-u, a co do Was.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="w-full rounded-full bg-[color:var(--p-ink)] px-8 py-3.5 text-[15px] font-medium text-[color:var(--p-paper)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none sm:w-auto"
              >
                Umów rozmowę
              </a>
              <a
                href="#"
                className="w-full rounded-full px-8 py-3.5 text-[15px] font-medium text-[color:var(--p-ink)] ring-1 ring-[color:var(--p-hair)] transition-colors hover:bg-[rgba(16,18,21,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] sm:w-auto"
              >
                Napisz do nas
              </a>
            </div>
          </div>
        </LiquidGlass>
      </div>
    </section>
  );
}
