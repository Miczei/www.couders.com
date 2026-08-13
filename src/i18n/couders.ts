import type { Locale } from "./config";

export type CoudersTelemetryCard = {
  /** null => a static/non-numeric metric (e.g. "24/7"), rendered via `display`. */
  value: number | null;
  decimals: number;
  suffix: string;
  display?: string;
  title: string;
  body: string;
  span: string;
  accent: boolean;
};

export type CoudersContent = {
  hero: {
    eyebrow: string;
    h1: string;
    h2: string;
    ctaButton: string;
    chatSubtitle: string;
    scroll: string;
    morphAria: string;
  };
  /** Only rendered on /lab (the Hero animation debug preview) now. */
  telemetry: {
    eyebrow: string;
    h2: string;
    cards: CoudersTelemetryCard[];
  };
  logoTicker: {
    rowModels: string;
    rowInfra: string;
    marqueeAria: string;
  };
  problem: {
    eyebrow: string;
    h2: string;
    body: string;
    points: string[];
  };
  pillars: {
    eyebrow: string;
    h2: string;
    items: { title: string; body: string }[];
  };
  industries: {
    eyebrow: string;
    h2: string;
    items: string[];
  };
  cta: {
    h2: string;
    button: string;
    emailLabel: string;
  };
};

const en: CoudersContent = {
  hero: {
    eyebrow: "B2B Sales Automation",
    h1: "Automate customer service and sales in your company.",
    h2: "We build AI assistants that know your pricing, product catalogs, and technical specs by heart. They answer clients in 60 seconds — at night, on weekends, and during holidays.",
    ctaButton: "Book a 15-minute demo",
    chatSubtitle: "Test below how our assistant talks to a client.",
    scroll: "Scroll",
    morphAria:
      "A single continuous line morphing from an abstract face into the Couders wordmark",
  },
  telemetry: {
    eyebrow: "How it works",
    h2: "What changes from day one",
    cards: [
      {
        value: null,
        decimals: 0,
        suffix: "",
        display: "24/7",
        title: "Answers while you sleep",
        body: "Most inquiries arrive after hours, on weekends and during holidays. The agent is there for every one of them, at the same quality as at noon on a Tuesday.",
        span: "md:col-span-3 md:row-span-2",
        accent: false,
      },
      {
        value: null,
        decimals: 0,
        suffix: "",
        display: "Seconds",
        title: "Time to first response",
        body: "The agent replies the moment a question lands, instead of waiting for someone to free up. Whoever answers first usually wins the customer.",
        span: "md:col-span-3",
        accent: false,
      },
      {
        value: null,
        decimals: 0,
        suffix: "",
        display: "No queue",
        title: "Ten questions at once, or one",
        body: "The agent has no working hours, no queue and no bad days. Volume spikes do not change how fast anyone gets served.",
        span: "md:col-span-3",
        accent: true,
      },
    ],
  },
  logoTicker: {
    rowModels: "Models we build on · not our clients",
    rowInfra: "Infrastructure we use · orchestration & automation",
    marqueeAria:
      "Logos of supported AI technologies: OpenAI, Anthropic, Google Gemini, Meta Llama, Manus, OpenClaw, Ollama, LangChain, Copilot, n8n and Pinecone",
  },
  problem: {
    eyebrow: "The problem",
    h2: "You're losing leads after hours.",
    body: "Expensive leads slip away after hours. Clients ask about machinery or materials in the evening. Before your office replies in the morning, they buy from competitors.",
    points: ["Evening inquiry", "Silence until morning", "Client goes to a competitor"],
  },
  pillars: {
    eyebrow: "Product",
    h2: "Three ways it works.",
    items: [
      {
        title: "Corporate Sales Assistant",
        body: "Sits on your website, knows the catalog, answers 24/7, and collects leads.",
      },
      {
        title: "Instant Lead Qualifier",
        body: "Reaches out to new ad leads in 60 seconds, qualifies budget, and books meetings in the sales calendar.",
      },
      {
        title: "B2B Proposal Generator",
        body: "Sales reps input 3 sentences after a call, and the system generates a tailored, branded PDF proposal in 15 minutes.",
      },
    ],
  },
  industries: {
    eyebrow: "Industries",
    h2: "Who we build this for.",
    items: [
      "Manufacturing & Machinery",
      "Construction Materials",
      "Real Estate Developers",
      "B2B Services",
    ],
  },
  cta: {
    h2: "Let's build a demo on your company's data.",
    button: "Book a 15-minute demo",
    emailLabel: "Or write to us directly",
  },
};

