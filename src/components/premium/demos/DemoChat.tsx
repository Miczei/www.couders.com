"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Agent 01 — the sales assistant. Motion character: conversational.
 *
 * Bubbles land with a spring out of their own tail, typing dots appear before
 * every reply, and the working trace ticks alongside. The argument is that
 * there is judgement happening in the gaps between messages, so the gaps are
 * the thing being animated.
 */

type Msg = { from: "client" | "agent"; text: string; time: string };

const CHAT: Msg[] = [
  { from: "client", time: "22:47", text: "Dobry wieczór, interesuje mnie wykończenie mieszkania. Ile to mniej więcej kosztuje?" },
  // The real assistant on couders.com narrows before it answers — it asks for
  // an offer number or an address rather than guessing. Same move here: a bot
  // that quotes a price off a one-line question is a bot nobody believes.
  { from: "agent", time: "22:47", text: "Dobry wieczór. Cena zależy głównie od metrażu i zakresu prac. Jaki to metraż i czy mówimy o stanie deweloperskim, czy o remoncie?" },
  { from: "client", time: "22:48", text: "78 m², stan deweloperski, pod klucz" },
  { from: "agent", time: "22:48", text: "Przy 78 m² w pakiecie standard wychodzi orientacyjnie 144 300 zł netto, czyli 1 850 zł za metr. W tej kwocie są materiały z naszej listy, robocizna i nadzór." },
  { from: "client", time: "22:49", text: "A jeśli chcę lepsze płytki niż te z listy?" },
  // Admitting a limit is the most persuasive thing a sales bot does.
  { from: "agent", time: "22:49", text: "Wtedy różnicę w cenie materiału dopisujemy do kosztorysu, robocizna zostaje bez zmian. Konkretnej kwoty nie podam — to już liczy kosztorysant." },
  { from: "client", time: "22:50", text: "A ile to trwa?" },
  { from: "agent", time: "22:50", text: "Przy tym metrażu zwykle 10–12 tygodni od podpisania umowy." },
  { from: "agent", time: "22:50", text: "Wiążącą wycenę dajemy po bezpłatnym pomiarze. Mogę przekazać zapytanie do biura — proszę o numer telefonu." },
  { from: "client", time: "22:51", text: "601 234 342" },
  { from: "agent", time: "22:51", text: "Dziękuję. Zapytanie jest już w biurze, ktoś odezwie się rano. Zapis rozmowy dołączyłem." },
];

const WORK = [
  "Sprawdzam, kto pisze — nowy kontakt, brak w CRM",
  "Rozpoznaję intencję: wycena wykończenia",
  "Brakuje metrażu i zakresu — dopytuję, zamiast zgadywać",
  "Sięgam po cennik: pakiet standard 1 850 zł/m²",
  "Liczę: 78 × 1 850 = 144 300 zł netto",
  "Czytam kartę usługi — co wchodzi w pakiet",
  "Płytki spoza listy wykraczają poza cennik — nie zmyślam",
  "Sprawdzam typowy czas realizacji: 10–12 tygodni",
  "Klient jest gotowy — proszę o numer telefonu",
  "Zakładam lead z transkryptem i przekazuję do biura",
];
const POP = { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.85 };

export default function DemoChat() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? CHAT.length : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const timers: number[] = [];
    const next = () => {
      if (i >= CHAT.length) return;
      const msg = CHAT[i];
      const show = () => {
        setTyping(false);
        setN(i + 1);
        i += 1;
        timers.push(window.setTimeout(next, 620));
      };
      // Only the assistant "types" — a client bubble appearing after dots on
      // the assistant's side would be nonsense.
      if (msg.from === "agent") {
        setTyping(true);
        timers.push(window.setTimeout(show, 620));
      } else {
        show();
      }
    };
    timers.push(window.setTimeout(next, 300));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const workDone = Math.min(WORK.length, Math.round((n / CHAT.length) * WORK.length));

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]">
      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 sm:p-5">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-400">
          WhatsApp · wtorek 22:47
        </p>
        <div className="flex max-h-[336px] min-h-[300px] flex-col justify-end gap-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {CHAT.slice(0, n).map((m, i) => (
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
                aria-label="Asystent pisze"
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
          Co robi w tym czasie
        </p>
        <ol className="flex flex-col gap-2">
          {WORK.map((w, i) => (
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
