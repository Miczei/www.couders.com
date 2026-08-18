"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSpotlight } from "@/components/ui/SpotlightCard";
import DemoChat from "./demos/DemoChat";
import DemoCall from "./demos/DemoCall";
import DemoFunnel from "./demos/DemoFunnel";
import DemoOffer from "./demos/DemoOffer";

/**
 * "Trzy sposoby, jak to działa" grown into the thing it was pointing at.
 *
 * The live section already had the right surface — frosted white cards, sky
 * spotlight tracking the cursor, lift on hover — but every card ended at a
 * "Poznaj szczegóły" link, so the page had to hand the reader off to another
 * route before it had shown them anything. Here the card is a switch: pick one
 * and its agent plays a short replay of a real shift underneath.
 *
 * Four cards, not three. The phone receptionist is a service Couders actually
 * sells and it appears in neither the site nor the offer PDF, which means the
 * one agent that answers at 21:40 on a Saturday is currently invisible to
 * buyers.
 *
 * Each agent gets its own animation rather than a shared timeline template.
 * Four services that work in genuinely different ways cannot all be a list of
 * timestamps lighting up — the chat converses, the phone rings and settles,
 * the qualifier throws leads into two piles, the generator builds a document.
 * The motion is the explanation.
 *
 * Self-contained apart from useSpotlight, which is the site's own hook and is
 * what keeps the glow identical to the live cards.
 */

type Agent = {
  no: string;
  title: string;
  teaser: string;
  /** Headline over the replay — the argument this agent makes. */
  claim: string;
  Demo: () => React.JSX.Element;
};

const AGENTS: Agent[] = [
  {
    no: "01",
    title: "Firmowy Asystent Sprzedaży",
    teaser: "Zna katalog i cennik. Zbiera leady, gdy Ty śpisz.",
    claim: "Zobaczcie, co robi między jedną a drugą odpowiedzią.",
    Demo: DemoChat,
  },
  {
    no: "02",
    title: "Recepcjonista AI przez telefon",
    teaser: "Odbiera wieczorami, w nocy i w weekendy. Nikt nie słyszy sygnału w pustkę.",
    claim: "Telefon dzwoni o 21:40 w sobotę. Ktoś odbiera.",
    Demo: DemoCall,
  },
  {
    no: "03",
    title: "Błyskawiczny Kwalifikator Leadów",
    teaser: "Odzywa się do leadów z reklam w minutę. Odsiewa ciekawskich.",
    claim: "Pięć zgłoszeń z reklamy. Dwa warte telefonu.",
    Demo: DemoFunnel,
  },
  {
    no: "04",
    title: "Generator Ofert B2B",
    teaser: "Firmowa oferta PDF u klienta w piętnaście minut po spotkaniu.",
    claim: "Oferta u klienta, zanim ostygnie kawa po spotkaniu.",
    Demo: DemoOffer,
  },
];

function AgentCard({
  agent,
  index,
  active,
  onPick,
}: {
  agent: Agent;
  index: number;
  active: boolean;
  onPick: () => void;
}) {
  const { onMouseMove, glow } = useSpotlight();

  return (
    <motion.button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      // Same frosted surface and sky hover as the live cards — this has to read
      // as the section that is already there, not a visitor from another page.
      className={`group relative h-full overflow-hidden rounded-[2rem] border bg-white/60 p-6 text-left backdrop-blur-xl transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 motion-reduce:transition-none ${
        active
          ? "-translate-y-1 border-sky-400/70 shadow-[0_8px_30px_rgb(14,165,233,0.16)]"
          : "border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
      }`}
    >
      {glow}
      <div className="relative flex h-full flex-col">
        <span
          className={`w-fit rounded-md px-2 py-0.5 font-mono text-[10px] tracking-widest transition-colors duration-500 ${
            active ? "bg-sky-500 text-white" : "bg-sky-50 text-sky-600"
          }`}
        >
          {agent.no}
        </span>
        <h3
          className="pt-3 text-[19px] font-bold leading-tight tracking-tight text-slate-900"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {agent.title}
        </h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-600">
          {agent.teaser}
        </p>
        <span
          className={`mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
            active ? "text-sky-600" : "text-slate-400 group-hover:text-sky-500"
          }`}
        >
          {active ? "Pokazane niżej" : "Zobacz jego zmianę"}
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ${active ? "rotate-90" : "group-hover:translate-x-1"}`}
          >
            ➔
          </span>
        </span>
      </div>
    </motion.button>
  );
}

export default function AgentShowcase() {
  const reduced = useReducedMotion();
  const [pick, setPick] = useState(0);
  const agent = AGENTS[pick];

  return (
    <section
      className="relative overflow-hidden bg-white px-5 py-24 sm:px-6 md:py-32"
      aria-label="Agenci Couders"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Produkt
        </p>
        <h2
          className="mt-4 max-w-[18ch] text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-slate-900"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Cztery sposoby, jak to działa.
        </h2>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-slate-600">
          Wybierzcie agenta, a pod spodem odtworzy jedną swoją zmianę. Bez
          przechodzenia na inną stronę.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a, i) => (
            <AgentCard
              key={a.no}
              agent={a}
              index={i}
              active={i === pick}
              onPick={() => setPick(i)}
            />
          ))}
        </div>

        {/* ---------- the replay ---------- */}
        <div className="relative mt-4">
          {/* Notch pointing at the chosen card. Without it the panel reads as a
              separate section that happens to sit below, not as this card's
              contents opening. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 hidden h-4 w-4 rotate-45 rounded-[3px] border-l border-t border-sky-400/70 bg-white/70 backdrop-blur-xl transition-[left] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:block"
            style={{ left: `calc(${(pick + 0.5) * 25}% - 0.5rem)` }}
          />

          <div className="overflow-hidden rounded-[2rem] border border-sky-400/40 bg-white/60 shadow-[0_8px_40px_rgb(14,165,233,0.10)] backdrop-blur-xl">
            <div className="border-b border-slate-200/70 bg-white/40 px-6 py-4 sm:px-8">
              <AnimatePresence initial={false}>
                <motion.h3
                  key={pick}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[30ch] text-balance text-[clamp(1.15rem,2.2vw,1.65rem)] font-bold leading-tight tracking-[-0.025em] text-slate-900"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  {agent.claim}
                </motion.h3>
              </AnimatePresence>
            </div>

            <div className="p-6 sm:p-8">
              <motion.div
                key={pick}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <agent.Demo />
              </motion.div>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-[60ch] text-[14px] leading-relaxed text-slate-500">
          Zapisy są przykładowe. Na wdrożeniu wypełniamy je Waszymi rozmowami,
          Waszym cennikiem i Waszym kalendarzem.
        </p>
      </div>
    </section>
  );
}
