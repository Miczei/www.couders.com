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

export type CoudersPillar = {
  title: string;
  teaser: string;
  expanded: string;
};

export type CoudersIndustry = {
  title: string;
  description: string;
};

export type CoudersContent = {
  hero: {
    h1: string;
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
    leftLabel: string;
    rightLabel: string;
    clientMessage: string;
    officeStatus: string;
    aiMessage: string;
    metricChip: string;
  };
  pillars: {
    eyebrow: string;
    h2: string;
    detailsLabel: string;
    ctaLabel: string;
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
    h1: "Automate customer service and sales in your company.",
    ctaButton: "Book a demo",
    chatSubtitle: "Test above how our assistant talks to a client.",
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
    h2: "Your client won't wait until Monday. Agent responds immediately.",
    leftLabel: "No Response",
    rightLabel: "Response in 1 Minute",
    clientMessage:
      "Friday, 9:30 PM: Hi, I'm looking for a machine under 150k PLN. Is model X available?",
    officeStatus: "Office reply: Monday, 10:00 AM (client already bought from a competitor)",
    aiMessage:
      "Friday, 9:31 PM: Hi there! Model X is available, and within that budget we also have a better option, model Y. Sending over the spec sheet. Would you like to discuss it in a short meeting on Monday?",
    metricChip: "Response time: 1 min",
  },
  pillars: {
    eyebrow: "Product",
    h2: "Three ways it works.",
    detailsLabel: "See details →",
    ctaLabel: "Find out more ➔",
    items: [
      {
        title: "Corporate Sales Assistant (24/7)",
        teaser: "An assistant on your website that knows your catalog and pricing. Collects leads while you sleep.",
        expanded:
          "This isn't a rigid button-based chatbot. Clients type naturally, and our assistant replies with real substance. It knows your prospectus, technical specs, and pricing by heart. It filters out questions already answered on the site, sends over PDFs, and instantly captures the phone number of anyone interested. It eliminates the 'dead hours' phenomenon on weekends and holidays. If it doesn't know something, it says so honestly and hands the contact off to a sales rep.",
      },
      {
        title: "Instant Lead Qualifier",
        teaser: "Reaches out to ad leads within 1 minute. Filters out window-shoppers, books real buyers.",
        expanded:
          "Most inquiries from ads come from people who clicked out of curiosity. Within 60 seconds of a form submission, our assistant contacts the lead by email or SMS. It checks their budget, purchase timeline, and preferences. It saves your sales reps dozens of hours - only vetted, serious buyers land on their desk, often with a meeting already booked on the calendar.",
      },
      {
        title: "B2B Proposal Generator",
        teaser: "A personalized, branded PDF proposal in the client's inbox 15 minutes after the meeting.",
        expanded:
          "No more wasting hours manually formatting in Word. After the meeting, your rep fills out a short form on their phone - noting what the client looked at and what concerns they raised. The AI assistant drafts copy tailored to that specific client, addressing their concerns directly. In 15 minutes it generates a polished, ready-to-send PDF in your company's branding. The client gets the proposal that same evening, while their buying emotions are at their peak.",
      },
    ],
  },
  industries: {
    eyebrow: "Industries",
    h2: "Who we build this for.",
    items: [
      {
        title: "Manufacturing & Machinery",
        description:
          "B2B clients don't buy blind. They're after specific technical parameters, specifications, and performance figures. Instead of making them wait for a sales engineer to reply, our AI assistant analyzes the inquiry instantly. It knows your entire machine documentation by heart. It can match the right model to the client's needs, compare it against other units in the catalog, and provide a preliminary quote. What's more, it automatically captures contact details and hands the rep a ready-to-close lead complete with the full conversation history.",
      },
      {
        title: "Construction Materials",
        description:
          "In construction, time is money. Contractors and renovation crews often send inquiries about stock levels and wholesale pricing straight from the job site, frequently after your office has closed. Our system instantly checks assortment availability and converts requirements (e.g. square meters into packages). It automates the quoting process for regular B2B clients, factoring in their discount tiers. You save your sales reps hours they'd otherwise spend answering repetitive availability questions, freeing them to focus on landing new, large contracts.",
      },
      {
        title: "Real Estate Developers",
        description:
          "Every lead from a real estate portal costs a fortune, and most of them arrive on weekends or in the evening. By the time your sales office opens on Monday morning, the client has already browsed the competition's listings. We deploy a Virtual Investment Assistant that knows your prospectus, floor plans, and current price list by heart. It answers clients within 1 minute, any time of day or night. It filters out window-shoppers, and for anyone genuinely interested in buying, it immediately offers a slot in the advisor's calendar. After the meeting, the system generates a personalized, beautifully designed PDF proposal ready to send within 15 minutes.",
      },
      {
        title: "B2B Services & Consulting",
        description:
          "Selling services requires building trust and thoroughly understanding the client's needs before the first meeting. Our Instant Lead Qualifier reaches out to every new inquiry from ads within 60 seconds. It carries out a natural, intelligent conversation to establish budget, the scale of the problem, and expectations. Only vetted clients worth talking to land on your team's desk. No more wasting time on calls to people who 'just clicked out of curiosity.'",
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
    h1: "Zautomatyzuj obsługę klienta i sprzedaż w swojej firmie.",
    ctaButton: "Umów demo",
    chatSubtitle: "Przetestuj powyżej, jak nasz asystent rozmawia z klientem.",
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
    h2: "Twój klient nie czeka do poniedziałku. Agent odpowiada natychmiast.",
    leftLabel: "Brak odpowiedzi",
    rightLabel: "Odpowiedź w 1 minutę",
    clientMessage:
      "Piątek, 21:30: Witam, szukam maszyny do 150 tys. PLN. Czy model X jest dostępny?",
    officeStatus: "Odpowiedź biura: Poniedziałek, 10:00 (klient kupił już u konkurencji)",
    aiMessage:
      "Piątek, 21:31: Dzień dobry! Model X jest dostępny, a w tym budżecie mamy też lepszą opcję Y. Podsyłam specyfikację. Czy chciałby Pan omówić to na krótkim spotkaniu w poniedziałek?",
    metricChip: "Czas reakcji: 1 min",
  },
  pillars: {
    eyebrow: "Produkt",
    h2: "Trzy sposoby, jak to działa.",
    detailsLabel: "Poznaj szczegóły →",
    ctaLabel: "Dowiedz się więcej ➔",
    items: [
      {
        title: "Firmowy Asystent Sprzedaży (24/7)",
        teaser: "Asystent na Twojej stronie, który zna katalog i cennik. Zbiera leady, gdy Ty śpisz.",
        expanded:
          "To nie jest sztywny chatbot z guzikami. Klient pisze naturalnie, a nasz asystent odpowiada merytorycznie. Zna na pamięć Twój prospekt, parametry techniczne i cennik. Odsiewa pytania, na które odpowiedź jest na stronie, podsyła PDFy, a od zainteresowanych natychmiast pobiera numer telefonu. Eliminuje zjawisko „martwych godzin” w weekendy i święta. Jeśli czegoś nie wie - uczciwie informuje i przekazuje kontakt do handlowca.",
      },
      {
        title: "Błyskawiczny Kwalifikator Leadów",
        teaser: "Odzywa się do leadów z reklam w 1 minutę. Odsiewa ciekawskich, umawia kupujących.",
        expanded:
          "Większość zapytań z reklam to osoby, które kliknęły „z ciekawości”. Nasi asystenci w ciągu 60 sekund od wysłania formularza kontaktują się z leadem mailem lub SMS-em. Badają budżet, termin zakupu i preferencje. Oszczędzają Twoim handlowcom dziesiątki godzin - na ich biurko trafiają wyłącznie wyselekcjonowani, poważni klienci, często z od razu zarezerwowanym terminem w kalendarzu.",
      },
      {
        title: "Generator Ofert B2B",
        teaser: "Spersonalizowana, firmowa oferta PDF w skrzynce klienta w 15 minut po spotkaniu.",
        expanded:
          "Koniec ze stratą godzin na ręczne formatowanie w Wordzie. Po spotkaniu Twój handlowiec wypełnia krótki formularz na telefonie - wpisuje, co klient oglądał i czego się obawia. Asystent AI redaguje tekst pod konkretnego klienta, odpowiadając na jego obawy. W 15 minut generuje piękny, gotowy plik PDF w szacie graficznej Twojej firmy. Klient dostaje ofertę jeszcze tego samego wieczoru, kiedy emocje zakupowe są najwyższe.",
      },
    ],
  },
  industries: {
    eyebrow: "Branże",
    h2: "Dla kogo to budujemy.",
    items: [
      {
        title: "Przemysł i Maszyny",
        description:
          "Klienci B2B nie kupują w ciemno. Szukają konkretnych parametrów technicznych, specyfikacji i wydajności. Zamiast zmuszać ich do czekania na odpowiedź inżyniera sprzedaży, nasz asystent AI natychmiast analizuje zapytanie. Zna na pamięć całą dokumentację techniczną Twoich maszyn. Potrafi dobrać odpowiedni model do potrzeb klienta, porównać go z innymi urządzeniami z katalogu i podać wstępną wycenę. Co więcej, automatycznie zbiera dane kontaktowe i przekazuje handlowcowi gotowego leada wraz z całą historią rozmowy, gotowego do zamknięcia sprzedaży.",
      },
      {
        title: "Materiały Budowlane",
        description:
          "W branży budowlanej czas to pieniądz. Wykonawcy i ekipy remontowe często wysyłają zapytania o stany magazynowe i cenniki hurtowe prosto z budowy, nierzadko po godzinach pracy Twojego biura. Nasz system natychmiast sprawdza dostępność asortymentu i przelicza zapotrzebowanie (np. ilość metrów kwadratowych na paczki). Automatyzuje proces wyceny dla stałych klientów B2B, uwzględniając ich progi rabatowe. Oszczędzasz godziny pracy handlowców, którzy zamiast odpowiadać na powtarzalne pytania o dostępność towaru, mogą skupić się na pozyskiwaniu nowych, dużych kontraktów.",
      },
      {
        title: "Deweloperzy i Nieruchomości",
        description:
          "Każdy lead z portalu nieruchomości kosztuje krocie, a większość z nich spływa w weekendy lub wieczorami. Zanim Twoje biuro sprzedaży otworzy się w poniedziałek rano, klient zdąży już obejrzeć oferty konkurencji. Wdrażamy Wirtualnego Asystenta Inwestycji, który zna na pamięć Twój prospekt, rzuty mieszkań i aktualny cennik. Odpowiada klientom w 1 minutę o każdej porze dnia i nocy. Odsiewa „ciekawskich”, a osobom realnie zainteresowanym zakupem od razu proponuje termin w kalendarzu doradcy. Po spotkaniu, system w 15 minut wygeneruje spersonalizowaną, piękną ofertę PDF gotową do wysłania.",
      },
      {
        title: "Usługi B2B i Consulting",
        description:
          "Sprzedaż usług wymaga zbudowania zaufania i dokładnego zbadania potrzeb klienta przed pierwszym spotkaniem. Nasz Błyskawiczny Kwalifikator Leadów odzywa się do każdego nowego zapytania z reklam w ciągu 60 sekund. Przeprowadza naturalną, inteligentną konwersację, aby ustalić budżet, skalę problemu i oczekiwania. Na biurko Twojego zespołu trafiają wyłącznie wyselekcjonowani klienci, z którymi warto rozmawiać. Koniec z marnowaniem czasu na telefony do osób, które „tylko klikały z ciekawości”.",
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
