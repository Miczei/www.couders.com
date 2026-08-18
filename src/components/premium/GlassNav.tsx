"use client";

import { useEffect, useState } from "react";
import LiquidGlass from "./LiquidGlass";

/**
 * Floating glass pill. Self-contained drop-in: no shared CSS variables beyond
 * --font-logo (the handwritten wordmark the site already loads), no context,
 * no router coupling. Render it once near the top of a page.
 *
 * It condenses on scroll — links collapse away and only the mark and the
 * booking button stay, so it stops competing with the page it floats over.
 */
export default function GlassNav({
  links = [
    { label: "Jak to działa", href: "#" },
    { label: "Wdrożenie", href: "#" },
    { label: "Branże", href: "#" },
    { label: "Cennik", href: "#" },
  ],
  cta = { label: "Umów rozmowę", href: "#kontakt" },
}: {
  links?: { label: string; href: string }[];
  cta?: { label: string; href: string };
}) {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[900] flex justify-center px-4 pt-4">
      <LiquidGlass radius={999} strength={34} bezel={0.42} blur={2} className="pointer-events-auto">
        <nav className="flex items-center gap-1 py-2 pl-4 pr-2">
          <span
            className="pr-3 text-[19px] leading-none text-[#0b0b0c]"
            style={{ fontFamily: "var(--font-logo), cursive" }}
          >
            Couders
          </span>

          <span
            aria-hidden="true"
            className={`h-4 w-px bg-black/15 transition-opacity duration-300 motion-reduce:transition-none ${
              condensed ? "opacity-0" : "opacity-100"
            }`}
          />

          <div
            className={`hidden items-center overflow-hidden transition-[max-width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:flex ${
              condensed ? "max-w-0 opacity-0" : "max-w-[520px] opacity-100"
            }`}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] text-slate-600 transition-colors hover:text-[#0b0b0c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href={cta.href}
            className="ml-1 whitespace-nowrap rounded-full bg-[#0b0b0c] px-4 py-2 text-[13.5px] font-medium text-white transition-transform duration-300 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none"
          >
            {cta.label}
          </a>
        </nav>
      </LiquidGlass>
    </div>
  );
}
