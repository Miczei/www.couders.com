"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useSpotlight } from "@/components/ui/SpotlightCard";
import type { ShowcaseAgent, ShowcaseContent } from "@/i18n/showcase";
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
 * The replay does not start until the cards are actually on screen. Each demo
 * begins its timers on mount, so mounting is what gets gated — a chat that
 * plays out while the visitor is still reading the hero has already finished
 * by the time they arrive, which is worse than no animation at all.
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

function AgentCard({
  agent,
  index,
  active,
  pickLabel,
  pickedLabel,
  onPick,
}: {
  agent: ShowcaseAgent;
  index: number;
  active: boolean;
  pickLabel: string;
  pickedLabel: string;
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
          {active ? pickedLabel : pickLabel}
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

export default function AgentShowcase({ content }: { content: ShowcaseContent }) {
  const reduced = useReducedMotion();
  const [pick, setPick] = useState(0);
  const agent = content.agents[pick];

  const cardsRef = useRef<HTMLDivElement>(null);
  // Fires a little before the cards are fully in frame, so the first bubble
  // lands just as the reader settles on the section rather than after.
  const started = useInView(cardsRef, { once: true, margin: "0px 0px -18% 0px" });

  // Index-keyed rather than named on the content: the copy is translated, the
  // sequence of agents is not something a translator should be able to break.
  const DEMOS = [
    <DemoChat key="chat" c={content.chat} />,
    <DemoCall key="call" c={content.call} />,
    <DemoFunnel key="funnel" c={content.funnel} />,
    <DemoOffer key="offer" c={content.offer} />,
  ];

  return (
    <section
      className="relative overflow-hidden bg-white px-5 py-24 sm:px-6 md:py-32"
      aria-label="Agenci Couders"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          {content.eyebrow}
        </p>
        <h2
          className="mt-4 max-w-[18ch] text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-slate-900"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {content.h2}
        </h2>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-slate-600">
          {content.lead}
        </p>

        <div ref={cardsRef} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.agents.map((a, i) => (
            <AgentCard
              key={a.no}
              agent={a}
              index={i}
              active={i === pick}
              pickLabel={content.pick}
              pickedLabel={content.picked}
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
            style={{ left: `calc(${((pick + 0.5) / content.agents.length) * 100}% - 0.5rem)` }}
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

            {/* min-height reserved so the panel does not jump when the demo
                mounts on scroll-in. */}
            <div className="min-h-[400px] p-6 sm:p-8">
              {started || reduced ? (
                <motion.div
                  key={pick}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {DEMOS[pick]}
                </motion.div>
              ) : (
                // Never an empty bordered box: if the observer somehow never
                // fires, this reads as an intentional state rather than a
                // section that failed to load.
                <p className="flex h-full min-h-[340px] items-center justify-center text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-300">
                  {content.waiting}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-[60ch] text-[14px] leading-relaxed text-slate-500">
          {content.note}
        </p>
      </div>
    </section>
  );
}
