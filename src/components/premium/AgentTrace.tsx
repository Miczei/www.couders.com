"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GlassStage from "./GlassStage";

/**
 * Replay of the assistant handling one real inquiry: the conversation on the
 * left, what it was actually doing between replies on the right.
 *
 * A diagram claims the product works. This shows the work — which is the
 * whole point when what you sell is judgement, not a form.
 *
 * It plays itself once it scrolls into view and never holds the page: a
 * visitor here is checking out a supplier, not admiring a website, and
 * freezing the scroll to make them earn the content costs more than it buys.
 * The replay button covers whoever looked up halfway through.
 *
 * Needs GlassStage.tsx alongside it. Nothing else.
 */

type Step = {
  clock: string;
  label: string;
  detail: string;
  /** Chat message index revealed at this step, if any. */
  reveals?: number;
  /** Seconds to wait before this step. Defaults to the steady tick. */
  gap?: number;
};

/** Steady tick between steps, in seconds. */
const TICK = 0.34;

const STEPS: Step[] = [
  { clock: "22:47:00", label: "Wiadomość przychodzi", detail: "WhatsApp · +48 601 ··· 342", reveals: 0 },
  { clock: "22:47:00", label: "Sprawdzam, kto pisze", detail: "Nowy kontakt — nie ma go w CRM" },
  { clock: "22:47:01", label: "Czytam, o co chodzi", detail: "Wycena wykończenia, 78 m², pod klucz" },
  { clock: "22:47:01", label: "Sięgam po cennik", detail: "Pakiet standard · 1 850 zł/m²" },
  { clock: "22:47:02", label: "Liczę", detail: "78 × 1 850 = 144 300 zł netto" },
  { clock: "22:47:02", label: "Odpisuję", detail: "Widełki + zastrzeżenie, że to szacunek", reveals: 1 },
  { clock: "22:47:03", label: "Zaglądam do kalendarza", detail: "Wolne pomiary: czw 10:00, pt 14:30" },
  { clock: "22:47:03", label: "Proponuję dwa terminy", detail: "Zawsze dwa — jeden to ultimatum", reveals: 2 },
  // Four real minutes pass here while the client decides. Holding the replay
  // for a beat is the only way that gap is legible at all.
  { clock: "22:51:18", label: "Klient wybiera", detail: "Czwartek, 10:00", reveals: 3, gap: 1.15 },
  { clock: "22:51:19", label: "Rezerwuję termin", detail: "Kalendarz zespołu · pomiar 78 m²", reveals: 4 },
  { clock: "22:51:19", label: "Zakładam lead w CRM", detail: "Transkrypt, wycena, adres, źródło" },
  { clock: "22:51:20", label: "Budzę zespół rano, nie teraz", detail: "Powiadomienie zaplanowane na 8:00" },
];

type Msg = { from: "client" | "agent"; text: string; time: string };

const CHAT: Msg[] = [
  {
    from: "client",
    time: "22:47",
    text: "Dzień dobry, ile kosztuje wykończenie mieszkania 78 m² pod klucz?",
  },
  {
    from: "agent",
    time: "22:47",
    text: "Dobry wieczór. Przy 78 m² w pakiecie standard to orientacyjnie 144 300 zł netto. Dokładna wycena po pomiarze — czasem schodzi niżej, przy nietypowym układzie potrafi wyjść drożej.",
  },
  {
    from: "agent",
    time: "22:47",
    text: "Pomiar jest bezpłatny. Pasuje czwartek 10:00 czy piątek 14:30?",
  },
  { from: "client", time: "22:51", text: "Czwartek" },
  {
    from: "agent",
    time: "22:51",
    text: "Zapisane — czwartek 10:00. Potwierdzenie wysłałem SMS-em. Do zobaczenia.",
  },
];

// Overshoots a little and settles fast, the way a message lands in WhatsApp.
// Growing from the sending corner rather than the centre is what sells it —
// the bubble comes out of its own tail instead of inflating in place.
const POP = { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.85 };

