"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ShowcaseContent } from "@/i18n/showcase";

/**
 * Agent 01 — the sales assistant. Motion character: conversational.
 *
 * Bubbles land with a spring out of their own tail, typing dots appear before
 * every reply, and the working trace ticks alongside. The argument is that
 * there is judgement happening in the gaps between messages, so the gaps are
 * the thing being animated.
 *
 * The script is modelled on the assistant already running on couders.com: it
 * narrows before it answers, and it says out loud when something is beyond
 * what it knows.
 */

const POP = { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.85 };

export default function DemoChat({ c }: { c: ShowcaseContent["chat"] }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? c.messages.length : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const timers: number[] = [];
    const next = () => {
      if (i >= c.messages.length) return;
      const msg = c.messages[i];
      const show = () => {
        setTyping(false);
        setN(i + 1);
        i += 1;
        timers.push(window.setTimeout(next, 620));
      };
      // Only the assistant "types" — dots on the assistant's side followed by
      // a client bubble would be nonsense.
      if (msg.from === "agent") {
        setTyping(true);
        timers.push(window.setTimeout(show, 620));
      } else {
        show();
      }
    };
    timers.push(window.setTimeout(next, 300));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced, c]);

  const workDone = Math.min(
    c.work.length,
    Math.round((n / c.messages.length) * c.work.length),
  );

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]">
      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 sm:p-5">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
          {c.channel}
        </p>
        <div className="flex max-h-[336px] min-h-[300px] flex-col justify-end gap-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {c.messages.slice(0, n).map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={reduced ? false : { opacity: 0, scale: 0.68, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={POP}
                style={{
                  transformOrigin: m.from === "client" ? "bottom left" : "bottom right",
                }}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug ${
                  m.from === "client"
                    ? "self-start rounded-bl-md bg-slate-100 text-slate-900"
                    : "self-end rounded-br-md bg-slate-900 text-white"
                }`}
              >
                {m.text}
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="t"
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.1 } }}
                transition={POP}
                style={{ transformOrigin: "bottom right" }}
                className="flex items-center gap-1 self-end rounded-2xl rounded-br-md bg-slate-900 px-3 py-2.5"
              >
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="block h-1.5 w-1.5 rounded-full bg-white/70"
                    animate={{ y: [0, -3.5, 0], opacity: [0.45, 1, 0.45] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: d * 0.14 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-2xl bg-sky-50/60 p-4 ring-1 ring-sky-200/50 sm:p-5">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-sky-700">
          {c.workTitle}
        </p>
        <ol className="flex flex-col gap-2">
          {c.work.map((w, i) => (
            <motion.li
              key={w}
              initial={false}
              animate={{ opacity: i < workDone ? 1 : 0.3 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-[12px_minmax(0,1fr)] items-start gap-2.5"
            >
              <span
                aria-hidden="true"
                className="mt-[6px] block h-1.5 w-1.5 rounded-full"
                style={{ background: i < workDone ? "#0EA5E9" : "#cbd5e1" }}
              />
              <span className="text-[12.5px] leading-snug text-slate-700">{w}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
