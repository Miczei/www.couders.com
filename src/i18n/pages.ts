import type { Locale } from "./config";

/**
 * Content for the topical-silo sub-pages. Each page is a self-contained silo
 * for the "13 Pillars of Full-Stack AI"; pillar bodies are written as ~40-60
 * word self-contained answers (GEO/AI-search citability) with question-style
 * H3s. Home holds Pillar 1 (AI Interface Layer).
 */

export type Pillar = { no: number; title: string; question: string; body: string };
export type Contrast = { beginner: string; fullstack: string };
export type RelatedLink = { slug: string; label: string };

export type PageContent = {
  slug: string; // path under /[locale]
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  imageAlt: string;
  fomoH2: string;
  fomoIntro: string;
  contrastBeginnerLabel: string;
  contrastFullstackLabel: string;
  contrast: Contrast[];
  pillarsH2: string;
  pillars: Pillar[];
  ctaH2: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
  relatedH2: string;
  related: RelatedLink[];
};

export type PagesDict = {
  servicesLabel: string;
  aiEngine: PageContent;
  securityData: PageContent;
  methodology: PageContent;
};

const en: PagesDict = {
  servicesLabel: "Services",
  aiEngine: {
    slug: "services/ai-engine",
    metaTitle: "AI Engine & Agent Orchestration | Full-Stack AI Development | NOVA",
    metaDescription:
      "Multi-agent orchestration, long-term context and memory, connected tools and dynamic LLM routing. NOVA builds the reasoning core behind production AI, not a thin chatbot wrapper.",
    keywords: [
      "agent orchestration",
      "LLM routing",
      "AI memory and context",
      "connected tools MCP",
      "full-stack AI development",
    ],
    breadcrumb: "AI Engine",
    eyebrow: "AI Solutions & Orchestration",
    h1: "The AI engine that thinks, routes, and remembers.",
    intro:
      "Under every premium interface sits the part clients never see and competitors underestimate: the engine. NOVA builds multi-agent orchestration, persistent memory, tool connectivity and dynamic model routing, the reasoning layer that turns a demo into a system your business can run on.",
    imageAlt:
      "Dark-mode 3D visualization of an interconnected multi-agent AI orchestration network with glowing nodes",
    fomoH2: "What separates a real AI engine from a wrapper?",
    fomoIntro:
      "Most agencies ship a single prompt in front of one model and call it AI. It answers one question, forgets the next, and cannot touch your systems. When a competitor deploys real orchestration with memory and routing, that gap becomes visible in weeks, not years.",
    contrastBeginnerLabel: "Beginner AI wrapper",
    contrastFullstackLabel: "NOVA full-stack AI",
    contrast: [
      {
        beginner: "One prompt, one model, no fallback when it fails.",
        fullstack: "Dynamic LLM routing picks the right model per task and fails over automatically.",
      },
      {
        beginner: "Forgets the user the moment the chat closes.",
        fullstack: "Persistent context and memory recall every prior interaction.",
      },
      {
        beginner: "Can only talk. It cannot do anything.",
        fullstack: "Connected tools let the agent query APIs, databases and your stack.",
      },
      {
        beginner: "A single bot guessing at every task.",
        fullstack: "Specialized agents orchestrated by a planner that delegates work.",
      },
    ],
    pillarsH2: "The four pillars of our AI engine",
    pillars: [
      {
        no: 2,
        title: "Agent Orchestration",
        question: "How does multi-agent orchestration work?",
        body: "A planner agent decomposes a goal into subtasks and delegates each to a specialized agent, then merges the results. This beats one monolithic prompt because every step is scoped, testable and independently improvable, so complex workflows stay reliable at scale.",
      },
      {
        no: 4,
        title: "Context & Memory",
        question: "Why does AI memory matter for business?",
        body: "Without memory an agent restarts from zero on every message. NOVA gives agents short-term working context and long-term memory in a vector store, so the system recalls a customer's history, preferences and past decisions and responds like a team that knows them.",
      },
      {
        no: 6,
        title: "Connected Tools",
        question: "What are connected tools in an AI agent?",
        body: "Connected tools let an agent act, not just talk. Through typed function calls and the Model Context Protocol, our agents query live APIs, read your database and trigger real operations, turning conversation into completed work with auditable results.",
      },
      {
        no: 8,
        title: "LLM Routing",
        question: "What is dynamic LLM routing?",
        body: "Dynamic routing sends each request to the model that fits it best: a fast model for classification, a frontier model for hard reasoning. This cuts cost and latency while raising quality, and adds automatic fail-over so a single provider outage never takes your product down.",
      },
    ],
    ctaH2: "Build on an engine, not a wrapper.",
    ctaBody:
      "If your AI has to remember customers, use your tools and stay up under load, you need the engine, not a demo. Let's scope it.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See enterprise security",
    relatedH2: "Continue exploring",
    related: [
      { slug: "services/security-data", label: "Enterprise Security & Data" },
      { slug: "methodology", label: "Methodology & Refinement" },
    ],
  },
  securityData: {
    slug: "services/security-data",
    metaTitle: "Enterprise AI Security & Data Foundation | Guardrails & Access | NOVA",
    metaDescription:
      "Hardcoded business rules, encrypted vector data foundation, human-in-the-loop approval checkpoints and strict access controls. NOVA builds AI enterprises can actually trust.",
    keywords: [
      "enterprise AI security",
      "AI guardrails",
      "human in the loop approval",
      "vector database encryption",
      "AI access control",
    ],
    breadcrumb: "Enterprise Security & Data",
    eyebrow: "Enterprise Security & Data",
    h1: "AI your enterprise can actually trust.",
    intro:
      "An AI that can act is an AI that can act wrongly. NOVA wraps every agent in hardcoded business rules, encrypted data foundations, human approval checkpoints and strict access controls, so autonomy never means losing control of your business.",
    imageAlt:
      "Dark-mode 3D render of a metallic security vault protecting an encrypted data core with glowing lattice",
    fomoH2: "Why is unsecured AI a liability, not an asset?",
    fomoIntro:
      "A wrapper with your API keys and no guardrails is one bad prompt away from leaking data, approving a refund it should not, or acting on a hallucination. As regulators and enterprise buyers demand proof of control, ungoverned AI stops being a feature and becomes a reason you lose the deal.",
    contrastBeginnerLabel: "Ungoverned AI",
    contrastFullstackLabel: "NOVA governed AI",
    contrast: [
      {
        beginner: "The model decides the rules on the fly.",
        fullstack: "Core business rules are hardcoded and cannot be prompted away.",
      },
      {
        beginner: "High-stakes actions run with no oversight.",
        fullstack: "Approval checkpoints put a human in the loop before it matters.",
      },
      {
        beginner: "Data sits in plain text, exposed by design.",
        fullstack: "Encrypted vector and record stores protect every embedding.",
      },
      {
        beginner: "Everyone and every agent sees everything.",
        fullstack: "Role-based access scopes data to who and what needs it.",
      },
    ],
    pillarsH2: "The four pillars of enterprise trust",
    pillars: [
      {
        no: 3,
        title: "Core Business Rules",
        question: "How do you stop AI from breaking the rules?",
        body: "Critical constraints live in code, not in a prompt a user can override. Refund limits, compliance boundaries and brand rules are enforced deterministically around the model, so the AI stays creative where it should and rigid where it must.",
      },
      {
        no: 5,
        title: "Data Foundation",
        question: "How is AI training and memory data secured?",
        body: "Your knowledge lives in an encrypted vector database with access-scoped embeddings, not a public model's memory. Data is isolated per tenant, encrypted at rest and in transit, and never used to train third-party models, so your competitive edge stays yours.",
      },
      {
        no: 7,
        title: "Approval Checkpoints",
        question: "What is human-in-the-loop approval?",
        body: "For irreversible or high-value actions the agent pauses and requests a human decision, with full context attached. This keeps speed on routine work while guaranteeing that money moved, contracts sent and data deleted always cross a person first.",
      },
      {
        no: 10,
        title: "Security & Access",
        question: "How is access to the AI controlled?",
        body: "Every agent, tool and user operates under least-privilege, role-based access control. Permissions are explicit, auditable and revocable, so a compromised account or a misbehaving agent is contained to exactly what it was allowed to touch, and nothing more.",
      },
    ],
    ctaH2: "Autonomy without losing control.",
    ctaBody:
      "If your industry demands proof of guardrails, approvals and access control, we build AI that passes the audit. Let's talk security.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See the AI engine",
    relatedH2: "Continue exploring",
    related: [
      { slug: "services/ai-engine", label: "AI Solutions & Orchestration" },
      { slug: "methodology", label: "Methodology & Refinement" },
    ],
  },
  methodology: {
    slug: "methodology",
    metaTitle: "AI Methodology: Testing, Evals, Tracing & Continuous Refinement | NOVA",
    metaDescription:
      "How NOVA keeps AI improving in production: rigorous evals, auditable tracing and logs, closed learning loops and constant refinement. The discipline behind AI that gets better every week.",
    keywords: [
      "AI evals and testing",
      "LLM tracing and observability",
      "AI learning loops",
      "continuous AI improvement",
      "AI methodology",
    ],
    breadcrumb: "Methodology",
    eyebrow: "Methodology & Refinement",
    h1: "AI that gets measurably better every week.",
    intro:
      "Shipping AI is the start, not the finish. NOVA runs a continuous improvement cycle: evaluate against real cases, trace every decision, learn from production and refine relentlessly. This is the discipline that turns a launch into a system that compounds.",
    imageAlt:
      "Dark-mode 3D glowing infinity loop and analytics dashboard visualizing AI tracing logs",
    fomoH2: "Why does most agency AI quietly decay?",
    fomoIntro:
      "A wrapper is shipped once and never measured again. It has no evals, so no one notices when quality drifts; no tracing, so failures are unexplainable; no learning loop, so it never improves. Meanwhile a competitor on a refinement cycle pulls further ahead every single week.",
    contrastBeginnerLabel: "Ship-and-forget AI",
    contrastFullstackLabel: "NOVA refinement cycle",
    contrast: [
      {
        beginner: "No tests. Quality is a vibe.",
        fullstack: "Evals score every change against real cases before it ships.",
      },
      {
        beginner: "When it fails, nobody can say why.",
        fullstack: "Full tracing and logs make every AI decision auditable.",
      },
      {
        beginner: "Production feedback is thrown away.",
        fullstack: "Learning loops turn real usage into the next improvement.",
      },
      {
        beginner: "Frozen the day it launched.",
        fullstack: "Constant refinement compounds quality week over week.",
      },
    ],
    pillarsH2: "The four pillars of continuous improvement",
    pillars: [
      {
        no: 9,
        title: "Testing & Evals",
        question: "How do you test a non-deterministic AI?",
        body: "We build evaluation suites of real inputs with graded expected outcomes, then score every prompt, model and agent change against them. Nothing ships that lowers the score, so improvement is measured, not assumed, and regressions are caught before your users ever see them.",
      },
      {
        no: 11,
        title: "Tracing & Logs",
        question: "How do you debug an AI decision?",
        body: "Every request is traced end to end: the prompt, the routing choice, each tool call and the final answer. When something goes wrong you can replay the exact decision path, so failures become fixable engineering problems instead of unexplainable mysteries.",
      },
      {
        no: 12,
        title: "Learning Loops",
        question: "How does the AI learn from real usage?",
        body: "Production interactions, corrections and outcomes feed back into evals, memory and prompts. Real customer behavior becomes the training signal for the next iteration, so the system adapts to how your users actually work rather than how we guessed they would.",
      },
      {
        no: 13,
        title: "Constant Refinement",
        question: "What does continuous AI improvement look like?",
        body: "Refinement is a schedule, not an accident. We run the evaluate-trace-learn cycle on a cadence, shipping small measured gains continuously. Because AI content and models move fast, a system refreshed monthly stays sharp while a frozen one silently falls behind.",
      },
    ],
    ctaH2: "Choose AI that compounds.",
    ctaBody:
      "The gap between a frozen wrapper and a refined system widens every week. Let's put your AI on a cycle that keeps winning.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See the AI engine",
    relatedH2: "Continue exploring",
    related: [
      { slug: "services/ai-engine", label: "AI Solutions & Orchestration" },
      { slug: "services/security-data", label: "Enterprise Security & Data" },
    ],
  },
};

