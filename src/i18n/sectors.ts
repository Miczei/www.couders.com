import type { Locale } from "./config";

export type SectorTile = { title: string; body: string; span: string };

export type Sector = {
  id: "healthcare" | "legal" | "industrial";
  label: string;
  h2: string;
  lead: string;
  visualAria: string;
  tiles: SectorTile[];
};

export type SectorsContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  cta: string;
  sectors: Sector[];
};

const en: SectorsContent = {
  slug: "methodology",
  metaTitle: "Specialized AI Agents by Industry: Healthcare, Legal, Industrial | Couders",
  metaDescription:
    "Industry-specific AI agents from Couders: medical triage and patient monitoring bots, contract analysis and case-law research agents, predictive maintenance and QA vision systems.",
  keywords: [
    "healthcare AI agents",
    "legal AI contract analysis",
    "industrial predictive maintenance AI",
    "AI triage bot",
    "QA vision agents",
  ],
  breadcrumb: "Solutions",
  eyebrow: "Specialized Agents",
  h1: "Agents that speak your industry's language.",
  intro:
    "Generic chatbots break on domain reality. Couders builds sector-tuned agents on private data, hard business rules and human checkpoints, ready for the regulations and edge cases of your field.",
  cta: "Scope an agent for your sector",
  sectors: [
    {
      id: "healthcare",
      label: "Healthcare",
      h2: "Medicine that never sleeps.",
      lead: "Agents that ease the load on clinical staff while keeping every decision auditable and a clinician in the loop.",
      visualAria: "A heart-rate line morphing into a neural network node",
      tiles: [
        {
          title: "Triage bots",
          body: "Structured symptom intake in every language, urgency scoring against your clinical protocols, and instant hand-off to the right specialist queue.",
          span: "md:col-span-2",
        },
        {
          title: "Predictive diagnostics",
          body: "Models trained on your historical cases flag risk patterns early and attach the evidence trail a clinician needs to verify them.",
          span: "md:col-span-2",
        },
        {
          title: "24/7 patient monitoring",
          body: "Agents watch vitals streams and follow-up schedules around the clock, escalating to staff the moment thresholds are crossed.",
          span: "md:col-span-2",
        },
        {
          title: "Compliance by design",
          body: "Data stays in your infrastructure, every recommendation is logged, and high-stakes actions always cross a human first.",
          span: "md:col-span-6",
        },
      ],
    },
    {
      id: "legal",
      label: "Legal",
      h2: "Counsel at machine speed.",
      lead: "Research and review agents that read everything, cite everything and never bill an hour.",
      visualAria: "An abstract scales-of-justice drawn with one continuous line",
      tiles: [
        {
          title: "Automated contract analysis",
          body: "Clause extraction, deviation detection against your playbook and redline suggestions, with every finding linked to the source paragraph.",
          span: "md:col-span-2",
        },
        {
          title: "Instant case-law research",
          body: "Grounded retrieval across statutes, rulings and your own matter history, returning cited answers instead of confident guesses.",
          span: "md:col-span-2",
        },
        {
          title: "Risk & compliance bots",
          body: "Continuous screening of documents and processes against regulatory checklists, with alerts routed to the responsible counsel.",
          span: "md:col-span-2",
        },
        {
          title: "Privilege preserved",
          body: "Matter data is isolated per client, encrypted end to end and never used to train shared models.",
          span: "md:col-span-6",
        },
      ],
    },
    {
      id: "industrial",
      label: "Industrial",
      h2: "The factory that predicts itself.",
      lead: "Agents wired into your lines and sensors, turning telemetry into decisions before downtime happens.",
      visualAria: "Interlocking parametric gears drawn with one continuous line",
      tiles: [
        {
          title: "Supply chain optimization",
          body: "Demand forecasting and reorder agents that watch lead times, buffer stock and supplier risk across every site.",
          span: "md:col-span-2",
        },
        {
          title: "Predictive maintenance",
          body: "Vibration, temperature and cycle data feed models that schedule service before failure, not after.",
          span: "md:col-span-2",
        },
        {
          title: "QA vision agents",
          body: "Camera-based inspection tuned to your defect catalogue, flagging anomalies in real time on the line.",
          span: "md:col-span-2",
        },
        {
          title: "Shop-floor guardrails",
          body: "Agents act within hardcoded safety envelopes, and anything touching production equipment requires operator sign-off.",
          span: "md:col-span-6",
        },
      ],
    },
  ],
};

