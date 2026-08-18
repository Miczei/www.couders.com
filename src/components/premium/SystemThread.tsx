"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin);
}

// The wordmark is drawn as one unbroken stroke, so the diagram is too: every
// inbound channel joins the same line, and it never lifts before the outcome.
// That is the product claim stated in the only language the brand already has.
const W = 1120;
const H = 460;
const HUB_X = 560;
const HUB_Y = H / 2;

type Node = { label: string; sub: string; y: number };

const INPUTS: Node[] = [
  { label: "Telefon", sub: "po godzinach", y: 66 },
  { label: "E-mail", sub: "zapytanie ofertowe", y: 176 },
  { label: "Formularz", sub: "ze strony", y: 286 },
  { label: "WhatsApp", sub: "i Messenger", y: 396 },
];

const OUTPUTS: Node[] = [
  { label: "CRM", sub: "lead z pełnym kontekstem", y: 120 },
  { label: "Kalendarz", sub: "termin potwierdzony", y: 230 },
  { label: "Zespół", sub: "tylko to, co wymaga człowieka", y: 340 },
];

/** Cubic that leaves the node horizontally and arrives at the hub horizontally. */
function link(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) * 0.55;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export default function SystemThread() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      tl.from("[data-thread]", {
        drawSVG: "0%",
        duration: 1.15,
        ease: "power2.inOut",
        stagger: 0.07,
      })
        .from(
          "[data-node]",
          { opacity: 0, x: (i) => (i < INPUTS.length ? -14 : 14), duration: 0.5, stagger: 0.05 },
          "-=0.75",
        )
        .from("[data-hub]", { scale: 0.9, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.5")
        // Pulses only start once the line exists — a packet travelling down a
        // path that hasn't been drawn yet reads as a glitch.
        .set("[data-pulse]", { opacity: 1 });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <section ref={root} className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-6">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--p-muted)]">
          Co się dzieje z zapytaniem
        </p>
        <h2 className="max-w-[19ch] text-balance text-[clamp(2rem,5vw,3.9rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[color:var(--p-ink)] [font-family:var(--font-display)]">
          Jedna linia od pytania do terminu w kalendarzu.
        </h2>
        <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-[color:var(--p-muted)]">
          Nic nie czeka na poniedziałek i nic nie ginie między skrzynką a CRM-em.
          Asystent odbiera, kwalifikuje i przekazuje dalej — a Wy dostajecie tylko
          to, przy czym naprawdę jesteście potrzebni.
        </p>

        <div className="mt-16 overflow-x-auto md:mt-20">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full min-w-[860px]"
            role="img"
            aria-label="Zapytania z telefonu, e-maila, formularza i WhatsAppa trafiają do asystenta Couders, który przekazuje je do CRM, kalendarza i zespołu."
          >
            <defs>
              <linearGradient id="pt-thread" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#22E0C8" />
              </linearGradient>
              <filter id="pt-hubglow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="14" result="b" />
                <feColorMatrix
                  in="b"
                  type="matrix"
                  values="0 0 0 0 0.055  0 0 0 0 0.647  0 0 0 0 0.914  0 0 0 0.55 0"
                />
              </filter>
            </defs>

            {INPUTS.map((n, i) => {
              const d = link(228, n.y, HUB_X - 62, HUB_Y);
              return (
                <g key={n.label}>
                  <path
                    data-thread
                    d={d}
                    fill="none"
                    stroke="url(#pt-thread)"
                    strokeWidth="1.25"
                    strokeOpacity="0.5"
                  />
                  <path
                    data-pulse
                    d={d}
                    fill="none"
                    stroke="url(#pt-thread)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0"
                    className="pt-pulse"
                    style={{ animationDelay: `${i * 0.55}s` }}
                  />
                </g>
              );
            })}

            {OUTPUTS.map((n, i) => {
              const d = link(HUB_X + 62, HUB_Y, W - 232, n.y);
              return (
                <g key={n.label}>
                  <path
                    data-thread
                    d={d}
                    fill="none"
                    stroke="url(#pt-thread)"
                    strokeWidth="1.25"
                    strokeOpacity="0.5"
                  />
                  <path
                    data-pulse
                    d={d}
                    fill="none"
                    stroke="url(#pt-thread)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0"
                    className="pt-pulse"
                    style={{ animationDelay: `${1.1 + i * 0.55}s` }}
                  />
                </g>
              );
            })}

            {INPUTS.map((n) => (
              <g key={n.label} data-node transform={`translate(0 ${n.y})`}>
                <text
                  x="212"
                  y="-3"
                  textAnchor="end"
                  className="fill-[color:var(--p-ink)] text-[16px] font-medium [font-family:var(--font-display)]"
                >
                  {n.label}
                </text>
                <text
                  x="212"
                  y="16"
                  textAnchor="end"
                  className="fill-[color:var(--p-muted)] text-[12px] [font-family:var(--font-mono)]"
                >
                  {n.sub}
                </text>
                <circle cx="224" cy="0" r="2.5" className="fill-[#0EA5E9]" />
              </g>
            ))}

            {OUTPUTS.map((n) => (
              <g key={n.label} data-node transform={`translate(0 ${n.y})`}>
                <circle cx={W - 228} cy="0" r="2.5" className="fill-[#22E0C8]" />
                <text
                  x={W - 216}
                  y="-3"
                  className="fill-[color:var(--p-ink)] text-[16px] font-medium [font-family:var(--font-display)]"
                >
                  {n.label}
                </text>
                <text
                  x={W - 216}
                  y="16"
                  className="fill-[color:var(--p-muted)] text-[12px] [font-family:var(--font-mono)]"
                >
                  {n.sub}
                </text>
              </g>
            ))}

            <g data-hub>
              <circle cx={HUB_X} cy={HUB_Y} r="46" filter="url(#pt-hubglow)" />
              <circle
                cx={HUB_X}
                cy={HUB_Y}
                r="58"
                className="fill-[color:var(--p-paper)]"
                stroke="url(#pt-thread)"
                strokeWidth="1.25"
              />
              <text
                x={HUB_X}
                y={HUB_Y - 2}
                textAnchor="middle"
                className="fill-[color:var(--p-ink)] text-[19px] [font-family:var(--font-mark)]"
              >
                Couders
              </text>
              <text
                x={HUB_X}
                y={HUB_Y + 16}
                textAnchor="middle"
                className="fill-[color:var(--p-muted)] text-[9.5px] uppercase tracking-[0.18em] [font-family:var(--font-mono)]"
              >
                24/7
              </text>
            </g>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .pt-pulse {
          stroke-dasharray: 26 1000;
          stroke-dashoffset: 1026;
          animation: pt-travel 2.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        @keyframes pt-travel {
          0% {
            stroke-dashoffset: 1026;
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          72% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pt-pulse {
            animation: none;
            opacity: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