export default function AgentTrace({
  /** Freeze the replay at a fixed point, 0..1. Leave undefined in production. */
  debugProgress,
}: {
  debugProgress?: number;
} = {}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const frozen = debugProgress !== undefined;
  const [active, setActive] = useState(
    frozen
      ? Math.round(debugProgress! * (STEPS.length - 1))
      : reduced
        ? STEPS.length - 1
        : -1,
  );
  const [done, setDone] = useState(frozen || !!reduced);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const play = useCallback(() => {
    tl.current?.kill();
    setActive(-1);
    setDone(false);
    const t = gsap.timeline({ onComplete: () => setDone(true) });
    STEPS.forEach((s, i) => {
      t.call(() => setActive(i), undefined, `+=${i === 0 ? 0.25 : (s.gap ?? TICK)}`);
    });
    t.to({}, { duration: 0.5 });
    tl.current = t;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced || frozen) return;

    const ctx = gsap.context(() => {
      // Fires once the section is properly in frame, not the instant its top
      // edge clips the viewport — otherwise it plays out above the fold and
      // the visitor arrives to a finished still.
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
  }, [reduced, frozen, play]);

  const visible = CHAT.map((m, mi) => ({ ...m, mi })).filter((m) =>
    STEPS.some((s, si) => s.reveals === m.mi && si <= active),
  );

  // Dots appear on the step *before* an agent reply lands, which is exactly
  // where a person would see them in a real thread.
  const next = STEPS[active + 1];
  const typing =
    !reduced &&
    active >= 0 &&
    next?.reveals !== undefined &&
    CHAT[next.reveals].from === "agent";

  const clock = active >= 0 ? STEPS[active].clock : "22:46:59";

  return (
    <section
      ref={root}
      className="relative bg-white py-24 text-[#0b0b0c] md:py-32"
      aria-label="Zapis obsługi jednego zapytania"
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Wtorek, 22:47 — biuro zamknięte od pięciu godzin
        </p>
        <h2
          className="mt-4 max-w-[20ch] text-balance text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Zobaczcie, co robi między jedną a drugą odpowiedzią.
        </h2>
      </div>

      <div className="mt-12 px-6">
        <GlassStage
          label="Jedno zapytanie, od początku do końca"
          status={
            <span className="font-mono text-[13px] font-medium tabular-nums tracking-tight text-[#0b0b0c]">
              {clock}
            </span>
          }
        >
          <div className="grid gap-px bg-black/[0.06] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            {/* ---------- conversation ---------- */}
            <div className="bg-[#FBFBFB] p-5 sm:p-7">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22E0C8]" />
                <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-400">
                  WhatsApp Business · +48 601 ··· 342
                </span>
              </div>

              <div className="flex min-h-[300px] flex-col justify-end gap-2.5">
                <AnimatePresence initial={false}>
                  {visible.length === 0 && (
                    <motion.p
                      key="idle"
                      exit={{ opacity: 0 }}
                      className="my-auto text-center text-[13.5px] text-slate-400"
                    >
                      Wtorek wieczorem. Zaraz przyjdzie wiadomość.
                    </motion.p>
                  )}

                  {visible.map((m) => (
                    <motion.div
                      key={m.mi}
                      layout
                      initial={reduced ? false : { opacity: 0, scale: 0.68, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={POP}
                      style={{
                        transformOrigin: m.from === "client" ? "bottom left" : "bottom right",
                      }}
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed ${
                        m.from === "client"
                          ? "self-start rounded-bl-md bg-white text-[#0b0b0c] ring-1 ring-black/[0.07]"
                          : "self-end rounded-br-md bg-[#0b0b0c] text-white"
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`mt-1 block font-mono text-[10px] tabular-nums ${
                          m.from === "client" ? "text-slate-400" : "text-white/45"
                        }`}
                      >
                        {m.time}
                      </span>
                    </motion.div>
                  ))}

                  {typing && (
                    <motion.div
                      key="typing"
                      layout
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.12 } }}
                      transition={POP}
                      style={{ transformOrigin: "bottom right" }}
                      className="flex items-center gap-1 self-end rounded-2xl rounded-br-md bg-[#0b0b0c] px-3.5 py-3"
                      aria-label="Asystent pisze"
                    >
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="block h-1.5 w-1.5 rounded-full bg-white/70"
                          animate={{ y: [0, -3.5, 0], opacity: [0.45, 1, 0.45] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: d * 0.14,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ---------- what it was doing ---------- */}
            <div className="bg-white p-5 sm:p-7">
              <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
                Ślad pracy asystenta
              </p>

              <ol className="relative flex flex-col">
                {/* The rail every step hangs off. It fills to the current step
                    rather than animating separately, so the two can't drift. */}
                <span
                  aria-hidden="true"
                  className="absolute left-[5px] top-2 w-px bg-black/[0.08]"
                  style={{ height: "calc(100% - 1rem)" }}
                />
                <span
                  aria-hidden="true"
                  className="absolute left-[5px] top-2 w-px bg-gradient-to-b from-[#0EA5E9] to-[#22E0C8] transition-[height] duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    height: `calc(${Math.max(0, (active + 1) / STEPS.length) * 100}% - 1rem)`,
                  }}
                />

                {STEPS.map((s, i) => {
                  const stepDone = i <= active;
                  const current = i === active;
                  return (
                    <li
                      key={s.label}
                      className="relative grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 py-[5px] transition-opacity duration-300 motion-reduce:transition-none"
                      style={{ opacity: stepDone ? 1 : 0.28 }}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-[6px] h-[11px] w-[11px] rounded-full border-2 transition-colors duration-300 motion-reduce:transition-none ${
                          current
                            ? "border-[#0EA5E9] bg-white"
                            : stepDone
                              ? "border-transparent bg-[#22E0C8]"
                              : "border-black/15 bg-white"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium leading-snug">{s.label}</p>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </GlassStage>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap items-end justify-between gap-6 px-6">
        <p className="max-w-[58ch] text-[15px] leading-relaxed text-slate-500">
          Dwanaście decyzji w trzy sekundy, o 22:47, bez nikogo przy biurku. Rano
          zespół nie dostaje nieodebranego połączenia, tylko umówiony pomiar
          i lead z pełnym kontekstem.
        </p>

        {!reduced && (
          <button
            type="button"
            onClick={play}
            // Held out of the tab order and hidden from the reader until the
            // replay ends: offering "again" over something still running is
            // just noise.
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
              <path d="M13.2 1.6v3.1h-3.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Odtwórz jeszcze raz
          </button>
        )}
      </div>
    </section>
  );
}
