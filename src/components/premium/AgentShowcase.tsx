"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSpotlight } from "@/components/ui/SpotlightCard";

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
 * Self-contained apart from useSpotlight, which is the site's own hook and is
 * what keeps the glow identical to the live cards.
 */

type Beat = { at: string; via: string; did: string; flag?: "human" | "win" | "drop" };

type Agent = {
  no: string;
  title: string;
  teaser: string;
  /** Headline over the replay — the argument this agent makes. */
  claim: string;
  context: string;
  beats: Beat[];
  outcome: string;
};

const AGENTS: Agent[] = [
  {
    no: "01",
    title: "Firmowy Asystent Sprzedaży",
    teaser: "Zna katalog i cennik. Zbiera leady, gdy Ty śpisz.",
    claim: "Zobaczcie, co robi między jedną a drugą odpowiedzią.",
    context: "Wtorek, 22:47 · zapytanie z WhatsAppa",
    beats: [
      { at: "22:47:00", via: "Odbiera", did: "Nowy kontakt, nie ma go w CRM" },
      { at: "22:47:01", via: "Czyta", did: "Wycena wykończenia, 78 m², pod klucz" },
      { at: "22:47:02", via: "Liczy", did: "Pakiet standard — 144 300 zł netto" },
      { at: "22:47:03", via: "Odpisuje", did: "Widełki plus zastrzeżenie, że to szacunek" },
      { at: "22:51:19", via: "Zapisuje", did: "Lead z transkryptem i numerem telefonu", flag: "win" },
      { at: "08:00:00", via: "Melduje", did: "Rano na biurku dziewięć uporządkowanych rozmów" },
    ],
    outcome: "Zero martwych godzin. Klient dostał konkret w trzy sekundy, Wy dostaliście gotowy kontakt.",
  },
  {
    no: "02",
    title: "Recepcjonista AI przez telefon",
    teaser: "Odbiera wieczorami, w nocy i w weekendy. Nikt nie słyszy sygnału w pustkę.",
    claim: "Telefon dzwoni o 21:40 w sobotę. Ktoś odbiera.",
    context: "Sobota, 21:40 · biuro zamknięte od pięciu godzin",
    beats: [
      { at: "21:40:04", via: "Dzwoni", did: "Numer spoza bazy, drugie połączenie tego wieczoru" },
      { at: "21:40:06", via: "Odbiera", did: "Przedstawia się nazwą Waszej firmy" },
      { at: "21:40:31", via: "Słucha", did: "Klient pyta o termin montażu w przyszłym miesiącu" },
      { at: "21:41:12", via: "Sprawdza", did: "Wolne terminy: wtorek 9:00, środa 13:30" },
      { at: "21:42:02", via: "Umawia", did: "Wtorek 9:00, SMS z potwierdzeniem wysłany", flag: "win" },
      { at: "21:42:10", via: "Notuje", did: "Nagranie i transkrypt w karcie klienta" },
    ],
    outcome: "Siedem połączeń tej soboty. Bez asystenta — siedem sygnałów w pustkę i siedem powodów, żeby zadzwonić gdzie indziej.",
  },
  {
    no: "03",
    title: "Błyskawiczny Kwalifikator Leadów",
    teaser: "Odzywa się do leadów z reklam w minutę. Odsiewa ciekawskich.",
    claim: "Minuta. Tyle ma konkurencja, zanim odezwiecie się pierwsi.",
    context: "Czwartek, 14:02 · formularz z kampanii Google Ads",
    beats: [
      { at: "+0 s", via: "Formularz", did: "Wpada zgłoszenie: „proszę o kontakt”" },
      { at: "+38 s", via: "Pisze", did: "Pierwsza wiadomość do klienta wychodzi" },
      { at: "+1:20", via: "Pyta", did: "Budżet, termin, skala — trzy pytania, nie kwestionariusz" },
      { at: "+3:40", via: "Ocenia", did: "Budżet poniżej progu, termin „kiedyś” — odsiany", flag: "drop" },
      { at: "+4:10", via: "Kolejny", did: "Ten sam formularz, inny lead — budżet się zgadza" },
      { at: "+6:55", via: "Umawia", did: "Spotkanie w kalendarzu handlowca, czwartek 16:00", flag: "win" },
    ],
    outcome: "Na biurko handlowca trafia jeden lead zamiast dziesięciu. Ten jeden jest umówiony.",
  },
  {
    no: "04",
    title: "Generator Ofert B2B",
    teaser: "Firmowa oferta PDF u klienta w piętnaście minut po spotkaniu.",
    claim: "Oferta u klienta, zanim ostygnie kawa po spotkaniu.",
    context: "Środa, 15:32 · handlowiec wychodzi ze spotkania",
    beats: [
      { at: "15:32", via: "Formularz", did: "Handlowiec wpisuje z telefonu, co klient oglądał" },
      { at: "15:33", via: "Czyta", did: "Wyciąga z rozmowy dwie obawy: termin i serwis" },
      { at: "15:36", via: "Redaguje", did: "Pisze pod tego klienta, nie z szablonu" },
      { at: "15:41", via: "Składa", did: "PDF w Waszej szacie graficznej, z cennikiem" },
      { at: "15:47", via: "Wysyła", did: "Oferta w skrzynce klienta — 15 minut po pożegnaniu", flag: "win" },
    ],
    outcome: "Klient czyta ofertę, kiedy emocje zakupowe są najwyższe, a nie w przyszły wtorek.",
  },
];

