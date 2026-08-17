"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GlassStage from "./GlassStage";

/**
 * Sixteen hours of a closed office, as a time-lapse — inside a window, not
 * across the whole page.
 *
 * "24/7" and "68% zapytań po godzinach" are numbers nobody feels. Here the
 * clock runs from 17:00 to 09:00, the room actually goes dark, and every
 * inquiry that lands is stamped either handled-now or would-have-waited. The
 * argument is made by the gap between the two counters, not by a claim.
 *
 * Framed rather than full-bleed on purpose: run the night edge to edge and the
 * eye lands on the seam where the dark band stops instead of on the night. In
 * a window the site stays white and the dark is something you look into.
 *
 * Needs GlassStage.tsx alongside it. Nothing else.
 */

/** Seconds the whole night takes to play. */
const RUN = 9.5;

type Inquiry = {
  /** Minutes past 17:00. The window is 16h = 960 min. */
  at: number;
  time: string;
  channel: string;
  text: string;
  /** Needed a human either way — kept so the section isn't overselling. */
  human?: boolean;
};

const SPAN = 960;

const INQUIRIES: Inquiry[] = [
  {
    at: 42,
    time: "17:42",
    channel: "Formularz",
    text: "Prośba o wycenę, 54 m²",
  },
  {
    at: 96,
    time: "18:36",
    channel: "WhatsApp",
    text: "Czy robicie też instalacje?",
  },
  {
    at: 158,
    time: "19:38",
    channel: "Telefon",
    text: "Nieodebrane — oddzwonienie",
  },
  {
    at: 205,
    time: "20:25",
    channel: "E-mail",
    text: "Zapytanie ofertowe, 3 lokale",
    human: true,
  },
  {
    at: 287,
    time: "21:47",
    channel: "WhatsApp",
    text: "Termin pomiaru na przyszły tydzień",
  },
  {
    at: 347,
    time: "22:47",
    channel: "WhatsApp",
    text: "Wykończenie 78 m² pod klucz",
  },
  { at: 401, time: "23:41", channel: "Formularz", text: "Pytanie o gwarancję" },
  {
    at: 512,
    time: "01:32",
    channel: "E-mail",
    text: "Reklamacja — pilne",
    human: true,
  },
  { at: 604, time: "03:04", channel: "Formularz", text: "Prośba o katalog" },
  {
    at: 733,
    time: "05:13",
    channel: "WhatsApp",
    text: "Czy pracujecie w soboty?",
  },
  {
    at: 795,
    time: "06:15",
    channel: "Telefon",
    text: "Nieodebrane — oddzwonienie",
  },
  { at: 868, time: "07:28", channel: "E-mail", text: "Potwierdzenie terminu" },
];

/** 0 at 17:00 → 1 at 09:00. Dusk lands ~19:30, dawn ~06:00. */
function skyAt(p: number) {
  const dusk = 0.16;
  const dawn = 0.82;
  let night: number;
  if (p < dusk) night = p / dusk;
  else if (p > dawn) night = 1 - (p - dawn) / (1 - dawn);
  else night = 1;
  const n = Math.max(0, Math.min(1, night));
  const top = mix([252, 252, 251], [11, 16, 26], n);
  const bottom = mix([246, 247, 248], [22, 30, 44], n);
  return { n, top, bottom };
}

