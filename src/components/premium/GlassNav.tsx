"use client";

import { useEffect, useState } from "react";
import LiquidGlass from "./LiquidGlass";

const LINKS = ["Jak to działa", "Wdrożenie", "Branże", "Cennik"];

/**
 * Floating glass pill. It sits over the shader in the hero and over plain
 * paper further down, which is the whole point of using real refraction —
 * the pane visibly changes with what passes under it.
 */
export default function GlassNav() {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <LiquidGlass
        radius={999}
        strength={34}
        bezel={0.42}
        blur={2}
        className={`pointer-events-auto transition-[width,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          condensed ? "px-3" : "px-4"
        }`}
      >
        <nav className="flex items-center gap-1 py-2 pl-3 pr-2">
          <span className="pr-3 text-[19px] leading-none text-[color:var(--p-ink)] [font-family:var(--font-mark)]">
            Couders
          </span>

          <span
            aria-hidden="true"
            className={`h-4 w-px bg-[color:var(--p-hair)] transition-opacity duration-300 ${
              condensed ? "opacity-0" : "opacity-100"
            }`}
          />

          <div
            className={`hidden items-center overflow-hidden transition-[max-width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:flex ${
              condensed ? "max-w-0 opacity-0" : "max-w-[520px] opacity-100"
            }`}
          >
            {LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] text-[color:var(--p-muted)] transition-colors hover:text-[color:var(--p-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
              >
                {l}
              </a>
            ))}
          </div>

          <a
            href="#kontakt"
            className="ml-1 whitespace-nowrap rounded-full bg-[color:var(--p-ink)] px-4 py-2 text-[13.5px] font-medium text-[color:var(--p-paper)] transition-transform duration-300 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none"
          >
            Umów rozmowę
          </a>
        </nav>
      </LiquidGlass>
    </div>
  );
}