const FLAG = {
  win: { c: "#0284c7", label: "✓" },
  drop: { c: "#94a3b8", label: "—" },
  human: { c: "#A15C00", label: "→" },
} as const;

function Replay({ agent, reduced }: { agent: Agent; reduced: boolean }) {
  const [step, setStep] = useState(reduced ? agent.beats.length : 0);
  const timer = useRef<number>(0);

  useEffect(() => {
    if (reduced) return;
    setStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setStep(i);
      if (i < agent.beats.length) timer.current = window.setTimeout(tick, 620);
    };
    timer.current = window.setTimeout(tick, 320);
    return () => window.clearTimeout(timer.current);
  }, [agent, reduced]);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)]">
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
          {agent.context}
        </p>

        <ol className="mt-5 flex flex-col">
          {agent.beats.map((b, i) => {
            const on = i < step;
            const flag = b.flag ? FLAG[b.flag] : null;
            return (
              <motion.li
                key={b.at + b.did}
                initial={false}
                animate={{ opacity: on ? 1 : 0.22, x: on ? 0 : -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[74px_18px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200/70 py-3 last:border-b-0"
              >
                <span className="font-mono text-[11px] tabular-nums text-slate-400">
                  {b.at}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-[3px] text-center font-mono text-[11px]"
                  style={{ color: flag ? flag.c : "#22E0C8" }}
                >
                  {flag ? flag.label : "·"}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[9.5px] uppercase tracking-[0.16em] text-sky-600">
                    {b.via}
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-snug text-slate-800">
                    {b.did}
                  </span>
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-sky-50/60 p-6 ring-1 ring-sky-200/50">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-600">
            Efekt
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            {agent.outcome}
          </p>
        </div>

        {/* Progress of the replay, doubling as the "still going" cue. */}
        <div>
          <div className="h-px w-full bg-sky-200/70">
            <motion.div
              className="h-px bg-gradient-to-r from-[#0EA5E9] to-[#22E0C8]"
              initial={false}
              animate={{ width: `${(step / agent.beats.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {step >= agent.beats.length ? "koniec zapisu" : "odtwarzanie…"}
          </p>
        </div>
      </div>
    </div>
  );
}

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
                <Replay agent={agent} reduced={!!reduced} />
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