function mix(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function rgb(c: number[]) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function clockAt(p: number) {
  const mins = Math.round(p * SPAN);
  const h = Math.floor((17 * 60 + mins) / 60) % 24;
  const m = (17 * 60 + mins) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function NightShift({
  /** Freeze the night at a fixed point, 0..1. Leave undefined in production. */
  debugProgress,
}: {
  debugProgress?: number;
} = {}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const frozen = debugProgress !== undefined;
  const [p, setP] = useState(frozen ? debugProgress! : reduced ? 1 : 0);
  const [done, setDone] = useState(frozen || !!reduced);
  const tween = useRef<gsap.core.Tween | null>(null);

  const play = useCallback(() => {
    tween.current?.kill();
    setDone(false);
    const clock = { v: 0 };
    setP(0);
    tween.current = gsap.to(clock, {
      v: 1,
      duration: RUN,
      // Linear on purpose: this is a clock. Easing the small hours would be a
      // lie about when the messages actually landed.
      ease: "none",
      onUpdate: () => setP(clock.v),
      onComplete: () => setDone(true),
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced || frozen) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 68%",
        once: true,
        onEnter: play,
      });
      return () => st.kill();
    }, el);

    return () => {
      ctx.revert();
      tween.current?.kill();
      tween.current = null;
    };
  }, [reduced, frozen, play]);

  const sky = useMemo(() => skyAt(p), [p]);
  const landed = INQUIRIES.filter((q) => q.at / SPAN <= p);
  const handled = landed.filter((q) => !q.human).length;
  // Counting inquiries either way gives 6 against 7, which reads as "the
  // assistant saved one message" — the opposite of the point. What actually
  // differs is the waiting: without anyone on shift every one of these sits
  // untouched until the office opens, and that time adds up fast.
  const waitMinutes = landed.reduce((sum, q) => sum + (SPAN - q.at), 0);
  const waitLabel =
    waitMinutes >= 60
      ? `${Math.floor(waitMinutes / 60)} h`
      : `${waitMinutes} min`;
  const onNight = sky.n > 0.45;
  const ink = onNight ? "#F2F5F8" : "#0b0b0c";
  const dim = onNight ? "rgba(242,245,248,0.52)" : "rgba(11,12,12,0.5)";

  return (
    <section
      ref={root}
      className="relative bg-white py-24 text-[#0b0b0c] md:py-32"
      aria-label="Zapytania w godzinach zamknięcia biura"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Jedna doba · biuro czynne 8:00–17:00
        </p>
        <h2
          className="mt-4 max-w-[19ch] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Klienci nie przestają pisać, kiedy gasicie światło.
        </h2>
      </div>

      <div className="mt-12 px-6">
        {/* No label/status on the stage itself: its rail sits above the
            gradient, so light-on-light at dusk and dark-on-dark at 3am. The
            header lives inside the night instead, where it can take the same
            colours as everything else that changes with the hour. */}
        <GlassStage dark={onNight}>
          <div
            className="relative overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${rgb(sky.top)} 0%, ${rgb(sky.bottom)} 100%)`,
              color: ink,
            }}
          >
            <div
              className="relative flex items-center justify-between gap-4 px-5 py-3 sm:px-8"
              style={{
                borderBottom: `1px solid ${onNight ? "rgba(255,255,255,0.12)" : "rgba(11,12,12,0.08)"}`,
              }}
            >
              <span
                className="truncate font-mono text-[10.5px] uppercase tracking-[0.2em]"
                style={{ color: dim }}
              >
                17:00 → 09:00, szesnaście godzin w dziesięć sekund
              </span>
              <span
                className="shrink-0 font-mono text-[15px] font-medium tabular-nums tracking-tight"
                style={{ color: ink }}
              >
                {clockAt(p)}
              </span>
            </div>

            <div className="relative px-5 py-8 sm:px-8 sm:py-10">
              {/* Stars fade in with the dark, never on their own timer. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  opacity: Math.max(0, sky.n - 0.55) * 2.2,
                  backgroundImage:
                    "radial-gradient(1.2px 1.2px at 14% 22%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 68% 14%, rgba(255,255,255,0.8), transparent), radial-gradient(1.4px 1.4px at 82% 34%, rgba(255,255,255,0.75), transparent), radial-gradient(1px 1px at 32% 12%, rgba(255,255,255,0.65), transparent), radial-gradient(1px 1px at 52% 28%, rgba(255,255,255,0.6), transparent), radial-gradient(1.2px 1.2px at 91% 18%, rgba(255,255,255,0.7), transparent)",
                }}
              />

              <div className="relative">
                {/* ---------- phones: the rail as a stack ----------
                  Twelve absolutely-positioned cards across 340px of rail is an
                  unreadable pile, so narrow screens get the same events as a
                  list that grows from the top instead. */}
                <ul className="flex flex-col gap-2 md:hidden">
                  {landed
                    .slice(-4)
                    .reverse()
                    .map((q) => (
                      <li
                        key={q.time + q.text}
                        className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                        style={{
                          background: onNight
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(11,12,12,0.03)",
                          boxShadow: onNight
                            ? "inset 0 0 0 1px rgba(255,255,255,0.09)"
                            : "inset 0 0 0 1px rgba(11,12,12,0.07)",
                        }}
                      >
                        <span className="mt-px font-mono text-[11px] tabular-nums">
                          {q.time}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] leading-snug">
                            {q.text}
                          </span>
                          <span
                            className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.12em]"
                            style={{ color: q.human ? "#F0B45E" : "#22E0C8" }}
                          >
                            {q.channel} ·{" "}
                            {q.human ? "do człowieka" : "obsłużone"}
                          </span>
                        </span>
                      </li>
                    ))}
                  {landed.length > 4 && (
                    <li
                      className="pl-1 font-mono text-[10.5px] uppercase tracking-[0.16em]"
                      style={{ color: dim }}
                    >
                      + {landed.length - 4} wcześniej tej nocy
                    </li>
                  )}
                  {landed.length === 0 && (
                    <li
                      className="font-mono text-[10.5px] uppercase tracking-[0.16em]"
                      style={{ color: dim }}
                    >
                      Biuro właśnie się zamknęło.
                    </li>
                  )}
                </ul>

                {/* ---------- the night, as one rail ---------- */}
                <div className="relative hidden h-[186px] md:block">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[84px] h-px"
                    style={{
                      background: onNight
                        ? "rgba(255,255,255,0.16)"
                        : "rgba(0,0,0,0.12)",
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-[84px] h-px bg-gradient-to-r from-[#0EA5E9] to-[#22E0C8]"
                    style={{ width: `${p * 100}%` }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute top-[70px] h-[29px] w-px"
                    style={{ left: `${p * 100}%`, background: "#22E0C8" }}
                  />

                  {INQUIRIES.map((q, i) => {
                    const x = q.at / SPAN;
                    const shown = x <= p;
                    const fresh = shown && p - x < 0.045;
                    const up = i % 2 === 0;
                    return (
                      <div
                        key={q.time + q.text}
                        className="absolute w-[132px] -translate-x-1/2 transition-all duration-500 ease-out motion-reduce:transition-none"
                        style={{
                          left: `${x * 100}%`,
                          top: up ? 0 : 106,
                          opacity: shown ? 1 : 0,
                          transform: `translateX(-50%) translateY(${shown ? 0 : up ? 10 : -10}px)`,
                        }}
                      >
                        <div
                          className="rounded-lg px-2.5 py-2 text-left"
                          style={{
                            background: onNight
                              ? "rgba(255,255,255,0.07)"
                              : "rgba(11,12,12,0.035)",
                            boxShadow: fresh
                              ? "0 0 0 1px rgba(34,224,200,0.7), 0 0 22px -4px rgba(34,224,200,0.6)"
                              : onNight
                                ? "inset 0 0 0 1px rgba(255,255,255,0.10)"
                                : "inset 0 0 0 1px rgba(11,12,12,0.07)",
                          }}
                        >
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-[10.5px] tabular-nums">
                              {q.time}
                            </span>
                            <span
                              className="truncate font-mono text-[9.5px] uppercase tracking-[0.12em]"
                              style={{ color: dim }}
                            >
                              {q.channel}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug">
                            {q.text}
                          </p>
                          <p
                            className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em]"
                            style={{ color: q.human ? "#F0B45E" : "#22E0C8" }}
                          >
                            {q.human ? "→ do człowieka" : "obsłużone"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ---------- the two counters ---------- */}
                <div
                  className="mt-10 grid gap-8 border-t pt-7 sm:grid-cols-2"
                  style={{
                    borderColor: onNight
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(11,12,12,0.10)",
                  }}
                >
                  <div>
                    <div className="font-mono text-[clamp(2rem,4vw,3rem)] font-medium tabular-nums leading-none text-[#22E0C8]">
                      {String(handled).padStart(2, "0")}
                    </div>
                    <p className="mt-3 text-[14px] font-medium">
                      Załatwione, zanim ktokolwiek wstał
                    </p>
                    <p
                      className="mt-1 text-[13px] leading-relaxed"
                      style={{ color: dim }}
                    >
                      Odpowiedź, wycena, termin. Rano tylko do zatwierdzenia.
                    </p>
                  </div>
                  <div>
                    <div
                      className="font-mono text-[clamp(2rem,4vw,3rem)] font-medium tabular-nums leading-none"
                      style={{
                        color: onNight
                          ? "rgba(242,245,248,0.38)"
                          : "rgba(11,12,12,0.32)",
                      }}
                    >
                      {waitLabel}
                    </div>
                    <p className="mt-3 text-[14px] font-medium">
                      Tyle łącznie czekaliby, gdyby nie było nikogo
                    </p>
                    <p
                      className="mt-1 text-[13px] leading-relaxed"
                      style={{ color: dim }}
                    >
                      Każde z tych zapytań leżałoby do otwarcia biura.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassStage>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap items-end justify-between gap-6 px-6">
        <p className="max-w-[58ch] text-[15px] leading-relaxed text-slate-500">
          Sześćdziesiąt osiem procent zapytań przychodzi wtedy, gdy nikogo nie
          ma. Tyle ciszy wystarczy, żeby ktoś w międzyczasie napisał gdzie
          indziej.
        </p>

        {!reduced && (
          <button
            type="button"
            onClick={play}
            aria-hidden={!done}
            tabIndex={done ? 0 : -1}
            className={`group flex shrink-0 items-center gap-2.5 rounded-full border border-black/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 transition-all duration-500 hover:border-black/25 hover:text-[#0b0b0c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none ${
              done ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97" strokeLinecap="round" />
              <path
                d="M13.2 1.6v3.1h-3.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Odtwórz noc jeszcze raz
          </button>
        )}
      </div>
    </section>
  );
}
