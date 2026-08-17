"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Scroll-scrubbed replay of the assistant handling one real inquiry: the
 * conversation on the left, what it was actually doing between replies on the
 * right.
 *
 * A diagram claims the product works. This shows the work — which is the
 * whole point when what you sell is judgement, not a form. Scroll is the
 * transport: the visitor sets the pace, so a skimmer gets the shape in two
 * seconds and someone evaluating you can stop on any single step.
 *
 * Self-contained: no page-level CSS, no shared state, its own fonts inherited
 * from wherever it's dropped. Paste the file in, render <AgentTrace />.
 */

type Step = {
  clock: string;
  label: string;
  detail: string;
  /** Chat message index revealed at this step, if any. */
  reveals?: number;
};

const STEPS: Step[] = [
  { clock: "22:47:00", label: "Wiadomość przychodzi", detail: "WhatsApp · +48 601 ··· 342", reveals: 0 },
  { clock: "22:47:00", label: "Sprawdzam, kto pisze", detail: "Nowy kontakt — nie ma go w CRM" },
  { clock: "22:47:01", label: "Czytam, o co chodzi", detail: "Wycena wykończenia, 78 m², pod klucz" },
  { clock: "22:47:01", label: "Sięgam po cennik", detail: "Pakiet standard · 1 850 zł/m²" },
  { clock: "22:47:02", label: "Liczę", detail: "78 × 1 850 = 144 300 zł netto" },
  { clock: "22:47:02", label: "Odpisuję", detail: "Widełki + zastrzeżenie, że to szacunek", reveals: 1 },
  { clock: "22:47:03", label: "Zaglądam do kalendarza", detail: "Wolne pomiary: czw 10:00, pt 14:30" },
  { clock: "22:47:03", label: "Proponuję dwa terminy", detail: "Zawsze dwa — jeden to ultimatum", reveals: 2 },
  { clock: "22:51:18", label: "Klient wybiera", detail: "Czwartek, 10:00", reveals: 3 },
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

export default function AgentTrace({
  /**
   * Freeze the replay at a fixed point, 0..1. Same idea as FluidMorph's
   * `debugProgress`: lets a single step be inspected without fighting the
   * scrub. Leave undefined in production.
   */
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

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced || frozen) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Pinning a tall two-column layout on a phone traps the reader, so below
      // 900px the section just plays through on entry instead.
      mm.add("(min-width: 900px)", () => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: `+=${STEPS.length * 190}`,
          pin: "[data-stage]",
          scrub: 0.6,
          onUpdate: (self) => {
            const i = Math.floor(self.progress * (STEPS.length + 0.4)) - 1;
            setActive(Math.max(-1, Math.min(STEPS.length - 1, i)));
          },
        });
        return () => st.kill();
      });

      mm.add("(max-width: 899px)", () => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          once: true,
          onEnter: () => {
            let i = -1;
            const tick = () => {
              i += 1;
              setActive(i);
              if (i < STEPS.length - 1) window.setTimeout(tick, 420);
            };
            tick();
          },
        });
        return () => st.kill();
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, frozen]);

  const visibleMsgs = CHAT.filter((_, mi) =>
    STEPS.some((s, si) => s.reveals === mi && si <= active),
  );
  const clock = active >= 0 ? STEPS[active].clock : "22:46:59";

  return (
    <section
      ref={root}
      className="relative bg-white text-[#0b0b0c]"
      aria-label="Zapis obsługi jednego zapytania"
    >
      <div data-stage className="flex min-h-screen items-center py-24">
        <div className="mx-auto w-full max-w-[1240px] px-6">
          <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Wtorek, 22:47 — biuro zamknięte od pięciu godzin
              </p>
              <h2
                className="mt-4 max-w-[20ch] text-balance text-[clamp(1.9rem,4.2vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.035em]"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Zobaczcie, co robi między jedną a drugą odpowiedzią.
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-[clamp(1.6rem,3vw,2.4rem)] font-medium tabular-nums tracking-tight text-[#0b0b0c]">
                {clock}
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
                czas rzeczywisty
              </div>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
            {/* ---------- conversation ---------- */}
            <div className="rounded-2xl border border-black/[0.07] bg-[#FAFAFA] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_24px_48px_-36px_rgba(0,0,0,0.4)] sm:p-7">
              <div className="mb-5 flex items-center gap-2.5 border-b border-black/[0.06] pb-4">
                <span className="h-2 w-2 rounded-full bg-[#22E0C8]" />
                <span className="text-[13px] font-medium">WhatsApp Business</span>
                <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-400">
                  +48 601 ··· 342
                </span>
              </div>

              <div className="flex min-h-[340px] flex-col justify-end gap-3">
                {visibleMsgs.length === 0 && (
                  <p className="my-auto text-center text-[13.5px] text-slate-400">
                    Przewiń, żeby odtworzyć rozmowę.
                  </p>
                )}
                {visibleMsgs.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[86%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${
                      m.from === "client"
                        ? "self-start rounded-bl-md bg-white text-[#0b0b0c] ring-1 ring-black/[0.07]"
                        : "self-end rounded-br-md bg-[#0b0b0c] text-white"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`mt-1.5 block font-mono text-[10px] tabular-nums ${
                        m.from === "client" ? "text-slate-400" : "text-white/45"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- what it was doing ---------- */}
            <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-7">
              <p className="mb-5 border-b border-black/[0.06] pb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
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
                  const done = i <= active;
                  const current = i === active;
                  return (
                    <li
                      key={s.label}
                      className="relative grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 py-[7px] transition-opacity duration-300 motion-reduce:transition-none"
                      style={{ opacity: done ? 1 : 0.28 }}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-[7px] h-[11px] w-[11px] rounded-full border-2 transition-colors duration-300 motion-reduce:transition-none ${
                          current
                            ? "border-[#0EA5E9] bg-white"
                            : done
                              ? "border-transparent bg-[#22E0C8]"
                              : "border-black/15 bg-white"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium leading-snug">{s.label}</p>
                        <p className="mt-0.5 truncate font-mono text-[11.5px] text-slate-500">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <p className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-slate-500">
            Dwanaście decyzji w trzy sekundy, o 22:47, bez nikogo przy biurku. Rano
            zespół nie dostaje nieodebranego połączenia, tylko umówiony pomiar
            i lead z pełnym kontekstem.
          </p>
        </div>
      </div>
    </section>
  );
}
