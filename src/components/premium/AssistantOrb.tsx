"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GlassStage from "./GlassStage";

/**
 * The assistant given a face — a WebGL surface that breathes, leans toward the
 * cursor and swells while it talks, with the transcript running underneath.
 *
 * Every AI company on the internet represents its product with a static icon.
 * A thing that reacts to you before you have clicked anything is the cheapest
 * honest signal that there is a live system behind the page rather than a
 * contact form with a robot drawn on it.
 *
 * The canvas is loaded ssr:false behind a plain gradient, so nothing here can
 * touch first paint. Needs GlassStage.tsx and OrbCanvas.tsx.
 */

const OrbCanvas = dynamic(() => import("./OrbCanvas"), {
  ssr: false,
  loading: () => null,
});

type Line = { text: string; hold: number };

const SCRIPT: Line[] = [
  { text: "Słucham. Pytanie z formularza, 23:41.", hold: 2.6 },
  { text: "Klient pyta o gwarancję na wykończenie.", hold: 2.8 },
  { text: "Sprawdzam warunki — pięć lat na prace, dwa na materiały.", hold: 3.4 },
  { text: "Odpisuję i proponuję rozmowę w czwartek.", hold: 3.0 },
  { text: "Gotowe. Lead czeka rano w CRM.", hold: 2.8 },
];

const BARS = 28;

export default function AssistantOrb() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [line, setLine] = useState(reduced ? SCRIPT.length - 1 : -1);
  const [speaking, setSpeaking] = useState(false);
  const [running, setRunning] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    tl.current?.kill();
    setRunning(true);
    setLine(-1);
    const t = gsap.timeline({
      onComplete: () => {
        setSpeaking(false);
        setRunning(false);
      },
    });
    SCRIPT.forEach((l, i) => {
      t.call(
        () => {
          setLine(i);
          setSpeaking(true);
        },
        undefined,
        `+=${i === 0 ? 0.4 : 0.45}`,
      );
      // The pause between lines is where the surface settles — without it the
      // orb sits at one amplitude and stops reading as speech.
      t.call(() => setSpeaking(false), undefined, `+=${l.hold}`);
    });
    tl.current = t;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
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
      tl.current?.kill();
      tl.current = null;
    };
  }, [reduced, play]);

  // Pause the whole thing when the tab goes away. A shader plus a running
  // timeline in a background tab is nothing but battery.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) tl.current?.pause();
      else tl.current?.resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <section
      ref={root}
      className="relative bg-white py-24 text-[#0b0b0c] md:py-32"
      aria-label="Asystent w trakcie pracy"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Asystent · stan na żywo
        </p>
        <h2
          className="mt-4 max-w-[18ch] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Nie ikonka czatu. Coś, co słucha.
        </h2>
      </div>

      <div className="mt-12 px-6">
        <GlassStage dark>
          <div className="relative bg-[#07090D]">
            <div
              className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}
            >
              <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/45">
                Couders · nasłuch na czterech kanałach
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <motion.span
                  className="block h-1.5 w-1.5 rounded-full bg-[#22E0C8]"
                  animate={reduced ? {} : { opacity: [1, 0.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#22E0C8]">
                  {speaking ? "mówi" : running ? "myśli" : "czuwa"}
                </span>
              </span>
            </div>

            <div className="relative h-[340px] sm:h-[400px]">
              {/* Static ground under the canvas — if WebGL is unavailable or
                  still loading, this is what the visitor sees, and it is not
                  an empty black hole. */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(46% 46% at 50% 48%, rgba(14,165,233,0.20), transparent 70%), radial-gradient(30% 30% at 58% 60%, rgba(34,224,200,0.16), transparent 70%)",
                }}
              />
              <div className="absolute inset-0">
                <OrbCanvas speaking={speaking} still={!!reduced} />
              </div>
            </div>

            {/* ---------- transcript + level ---------- */}
            <div
              className="px-5 pb-7 pt-1 sm:px-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="flex h-10 items-center justify-center gap-[3px]"
                aria-hidden="true"
              >
                {Array.from({ length: BARS }).map((_, i) => {
                  // A fixed pseudo-random profile per bar keeps the waveform
                  // from looking like an equaliser test pattern.
                  const seed = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
                  const peak = 6 + seed * 22;
                  return (
                    <motion.span
                      key={i}
                      className="block w-[2px] rounded-full bg-[#22E0C8]"
                      animate={
                        speaking && !reduced
                          ? { height: [3, peak, 5, peak * 0.7, 3], opacity: 0.9 }
                          : { height: 3, opacity: 0.28 }
                      }
                      transition={
                        speaking && !reduced
                          ? {
                              duration: 0.6 + seed * 0.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.015,
                            }
                          : { duration: 0.35 }
                      }
                    />
                  );
                })}
              </div>

              <div className="mt-3 flex min-h-[3.2em] items-start justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={line}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[46ch] text-center text-[15.5px] leading-relaxed text-white/85"
                  >
                    {line >= 0 ? SCRIPT[line].text : "Czuwa. Cztery kanały otwarte."}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </GlassStage>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap items-end justify-between gap-6 px-6">
        <p className="max-w-[58ch] text-[15px] leading-relaxed text-slate-500">
          Ruszcie myszką nad kulą — pochyli się w Waszą stronę. To ta sama
          zasada, na której stoi cały produkt: system reaguje, zanim ktokolwiek
          o cokolwiek poprosi.
        </p>

        {!reduced && (
          <button
            type="button"
            onClick={play}
            aria-hidden={running}
            tabIndex={running ? -1 : 0}
            className={`group flex shrink-0 items-center gap-2.5 rounded-full border border-black/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 transition-all duration-500 hover:border-black/25 hover:text-[#0b0b0c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] motion-reduce:transition-none ${
              running ? "pointer-events-none opacity-0" : "opacity-100"
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
              <path d="M13.2 1.6v3.1h-3.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Odtwórz jeszcze raz
          </button>
        )}
      </div>
    </section>
  );
}