const pl: SectorsContent = {
  slug: "methodology",
  metaTitle: "Wyspecjalizowani agenci AI dla branż: medycyna, prawo, przemysł | Couders",
  metaDescription:
    "Branżowi agenci AI od Couders: boty triage i monitoring pacjentów, analiza umów i research orzecznictwa, predykcyjne utrzymanie ruchu i wizyjna kontrola jakości.",
  keywords: [
    "agenci AI medycyna",
    "AI analiza umów",
    "predykcyjne utrzymanie ruchu AI",
    "bot triage",
    "wizyjna kontrola jakości AI",
  ],
  breadcrumb: "Rozwiązania",
  eyebrow: "Wyspecjalizowani agenci",
  h1: "Agenci, którzy mówią językiem Twojej branży.",
  intro:
    "Generyczne chatboty wykładają się na realiach domeny. Couders buduje agentów dostrojonych do sektora: na prywatnych danych, twardych regułach biznesowych i punktach kontroli człowieka, gotowych na regulacje i przypadki brzegowe Twojego pola.",
  cta: "Zaprojektuj agenta dla swojej branży",
  sectors: [
    {
      id: "healthcare",
      label: "Medycyna",
      h2: "Medycyna, która nie śpi.",
      lead: "Agenci odciążają personel kliniczny, a każda decyzja pozostaje audytowalna i z klinicystą w pętli.",
      visualAria: "Linia EKG przechodząca w węzeł sieci neuronowej",
      tiles: [
        {
          title: "Boty triage",
          body: "Ustrukturyzowany wywiad objawowy w każdym języku, ocena pilności według Twoich protokołów klinicznych i natychmiastowe przekazanie do właściwej kolejki specjalisty.",
          span: "md:col-span-2",
        },
        {
          title: "Diagnostyka predykcyjna",
          body: "Modele trenowane na Twoich historycznych przypadkach wcześnie wychwytują wzorce ryzyka i dołączają ślad dowodowy do weryfikacji przez klinicystę.",
          span: "md:col-span-2",
        },
        {
          title: "Monitoring pacjenta 24/7",
          body: "Agenci całą dobę obserwują strumienie parametrów i harmonogramy kontroli, eskalując do personelu w chwili przekroczenia progów.",
          span: "md:col-span-2",
        },
        {
          title: "Zgodność w standardzie",
          body: "Dane zostają w Twojej infrastrukturze, każda rekomendacja jest logowana, a działania wysokiego ryzyka zawsze najpierw przechodzą przez człowieka.",
          span: "md:col-span-6",
        },
      ],
    },
    {
      id: "legal",
      label: "Prawo",
      h2: "Kancelaria w tempie maszyny.",
      lead: "Agenci researchu i przeglądu, którzy czytają wszystko, cytują wszystko i nie wystawiają faktur za godziny.",
      visualAria: "Abstrakcyjna waga sprawiedliwości narysowana jedną ciągłą linią",
      tiles: [
        {
          title: "Automatyczna analiza umów",
          body: "Ekstrakcja klauzul, wykrywanie odstępstw od Twojego playbooka i propozycje poprawek, z każdym wnioskiem podlinkowanym do akapitu źródłowego.",
          span: "md:col-span-2",
        },
        {
          title: "Błyskawiczny research orzecznictwa",
          body: "Ugruntowane wyszukiwanie po ustawach, orzeczeniach i historii Twoich spraw, zwracające odpowiedzi z cytatami zamiast pewnych siebie domysłów.",
          span: "md:col-span-2",
        },
        {
          title: "Boty ryzyka i compliance",
          body: "Ciągły przegląd dokumentów i procesów pod kątem list regulacyjnych, z alertami kierowanymi do odpowiedzialnego prawnika.",
          span: "md:col-span-2",
        },
        {
          title: "Tajemnica zachowana",
          body: "Dane spraw są izolowane per klient, szyfrowane od końca do końca i nigdy nie trenują współdzielonych modeli.",
          span: "md:col-span-6",
        },
      ],
    },
    {
      id: "industrial",
      label: "Przemysł",
      h2: "Fabryka, która przewiduje samą siebie.",
      lead: "Agenci wpięci w Twoje linie i czujniki, zamieniający telemetrię w decyzje, zanim zdarzy się przestój.",
      visualAria: "Zazębiające się parametryczne koła zębate narysowane jedną linią",
      tiles: [
        {
          title: "Optymalizacja łańcucha dostaw",
          body: "Agenci prognozowania popytu i zamówień, którzy pilnują czasów dostaw, zapasów buforowych i ryzyka dostawców we wszystkich zakładach.",
          span: "md:col-span-2",
        },
        {
          title: "Predykcyjne utrzymanie ruchu",
          body: "Dane o wibracjach, temperaturze i cyklach zasilają modele, które planują serwis przed awarią, nie po niej.",
          span: "md:col-span-2",
        },
        {
          title: "Wizyjni agenci QA",
          body: "Inspekcja kamerowa dostrojona do Twojego katalogu wad, oznaczająca anomalie na linii w czasie rzeczywistym.",
          span: "md:col-span-2",
        },
        {
          title: "Zabezpieczenia hali produkcyjnej",
          body: "Agenci działają w twardo zakodowanych kopertach bezpieczeństwa, a wszystko, co dotyka maszyn produkcyjnych, wymaga zatwierdzenia operatora.",
          span: "md:col-span-6",
        },
      ],
    },
  ],
};

const SECTORS: Record<Locale, SectorsContent> = { en, pl };

export const getSectors = (locale: Locale): SectorsContent => SECTORS[locale] ?? en;
