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

export type CoudersTimelineStep = { time: string; text: string };

export type CoudersPillar = {
  title: string;
  teaser: string;
  modal: string;
  detailsLabel: string;
  modalCta: string;
};

export type CoudersIndustry = {
  title: string;
  points: string[];
};

export type CoudersContent = {
  hero: {
    eyebrow: string;
    h1: string;
    ctaButton: string;
    chatSubtitle: string;
    badges: string[];
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
    before: { title: string; steps: CoudersTimelineStep[] };
    after: { title: string; steps: CoudersTimelineStep[] };
  };
  pillars: {
    eyebrow: string;
    h2: string;
    closeLabel: string;
    items: CoudersPillar[];
  };
  industries: {
    eyebrow: string;
    h2: string;
    items: CoudersIndustry[];
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
    ctaButton: "Book a 15-minute demo",
    chatSubtitle: "Test below how our assistant talks to a client.",
    badges: ["60s Response", "24/7 Active"],
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
    before: {
      title: "Traditional Sales",
      steps: [
        { time: "Friday, 9:00 PM", text: "Client sends an inquiry." },
        { time: "Weekend", text: "Silence." },
        {
          time: "Monday, 10:00 AM",
          text: "Sales rep replies. Result? The client already bought from a competitor.",
        },
      ],
    },
    after: {
      title: "Sales with Couders",
      steps: [
        { time: "Friday, 9:00 PM", text: "Client sends an inquiry." },
        { time: "Friday, 9:01 PM", text: "The AI assistant qualifies the lead and checks pricing." },
        { time: "Friday, 9:15 PM", text: "Client books a demo directly on the calendar." },
      ],
    },
  },
  pillars: {
    eyebrow: "Product",
    h2: "Three ways it works.",
    closeLabel: "Close",
    items: [
      {
        title: "Corporate Sales Assistant",
        teaser: "Sits on your website, knows the catalog, answers 24/7, and collects leads.",
        modal:
          "Knows your prospects and pricing by heart. Answers at any hour. A client writes “Looking for machine X under 100k PLN,” and the assistant instantly sends the spec sheet and captures their contact.",
        detailsLabel: "See details →",
        modalCta: "Book a demo",
      },
      {
        title: "Instant Lead Qualifier",
        teaser:
          "Reaches out to new ad leads in 60 seconds, qualifies budget, and books meetings in the sales calendar.",
        modal:
          "Stop wasting time calling window-shoppers. Our assistant messages ad leads within 1 minute, checks budget and intent. Serious buyers get a link straight to your sales calendar.",
        detailsLabel: "See details →",
        modalCta: "Book a demo",
      },
      {
        title: "B2B Proposal Generator",
        teaser:
          "Sales reps input 3 sentences after a call, and the system generates a tailored, branded PDF proposal in 15 minutes.",
        modal:
          "After a meeting, the rep fills a short form on their phone (what the client looked at, their concerns). In 15 minutes the system generates a personalized, branded PDF proposal ready to send.",
        detailsLabel: "See details →",
        modalCta: "Book a demo",
      },
    ],
  },
  industries: {
    eyebrow: "Industries",
    h2: "Who we build this for.",
    items: [
      {
        title: "Manufacturing & Machinery",
        points: ["Fast quoting", "Machine pricing", "24/7 inquiry handling"],
      },
      {
        title: "Construction Materials",
        points: ["Stock availability", "Bulk pricing", "24/7 ordering"],
      },
      {
        title: "Real Estate Developers",
        points: ["24/7 pricing answers", "Buyer qualification", "Contact capture"],
      },
      {
        title: "B2B Services",
        points: ["RFQ responses", "Lead qualification", "PDF proposal generation"],
      },
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
    ctaButton: "Umów 15-minutowe demo",
    chatSubtitle: "Przetestuj poniżej, jak nasz asystent rozmawia z klientem.",
    badges: ["Odpowiedź w 60s", "Działa 24/7"],
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
    before: {
      title: "Tradycyjna Sprzedaż",
      steps: [
        { time: "Piątek, 21:00", text: "Klient wysyła zapytanie." },
        { time: "Weekend", text: "Cisza." },
        {
          time: "Poniedziałek, 10:00",
          text: "Handlowiec odpisuje. Efekt? Klient kupił u konkurencji.",
        },
      ],
    },
    after: {
      title: "Sprzedaż z Couders",
      steps: [
        { time: "Piątek, 21:00", text: "Klient wysyła zapytanie." },
        { time: "Piątek, 21:01", text: "Asystent AI kwalifikuje leada i sprawdza cennik." },
        { time: "Piątek, 21:15", text: "Klient umawia demo bezpośrednio w kalendarzu." },
      ],
    },
  },
  pillars: {
    eyebrow: "Produkt",
    h2: "Trzy sposoby, jak to działa.",
    closeLabel: "Zamknij",
    items: [
      {
        title: "Firmowy Asystent Sprzedaży",
        teaser: "Siedzi na Twojej stronie, zna katalog produktów, odpowiada 24/7 i zbiera leady.",
        modal:
          "Zna Twój prospekt i cennik na pamięć. Odpowiada o każdej porze. Klient pisze „Szukam maszyny X do 100 tys. zł”, a asystent natychmiast wysyła specyfikację i zbiera kontakt.",
        detailsLabel: "Poznaj szczegóły →",
        modalCta: "Zarezerwuj demo",
      },
      {
        title: "Błyskawiczny Kwalifikator Zapytań",
        teaser:
          "Odzywa się do nowych leadów z reklam w 60 sekund, kwalifikuje budżet i umawia spotkania w kalendarzu sprzedaży.",
        modal:
          "Nie trać czasu na dzwonienie do „ciekawskich”. Nasz asystent pisze do leada z reklamy w 1 minutę. Bada budżet i intencję. Poważni klienci dostają link do kalendarza handlowca.",
        detailsLabel: "Poznaj szczegóły →",
        modalCta: "Zarezerwuj demo",
      },
      {
        title: "Generator Ofert B2B",
        teaser:
          "Handlowiec wpisuje 3 zdania po rozmowie, a system generuje dopasowaną, firmową ofertę PDF w 15 minut.",
        modal:
          "Po spotkaniu handlowiec uzupełnia krótki formularz na telefonie (np. co klient oglądał i czego się obawia). W 15 minut system generuje spersonalizowaną, designerską ofertę PDF gotową do wysłania.",
        detailsLabel: "Poznaj szczegóły →",
        modalCta: "Zarezerwuj demo",
      },
    ],
  },
  industries: {
    eyebrow: "Branże",
    h2: "Dla kogo to budujemy.",
    items: [
      {
        title: "Przemysł i Maszyny",
        points: ["Szybkie ofertowanie", "Wycena maszyn", "Obsługa zapytań 24/7"],
      },
      {
        title: "Materiały Budowlane i Hurtownie",
        points: ["Dostępność magazynowa", "Wycena partii", "Zamówienia 24/7"],
      },
      {
        title: "Deweloperzy i Nieruchomości",
        points: ["Odpowiedzi o cenach 24/7", "Kwalifikacja kupujących", "Zbieranie kontaktów"],
      },
      {
        title: "Usługi B2B",
        points: ["Odpowiedzi na zapytania ofertowe", "Kwalifikacja leadów", "Generowanie ofert PDF"],
      },
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
