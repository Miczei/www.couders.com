"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Three claims, counted up on entry. The rule under each one is the same
 * thread that runs through the diagram — it draws left to right as the number
 * lands, so the section reads as one measurement rather than three cards.
 *
 * Deliberately not cards: a bordered grid of three boxes is the shape every
 * generated landing page arrives at, and these numbers are stronger as type.
 */
type Metric = {
  value: number;
  format: Format;
  suffix?: string;
  label: string;
  note: string;
};

// Placeholder figures — swap for your own before this goes anywhere public.
const METRICS: Metric[] = [
  {
    value: 0.9,
    format: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    suffix: " s",
    label: "Czas pierwszej odpowiedzi",
    note: "Nie „w ciągu dnia roboczego”. Zanim klient zdąży otworzyć stronę konkurencji.",
  },
  {
    value: 0.68,
    format: { style: "percent", maximumFractionDigits: 0 },
    label: "Zapytań poza godzinami pracy",
    note: "Wieczory, weekendy, święta. Dokładnie wtedy, gdy nikt nie odbiera.",
  },
  {
    value: 24,
    format: { maximumFractionDigits: 0 },
    suffix: " h",
    label: "Dyżur bez przerwy",
    note: "Bez urlopu, bez L4 i bez gorszego dnia. Ta sama jakość o trzeciej w nocy.",
  },
];

export default function MetricsThread() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (inView) setRun(true);
  }, [inView]);

  const show = reduced || run;

  return (
    <section ref={ref} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-6">
        <p className="mb-14 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--p-muted)]">
          Mierzone u klientów, nie w prezentacji
        </p>

        <div className="grid gap-x-14 gap-y-16 md:grid-cols-3">
          {METRICS.map((m, i) => (
            <div key={m.label} className="flex flex-col">
              <div className="text-[clamp(3.2rem,7vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[color:var(--p-ink)] [font-family:var(--font-display)] [font-variant-numeric:tabular-nums]">
                <NumberFlow
                  value={show ? m.value : 0}
                  locales="pl-PL"
                  format={m.format}
                  suffix={m.suffix}
                  animated={!reduced}
                  transformTiming={{ duration: 1100, easing: "cubic-bezier(0.16,1,0.3,1)" }}
                  willChange
                />
              </div>

              <div
                aria-hidden="true"
                className="mt-6 h-px origin-left bg-[linear-gradient(90deg,#0EA5E9,#22E0C8)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  transform: `scaleX(${show ? 1 : 0})`,
                  transitionDelay: `${120 + i * 90}ms`,
                }}
              />

              <h3 className="mt-5 text-[15px] font-medium tracking-[-0.01em] text-[color:var(--p-ink)]">
                {m.label}
              </h3>
              <p className="mt-2 max-w-[34ch] text-[14.5px] leading-relaxed text-[color:var(--p-muted)]">
                {m.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