const pl: CoudersContent = {
  hero: {
    eyebrow: "Automatyzacja Sprzedaży B2B",
    h1: "Zautomatyzuj obsługę klienta i sprzedaż w swojej firmie.",
    h2: "Wdrażamy asystentów AI, którzy znają Twoje cenniki, katalogi produktów i specyfikacje techniczne. Odpowiadają klientom w minutę — w nocy, w weekendy i w święta.",
    ctaButton: "Umów 15-minutowe demo",
    chatSubtitle: "Przetestuj poniżej, jak nasz asystent rozmawia z klientem.",
    scroll: "Przewiń",
    morphAria:
      "Pojedyncza ciągła linia przekształcająca się z abstrakcyjnej twarzy w logotyp Couders",
  },
  telemetry: {
    eyebrow: "Jak to działa",
    h2: "Co zmienia się od pierwszego dnia",
    cards: [
      {
        value: null,
        decimals: 0,
        suffix: "",
        display: "24/7",
        title: "Odpowiada, kiedy Ty śpisz",
        body: "Większość zapytań przychodzi po godzinach, w weekendy i w święta. Agent jest przy każdym z nich, w tej samej jakości co we wtorek w południe.",
        span: "md:col-span-3 md:row-span-2",
        accent: false,
      },
      {
        value: null,
        decimals: 0,
        suffix: "",
        display: "Sekundy",
        title: "Czas pierwszej odpowiedzi",
        body: "Agent odpowiada w chwili, gdy pytanie wpada, zamiast czekać, aż ktoś się zwolni. Klienta zwykle bierze ten, kto odezwał się pierwszy.",
        span: "md:col-span-3",
        accent: false,
      },
      {
        value: null,
        decimals: 0,
        suffix: "",
        display: "Bez kolejki",
        title: "Dziesięć pytań naraz albo jedno",
        body: "Agent nie ma godzin pracy, kolejki ani gorszego dnia. Skok liczby zapytań nie zmienia tego, jak szybko obsłużony zostaje każdy z nich.",
        span: "md:col-span-3",
        accent: true,
      },
    ],
  },
  logoTicker: {
    rowModels: "Modele, na których budujemy · to nie są nasi klienci",
    rowInfra: "Infrastruktura, której używamy · orkiestracja i automatyzacja",
    marqueeAria:
      "Logotypy wspieranych technologii AI: OpenAI, Anthropic, Google Gemini, Meta Llama, Manus, OpenClaw, Ollama, LangChain, Copilot, n8n i Pinecone",
  },
  problem: {
    eyebrow: "Problem",
    h2: "Tracisz leady po godzinach pracy.",
    body: "Drogie leady uciekają po godzinach pracy. Klienci pytają o maszyny lub materiały wieczorem. Zanim Twoje biuro odpowie rano, klient kupuje u konkurencji.",
    points: ["Wieczorne zapytanie", "Cisza do rana", "Klient u konkurencji"],
  },
  pillars: {
    eyebrow: "Produkt",
    h2: "Trzy sposoby, jak to działa.",
    items: [
      {
        title: "Firmowy Asystent Sprzedaży",
        body: "Siedzi na Twojej stronie, zna katalog produktów, odpowiada 24/7 i zbiera leady.",
      },
      {
        title: "Błyskawiczny Kwalifikator Zapytań",
        body: "Odzywa się do nowych leadów z reklam w 60 sekund, kwalifikuje budżet i umawia spotkania w kalendarzu sprzedaży.",
      },
      {
        title: "Generator Ofert B2B",
        body: "Handlowiec wpisuje 3 zdania po rozmowie, a system generuje dopasowaną, firmową ofertę PDF w 15 minut.",
      },
    ],
  },
  industries: {
    eyebrow: "Branże",
    h2: "Dla kogo to budujemy.",
    items: [
      "Przemysł i Maszyny",
      "Materiały Budowlane i Hurtownie",
      "Deweloperzy i Nieruchomości",
      "Usługi B2B",
    ],
  },
  cta: {
    h2: "Zróbmy demo na danych Twojej firmy.",
    button: "Umów 15-minutowe demo",
    emailLabel: "Albo napisz do nas bezpośrednio",
  },
};

const COUDERS: Record<Locale, CoudersContent> = { en, pl };

export const getCouders = (locale: Locale): CoudersContent => COUDERS[locale] ?? en;
