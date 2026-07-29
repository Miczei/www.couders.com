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
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
    morphAria: string;
  };
  telemetry: {
    eyebrow: string;
    h2: string;
    cards: CoudersTelemetryCard[];
  };
  roiEstimator: {
    eyebrow: string;
    h2: string;
    lead: string;
    slider1Label: string;
    slider2Label: string;
    hoursLabel: string;
    savingsLabel: string;
    ctaLabel: string;
  };
  logoTicker: {
    rowModels: string;
    rowInfra: string;
    marqueeAria: string;
  };
  process: {
    eyebrow: string;
    h2: string;
    steps: { no: string; title: string; body: string }[];
  };
  reach: {
    eyebrow: string;
    h2: string;
    tiles: { title: string; sub: string; body: string; span: string }[];
    stat: { value: string; label: string; span: string };
  };
  commitments: {
    eyebrow: string;
    h2: string;
    stats: { value: number; suffix: string; label: string; body: string; span: string }[];
  };
  cta: {
    h2: string;
    body: string;
    button: string;
    emailLabel: string;
  };
};

const en: CoudersContent = {
  hero: {
    eyebrow: "Bespoke AI Systems",
    h1: "Autonomous AI Agents & Next-Gen Enterprise Solutions",
    sub: "Couders engineers custom AI chatbots and autonomous agents, trained on your private data, fluent in your customers' languages, and bound by your rules. They answer, decide, and act around the clock.",
    ctaPrimary: "Start a conversation",
    ctaSecondary: "See the engine",
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
  roiEstimator: {
    eyebrow: "ROI Calculator",
    h2: "Estimate your savings.",
    lead: "Drag the sliders to match your operation and see what autonomous agents could save you every month.",
    slider1Label: "Monthly repetitive inquiries / tasks",
    slider2Label: "Operations / Support team size (employees)",
    hoursLabel: "Hours Saved / Mo",
    savingsLabel: "Estimated Monthly Savings",
    ctaLabel: "Book an audit based on these estimates ➔",
  },
  logoTicker: {
    rowModels: "Models we build on · not our clients",
    rowInfra: "Infrastructure we use · orchestration & automation",
    marqueeAria:
      "Logos of supported AI technologies: OpenAI, Anthropic, Google Gemini, Meta Llama, Manus, OpenClaw, Ollama, LangChain, Copilot, n8n and Pinecone",
  },
  process: {
    eyebrow: "Implementation Process",
    h2: "From first call to autonomous scale.",
    steps: [
      {
        no: "01",
        title: "Discovery",
        body: "We map the conversations and workflows worth automating, define success metrics, and pick the highest-value starting point.",
      },
      {
        no: "02",
        title: "Data Integration & Training",
        body: "We connect your sources, build the private knowledge core, and evaluate the agent against real historical cases until it clears your bar.",
      },
      {
        no: "03",
        title: "Deployment",
        body: "Guardrails, approval checkpoints and monitoring go live with the agent. Rollout is gradual, observable and reversible at every step.",
      },
      {
        no: "04",
        title: "Autonomous Scaling",
        body: "Learning loops feed production experience back into the system. As trust compounds, the agent's scope widens from answering to acting.",
      },
    ],
  },
  reach: {
    eyebrow: "How we work",
    h2: "Remote, concrete, in your customer's language.",
    tiles: [
      {
        title: "Kraków",
        sub: "Our engineering home",
        body: "This is where we build. We work with companies across Poland and the EU, and we are happy to meet, but nothing here requires it.",
        span: "md:col-span-3",
      },
      {
        title: "100% remote",
        sub: "No site visits, no hardware",
        body: "We plug into the systems you already run: inboxes, documents, ERP. Nothing gets installed on your floor and nothing stops while we work.",
        span: "md:col-span-3",
      },
      {
        title: "Any language",
        sub: "Your customers, their words",
        body: "The agent answers in the language it was written to, from the same knowledge base, with no separate system to maintain.",
        span: "md:col-span-2",
      },
      {
        title: "Your environment",
        sub: "Data stays with you",
        body: "We build inside your infrastructure and your accounts. You keep the data, the access and the switch to turn it off.",
        span: "md:col-span-2",
      },
    ],
    stat: {
      value: "1-2 weeks",
      label: "Typical time to launch a first working bot, without rebuilding what you already have.",
      span: "md:col-span-2",
    },
  },
  commitments: {
    eyebrow: "What You Can Hold Us To",
    h2: "Commitments, not marketing numbers.",
    stats: [
      {
        value: 0,
        suffix: "",
        label: "Vendor lock-in",
        body: "The model layer stays swappable. When a better model ships, we re-benchmark and swap the engine - no rebuild, no renegotiation.",
        span: "md:col-span-2",
      },
      {
        value: 100,
        suffix: "%",
        label: "Grounded, cited answers",
        body: "Retrieval with citations plus hardcoded business rules. When the data doesn't support an answer, the agent says so or escalates, instead of inventing one.",
        span: "md:col-span-2",
      },
      {
        value: 50,
        suffix: "/50",
        label: "Payment in stages, never all upfront",
        body: "Half before we start, half on acceptance, always under a written contract. You are never funding a promise, and you can walk away with what you paid for.",
        span: "md:col-span-2",
      },
    ],
  },
  cta: {
    h2: "Let's build something intelligent.",
    body: "Tell us what should never be answered slowly again. We will scope your first agent end to end.",
    button: "Start a conversation",
    emailLabel: "Or write to us directly",
  },
};

const pl: CoudersContent = {
  hero: {
    eyebrow: "Systemy AI na zamówienie",
    h1: "Autonomiczne Agenty AI i zaawansowane rozwiązania nowej generacji",
    sub: "Couders projektuje niestandardowe chatboty AI i autonomicznych agentów, trenowanych na Twoich prywatnych danych, mówiących językami Twoich klientów i związanych Twoimi regułami. Odpowiadają, decydują i działają całą dobę.",
    ctaPrimary: "Zacznij rozmowę",
    ctaSecondary: "Zobacz silnik",
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
  roiEstimator: {
    eyebrow: "Kalkulator ROI",
    h2: "Oszacuj swoje oszczędności.",
    lead: "Przesuń suwaki, aby dopasować kalkulator do skali Twojej firmy i zobacz, ile miesięcznie mogą zaoszczędzić autonomiczni agenci.",
    slider1Label: "Liczba powtarzalnych zapytań / zadań w miesiącu",
    slider2Label: "Wielkość zespołu obsługi / operacji",
    hoursLabel: "Zaoszczędzone godziny miesięcznie",
    savingsLabel: "Szacowana oszczędność finansowa",
    ctaLabel: "Zarezerwuj audyt na podstawie tych wyliczeń ➔",
  },
  logoTicker: {
    rowModels: "Modele, na których budujemy · to nie są nasi klienci",
    rowInfra: "Infrastruktura, której używamy · orkiestracja i automatyzacja",
    marqueeAria:
      "Logotypy wspieranych technologii AI: OpenAI, Anthropic, Google Gemini, Meta Llama, Manus, OpenClaw, Ollama, LangChain, Copilot, n8n i Pinecone",
  },
  process: {
    eyebrow: "Proces wdrożenia",
    h2: "Od pierwszej rozmowy do autonomicznej skali.",
    steps: [
      {
        no: "01",
        title: "Discovery",
        body: "Mapujemy rozmowy i procesy warte automatyzacji, definiujemy metryki sukcesu i wybieramy punkt startowy o najwyższej wartości.",
      },
      {
        no: "02",
        title: "Integracja danych i trening",
        body: "Podłączamy Twoje źródła, budujemy prywatny rdzeń wiedzy i oceniamy agenta na prawdziwych historycznych przypadkach, aż przekroczy Twoją poprzeczkę.",
      },
      {
        no: "03",
        title: "Wdrożenie",
        body: "Zabezpieczenia, punkty akceptacji i monitoring startują razem z agentem. Rollout jest stopniowy, obserwowalny i odwracalny na każdym kroku.",
      },
      {
        no: "04",
        title: "Autonomiczne skalowanie",
        body: "Pętle uczenia oddają produkcyjne doświadczenie z powrotem do systemu. Wraz z zaufaniem rośnie zakres agenta: od odpowiadania do działania.",
      },
    ],
  },
  reach: {
    eyebrow: "Jak pracujemy",
    h2: "Zdalnie, konkretnie, w języku Twojego klienta.",
    tiles: [
      {
        title: "Kraków",
        sub: "Nasz dom inżynierski",
        body: "Tu budujemy. Pracujemy z firmami z całej Polski i UE, spotkać się możemy, ale nic tego nie wymaga.",
        span: "md:col-span-3",
      },
      {
        title: "100% zdalnie",
        sub: "Bez wizyt, bez sprzętu",
        body: "Wpinamy się w systemy, które już masz: skrzynki, dokumenty, ERP. Niczego nie montujemy u Ciebie i nic nie staje na czas pracy.",
        span: "md:col-span-3",
      },
      {
        title: "Każdy język",
        sub: "Twoi klienci, ich słowa",
        body: "Agent odpowiada w języku, w którym do niego napisano, z tej samej bazy wiedzy, bez osobnego systemu do utrzymania.",
        span: "md:col-span-2",
      },
      {
        title: "Twoje środowisko",
        sub: "Dane zostają u Ciebie",
        body: "Budujemy w Twojej infrastrukturze i na Twoich kontach. Zostają przy Tobie dane, dostępy i wyłącznik.",
        span: "md:col-span-2",
      },
    ],
    stat: {
      value: "1-2 tyg.",
      label: "Tyle zwykle trwa uruchomienie pierwszego działającego bota, bez przebudowy tego, co już masz.",
      span: "md:col-span-2",
    },
  },
  commitments: {
    eyebrow: "Za co możesz nas rozliczyć",
    h2: "Zobowiązania, nie liczby marketingowe.",
    stats: [
      {
        value: 0,
        suffix: "",
        label: "Uzależnienia od dostawcy",
        span: "md:col-span-2",
        body: "Warstwa modeli pozostaje wymienna. Gdy wyjdzie lepszy model, robimy ponowny benchmark i wymieniamy silnik - bez przebudowy, bez renegocjacji.",
      },
      {
        value: 100,
        suffix: "%",
        label: "Odpowiedzi ugruntowane i cytowane",
        span: "md:col-span-2",
        body: "Wyszukiwanie z cytowaniami plus twarde reguły biznesowe w kodzie. Gdy dane nie potwierdzają odpowiedzi, agent mówi to wprost albo przekazuje sprawę dalej, zamiast zmyślać.",
      },
      {
        value: 50,
        suffix: "/50",
        label: "Płatność etapami, nigdy z góry",
        span: "md:col-span-2",
        body: "Połowa przed startem, połowa po odbiorze, zawsze na pisemnej umowie. Nie finansujesz obietnicy i w każdej chwili zostajesz z tym, za co zapłaciłeś.",
      },
    ],
  },
  cta: {
    h2: "Zbudujmy coś inteligentnego.",
    body: "Powiedz nam, co już nigdy nie powinno czekać na odpowiedź. Zaprojektujemy Twojego pierwszego agenta od początku do końca.",
    button: "Zacznij rozmowę",
    emailLabel: "Albo napisz do nas bezpośrednio",
  },
};

const COUDERS: Record<Locale, CoudersContent> = { en, pl };

export const getCouders = (locale: Locale): CoudersContent => COUDERS[locale] ?? en;