const pl: PagesDict = {
  servicesLabel: "Usługi",
  aiEngine: {
    slug: "services/ai-engine",
    metaTitle: "Silnik AI i orkiestracja agentów | Full-Stack AI | NOVA",
    metaDescription:
      "Orkiestracja wielu agentów, długoterminowy kontekst i pamięć, podłączone narzędzia i dynamiczny routing modeli LLM. NOVA buduje rdzeń rozumowania produkcyjnego AI, a nie cienką nakładkę na chatbota.",
    keywords: [
      "orkiestracja agentów",
      "routing LLM",
      "pamięć i kontekst AI",
      "podłączone narzędzia MCP",
      "full-stack AI",
    ],
    breadcrumb: "Silnik AI",
    eyebrow: "Rozwiązania AI i orkiestracja",
    h1: "Silnik AI, który myśli, routuje i pamięta.",
    intro:
      "Pod każdym dopracowanym interfejsem jest część, której klienci nie widzą, a konkurencja ją lekceważy: silnik. NOVA buduje orkiestrację wielu agentów, trwałą pamięć, łączność z narzędziami i dynamiczny routing modeli, czyli warstwę rozumowania, która zamienia demo w system, na którym firma może polegać.",
    imageAlt:
      "Ciemna wizualizacja 3D połączonej sieci orkiestracji wielu agentów AI ze świecącymi węzłami",
    fomoH2: "Co odróżnia prawdziwy silnik AI od nakładki?",
    fomoIntro:
      "Większość agencji stawia jeden prompt przed jednym modelem i nazywa to AI. Odpowie na jedno pytanie, zapomni kolejne i nie dotknie Twoich systemów. Gdy konkurent wdroży prawdziwą orkiestrację z pamięcią i routingiem, ta różnica staje się widoczna w tygodnie, nie lata.",
    contrastBeginnerLabel: "Nakładka dla początkujących",
    contrastFullstackLabel: "Full-stack AI od NOVA",
    contrast: [
      {
        beginner: "Jeden prompt, jeden model, brak planu B przy awarii.",
        fullstack: "Dynamiczny routing LLM dobiera właściwy model do zadania i sam przełącza się przy awarii.",
      },
      {
        beginner: "Zapomina użytkownika w chwili zamknięcia czatu.",
        fullstack: "Trwały kontekst i pamięć przywołują każdą wcześniejszą interakcję.",
      },
      {
        beginner: "Potrafi tylko rozmawiać. Nic nie zrobi.",
        fullstack: "Podłączone narzędzia pozwalają agentowi odpytać API, bazy i Twój stack.",
      },
      {
        beginner: "Jeden bot zgadujący przy każdym zadaniu.",
        fullstack: "Wyspecjalizowani agenci orkiestrowani przez plannera, który deleguje pracę.",
      },
    ],
    pillarsH2: "Cztery filary naszego silnika AI",
    pillars: [
      {
        no: 2,
        title: "Orkiestracja agentów",
        question: "Jak działa orkiestracja wielu agentów?",
        body: "Agent-planner rozkłada cel na podzadania i deleguje każde do wyspecjalizowanego agenta, a potem scala wyniki. Bije to jeden monolityczny prompt, bo każdy krok jest ograniczony, testowalny i osobno ulepszany, więc złożone procesy pozostają niezawodne w skali.",
      },
      {
        no: 4,
        title: "Kontekst i pamięć",
        question: "Dlaczego pamięć AI jest ważna dla biznesu?",
        body: "Bez pamięci agent zaczyna od zera przy każdej wiadomości. NOVA daje agentom krótkoterminowy kontekst roboczy i długoterminową pamięć w bazie wektorowej, więc system przywołuje historię klienta, preferencje i decyzje, i odpowiada jak zespół, który go zna.",
      },
      {
        no: 6,
        title: "Podłączone narzędzia",
        question: "Czym są podłączone narzędzia w agencie AI?",
        body: "Podłączone narzędzia pozwalają agentowi działać, nie tylko mówić. Przez typowane wywołania funkcji i protokół Model Context Protocol nasi agenci odpytują żywe API, czytają Twoją bazę i uruchamiają realne operacje, zamieniając rozmowę w wykonaną pracę z audytowalnym wynikiem.",
      },
      {
        no: 8,
        title: "Routing LLM",
        question: "Czym jest dynamiczny routing modeli LLM?",
        body: "Dynamiczny routing kieruje każde zapytanie do modelu, który pasuje najlepiej: szybki model do klasyfikacji, model frontier do trudnego rozumowania. Obniża to koszt i opóźnienia, podnosząc jakość, i dodaje automatyczne przełączanie, więc awaria jednego dostawcy nie kładzie produktu.",
      },
    ],
    ctaH2: "Buduj na silniku, nie na nakładce.",
    ctaBody:
      "Jeśli Twoje AI ma pamiętać klientów, korzystać z narzędzi i działać pod obciążeniem, potrzebujesz silnika, nie demo. Ustalmy zakres.",
    ctaPrimary: "Rozpocznij projekt",
    ctaSecondary: "Zobacz bezpieczeństwo enterprise",
    relatedH2: "Zobacz dalej",
    related: [
      { slug: "services/security-data", label: "Bezpieczeństwo i dane enterprise" },
      { slug: "methodology", label: "Metodologia i doskonalenie" },
    ],
  },
  securityData: {
    slug: "services/security-data",
    metaTitle: "Bezpieczeństwo AI i fundament danych enterprise | NOVA",
    metaDescription:
      "Twarde reguły biznesowe w kodzie, szyfrowany fundament danych wektorowych, punkty akceptacji z człowiekiem w pętli i ścisła kontrola dostępu. NOVA buduje AI, któremu enterprise faktycznie ufa.",
    keywords: [
      "bezpieczeństwo AI enterprise",
      "guardrails AI",
      "człowiek w pętli akceptacja",
      "szyfrowanie bazy wektorowej",
      "kontrola dostępu AI",
    ],
    breadcrumb: "Bezpieczeństwo i dane enterprise",
    eyebrow: "Bezpieczeństwo i dane enterprise",
    h1: "AI, któremu firma naprawdę może zaufać.",
    intro:
      "AI, które potrafi działać, potrafi też zadziałać źle. NOVA otacza każdego agenta twardymi regułami biznesowymi, szyfrowanym fundamentem danych, punktami akceptacji przez człowieka i ścisłą kontrolą dostępu, więc autonomia nigdy nie oznacza utraty kontroli nad firmą.",
    imageAlt:
      "Ciemny render 3D metalicznego sejfu chroniącego zaszyfrowany rdzeń danych ze świecącą siatką",
    fomoH2: "Dlaczego niezabezpieczone AI to obciążenie, nie atut?",
    fomoIntro:
      "Nakładka z Twoimi kluczami API i bez zabezpieczeń jest o jeden zły prompt od wycieku danych, zatwierdzenia zwrotu, którego nie powinna, albo działania na halucynacji. Gdy regulatorzy i kupujący z enterprise żądają dowodu kontroli, AI bez ładu przestaje być funkcją, a staje się powodem przegranej oferty.",
    contrastBeginnerLabel: "AI bez ładu",
    contrastFullstackLabel: "AI z ładem od NOVA",
    contrast: [
      {
        beginner: "Model ustala reguły w locie.",
        fullstack: "Kluczowe reguły biznesowe są w kodzie i nie da się ich obejść promptem.",
      },
      {
        beginner: "Ryzykowne akcje biegną bez nadzoru.",
        fullstack: "Punkty akceptacji stawiają człowieka w pętli, zanim zrobi się poważnie.",
      },
      {
        beginner: "Dane leżą jawnym tekstem, odsłonięte z założenia.",
        fullstack: "Szyfrowane magazyny wektorów i rekordów chronią każdy embedding.",
      },
      {
        beginner: "Każdy i każdy agent widzi wszystko.",
        fullstack: "Dostęp oparty na rolach zawęża dane do tego, kto i co ich potrzebuje.",
      },
    ],
    pillarsH2: "Cztery filary zaufania enterprise",
    pillars: [
      {
        no: 3,
        title: "Kluczowe reguły biznesowe",
        question: "Jak powstrzymać AI przed łamaniem reguł?",
        body: "Krytyczne ograniczenia żyją w kodzie, nie w promptcie, który użytkownik nadpisze. Limity zwrotów, granice compliance i zasady marki są egzekwowane deterministycznie wokół modelu, więc AI zostaje kreatywne tam, gdzie ma być, i sztywne tam, gdzie musi.",
      },
      {
        no: 5,
        title: "Fundament danych",
        question: "Jak zabezpieczone są dane treningowe i pamięć AI?",
        body: "Twoja wiedza żyje w szyfrowanej bazie wektorowej z embeddingami o zawężonym dostępie, nie w pamięci publicznego modelu. Dane są izolowane per klient, szyfrowane w spoczynku i w tranzycie i nigdy nie trenują cudzych modeli, więc Twoja przewaga zostaje Twoja.",
      },
      {
        no: 7,
        title: "Punkty akceptacji",
        question: "Czym jest akceptacja z człowiekiem w pętli?",
        body: "Przy akcjach nieodwracalnych lub o dużej wartości agent zatrzymuje się i prosi o decyzję człowieka, z pełnym kontekstem. Utrzymuje to szybkość przy rutynie, gwarantując, że przelane pieniądze, wysłane umowy i usunięte dane zawsze najpierw mijają człowieka.",
      },
      {
        no: 10,
        title: "Bezpieczeństwo i dostęp",
        question: "Jak kontrolowany jest dostęp do AI?",
        body: "Każdy agent, narzędzie i użytkownik działa w modelu najmniejszych uprawnień, opartym na rolach. Uprawnienia są jawne, audytowalne i odwoływalne, więc przejęte konto lub rozregulowany agent jest ograniczony dokładnie do tego, na co mu pozwolono, i niczego więcej.",
      },
    ],
    ctaH2: "Autonomia bez utraty kontroli.",
    ctaBody:
      "Jeśli Twoja branża wymaga dowodu zabezpieczeń, akceptacji i kontroli dostępu, budujemy AI, które przejdzie audyt. Porozmawiajmy o bezpieczeństwie.",
    ctaPrimary: "Rozpocznij projekt",
    ctaSecondary: "Zobacz silnik AI",
    relatedH2: "Zobacz dalej",
    related: [
      { slug: "services/ai-engine", label: "Rozwiązania AI i orkiestracja" },
      { slug: "methodology", label: "Metodologia i doskonalenie" },
    ],
  },
  methodology: {
    slug: "methodology",
    metaTitle: "Metodologia AI: testy, ewaluacje, tracing i ciągłe doskonalenie | NOVA",
    metaDescription:
      "Jak NOVA utrzymuje AI w ciągłym doskonaleniu na produkcji: rygorystyczne ewaluacje, audytowalny tracing i logi, zamknięte pętle uczenia i stałe doskonalenie. Dyscyplina za AI, które co tydzień jest lepsze.",
    keywords: [
      "ewaluacje i testy AI",
      "tracing i obserwowalność LLM",
      "pętle uczenia AI",
      "ciągłe doskonalenie AI",
      "metodologia AI",
    ],
    breadcrumb: "Metodologia",
    eyebrow: "Metodologia i doskonalenie",
    h1: "AI, które co tydzień jest mierzalnie lepsze.",
    intro:
      "Wdrożenie AI to początek, nie meta. NOVA prowadzi cykl ciągłego doskonalenia: ewaluacja na realnych przypadkach, tracing każdej decyzji, uczenie z produkcji i bezlitosne doskonalenie. To dyscyplina, która zamienia launch w system, który się kumuluje.",
    imageAlt:
      "Ciemna wizualizacja 3D świecącej pętli nieskończoności i dashboardu analitycznego z logami tracingu AI",
    fomoH2: "Dlaczego AI od większości agencji po cichu się psuje?",
    fomoIntro:
      "Nakładkę wdraża się raz i nigdy więcej nie mierzy. Nie ma ewaluacji, więc nikt nie zauważa spadku jakości; nie ma tracingu, więc awarie są niewytłumaczalne; nie ma pętli uczenia, więc nic się nie poprawia. W tym czasie konkurent w cyklu doskonalenia odjeżdża co tydzień.",
    contrastBeginnerLabel: "AI wdrożone i porzucone",
    contrastFullstackLabel: "Cykl doskonalenia NOVA",
    contrast: [
      {
        beginner: "Zero testów. Jakość na wyczucie.",
        fullstack: "Ewaluacje oceniają każdą zmianę na realnych przypadkach przed wdrożeniem.",
      },
      {
        beginner: "Gdy zawiedzie, nikt nie wie dlaczego.",
        fullstack: "Pełny tracing i logi czynią każdą decyzję AI audytowalną.",
      },
      {
        beginner: "Feedback z produkcji ląduje w koszu.",
        fullstack: "Pętle uczenia zamieniają realne użycie w kolejne usprawnienie.",
      },
      {
        beginner: "Zamrożone w dniu launchu.",
        fullstack: "Stałe doskonalenie kumuluje jakość tydzień po tygodniu.",
      },
    ],
    pillarsH2: "Cztery filary ciągłego doskonalenia",
    pillars: [
      {
        no: 9,
        title: "Testy i ewaluacje",
        question: "Jak testować niedeterministyczne AI?",
        body: "Budujemy zestawy ewaluacyjne z realnych wejść i ocenianych oczekiwanych wyników, a potem oceniamy każdą zmianę promptu, modelu i agenta. Nic, co obniża wynik, nie trafia na produkcję, więc poprawa jest mierzona, a regresje łapane, zanim zobaczy je użytkownik.",
      },
      {
        no: 11,
        title: "Tracing i logi",
        question: "Jak debugować decyzję AI?",
        body: "Każde zapytanie jest śledzone od końca do końca: prompt, wybór routingu, każde wywołanie narzędzia i finalna odpowiedź. Gdy coś pójdzie źle, odtwarzasz dokładną ścieżkę decyzji, więc awarie stają się naprawialnym problemem inżynierskim, a nie niewytłumaczalną zagadką.",
      },
      {
        no: 12,
        title: "Pętle uczenia",
        question: "Jak AI uczy się z realnego użycia?",
        body: "Interakcje produkcyjne, korekty i wyniki wracają do ewaluacji, pamięci i promptów. Realne zachowanie klientów staje się sygnałem uczącym dla kolejnej iteracji, więc system dopasowuje się do tego, jak Twoi użytkownicy naprawdę pracują, nie jak zgadywaliśmy.",
      },
      {
        no: 13,
        title: "Stałe doskonalenie",
        question: "Jak wygląda ciągłe doskonalenie AI?",
        body: "Doskonalenie to harmonogram, nie przypadek. Cykl ewaluuj-śledź-ucz uruchamiamy regularnie, wdrażając małe, mierzone zyski bez przerwy. Bo treści i modele AI pędzą, system odświeżany co miesiąc zostaje ostry, a zamrożony po cichu zostaje z tyłu.",
      },
    ],
    ctaH2: "Wybierz AI, które się kumuluje.",
    ctaBody:
      "Przepaść między zamrożoną nakładką a doskonalonym systemem rośnie co tydzień. Postawmy Twoje AI na cyklu, który wygrywa dalej.",
    ctaPrimary: "Rozpocznij projekt",
    ctaSecondary: "Zobacz silnik AI",
    relatedH2: "Zobacz dalej",
    related: [
      { slug: "services/ai-engine", label: "Rozwiązania AI i orkiestracja" },
      { slug: "services/security-data", label: "Bezpieczeństwo i dane enterprise" },
    ],
  },
};

const PAGES: Record<Locale, PagesDict> = { en, pl };

export const getPages = (locale: Locale): PagesDict => PAGES[locale] ?? en;
