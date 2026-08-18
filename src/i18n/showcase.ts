import type { Locale } from "./config";

/**
 * Copy for the agent showcase that replaces the "Trzy sposoby" pillars on the
 * homepage.
 *
 * Kept in its own module rather than folded into couders.ts on purpose: this
 * section is on trial. If it doesn't land with the team, reverting is deleting
 * one import and this file, with nothing to untangle out of the middle of the
 * shared dictionary.
 */

export type ShowcaseAgent = {
  no: string;
  title: string;
  teaser: string;
  /** Headline over the replay — the argument this agent makes. */
  claim: string;
};

export type ChatMsg = { from: "client" | "agent"; time: string; text: string };
export type CallTurn = { who: string; text: string };
export type Lead = {
  who: string;
  source: string;
  answers: [string, string, string];
  pass: boolean;
  verdict: string;
  at: string;
};
export type DocLine = { text: string; worry?: boolean; big?: boolean };

export type ShowcaseContent = {
  eyebrow: string;
  h2: string;
  lead: string;
  pick: string;
  picked: string;
  /** Shown in the panel before the replay starts. */
  waiting: string;
  note: string;
  agents: ShowcaseAgent[];

  chat: {
    channel: string;
    workTitle: string;
    messages: ChatMsg[];
    work: string[];
  };

  call: {
    incoming: string;
    live: string;
    ended: string;
    number: string;
    transcriptTitle: string;
    idle: string;
    turns: CallTurn[];
    outcomeTitle: string;
    outcomeNote: string;
  };

  funnel: {
    introHead: string;
    introStrong: string;
    introTail: string;
    convTitle: string;
    fromLabel: string;
    doneLabel: string;
    questions: [string, string, string];
    keptTitle: string;
    droppedTitle: string;
    keptPrefix: string;
    droppedPrefix: string;
    leads: Lead[];
    footer: string;
  };

  offer: {
    introHead: string;
    introStrong: string;
    introTail: string;
    noteTitle: string;
    fields: { label: string; value: string }[];
    phases: string[];
    doc: DocLine[];
    totalLabel: string;
    totalValue: string;
    inboxTitle: string;
    inboxSubject: string;
    inboxNote: string;
    footer: string;
  };
};

const pl: ShowcaseContent = {
  eyebrow: "Produkt",
  h2: "Cztery sposoby, jak to działa.",
  lead: "Wybierzcie agenta, a pod spodem odtworzy jedną swoją zmianę. Bez przechodzenia na inną stronę.",
  pick: "Zobacz jego zmianę",
  picked: "Pokazane niżej",
  waiting: "Przewiń niżej, żeby zobaczyć zapis zmiany.",
  note: "Zapisy są przykładowe. Na wdrożeniu wypełniamy je Waszymi rozmowami, Waszym cennikiem i Waszym kalendarzem.",

  agents: [
    {
      no: "01",
      title: "Firmowy Asystent Sprzedaży",
      teaser: "Zna katalog i cennik. Zbiera leady, gdy Ty śpisz.",
      claim: "Zobaczcie, co robi między jedną a drugą odpowiedzią.",
    },
    {
      no: "02",
      title: "Recepcjonista AI przez telefon",
      teaser: "Odbiera wieczorami, w nocy i w weekendy. Nikt nie słyszy sygnału w pustkę.",
      claim: "Telefon dzwoni o 21:40 w sobotę. Ktoś odbiera.",
    },
    {
      no: "03",
      title: "Błyskawiczny Kwalifikator Leadów",
      teaser: "Odzywa się do leadów z reklam w minutę. Odsiewa ciekawskich.",
      claim: "Cztery zgłoszenia z reklamy. Dwa warte telefonu.",
    },
    {
      no: "04",
      title: "Generator Ofert B2B",
      teaser: "Firmowa oferta PDF u klienta w piętnaście minut po spotkaniu.",
      claim: "Oferta u klienta, zanim ostygnie kawa po spotkaniu.",
    },
  ],

  chat: {
    channel: "WhatsApp · wtorek 22:47",
    workTitle: "Co robi w tym czasie",
    messages: [
      { from: "client", time: "22:47", text: "Dobry wieczór, interesuje mnie wykończenie mieszkania. Ile to mniej więcej kosztuje?" },
      { from: "agent", time: "22:47", text: "Dobry wieczór. Cena zależy głównie od metrażu i zakresu prac. Jaki to metraż i czy mówimy o stanie deweloperskim, czy o remoncie?" },
      { from: "client", time: "22:48", text: "78 m², stan deweloperski, pod klucz" },
      { from: "agent", time: "22:48", text: "Przy 78 m² w pakiecie standard wychodzi orientacyjnie 144 300 zł netto, czyli 1 850 zł za metr. W tej kwocie są materiały z naszej listy, robocizna i nadzór." },
      { from: "client", time: "22:49", text: "A jeśli chcę lepsze płytki niż te z listy?" },
      { from: "agent", time: "22:49", text: "Wtedy różnicę w cenie materiału dopisujemy do kosztorysu, robocizna zostaje bez zmian. Konkretnej kwoty nie podam — to już liczy kosztorysant." },
      { from: "client", time: "22:50", text: "A ile to trwa?" },
      { from: "agent", time: "22:50", text: "Przy tym metrażu zwykle 10–12 tygodni od podpisania umowy." },
      { from: "agent", time: "22:50", text: "Wiążącą wycenę dajemy po bezpłatnym pomiarze. Mogę przekazać zapytanie do biura — proszę o numer telefonu." },
      { from: "client", time: "22:51", text: "601 234 342" },
      { from: "agent", time: "22:51", text: "Dziękuję. Zapytanie jest już w biurze, ktoś odezwie się rano. Zapis rozmowy dołączyłem." },
    ],
    work: [
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
    ],
  },

  call: {
    incoming: "Połączenie przychodzące",
    live: "Rozmowa trwa",
    ended: "Rozłączono",
    number: "+48 601 ··· 342",
    transcriptTitle: "Zapis rozmowy",
    idle: "Sobota, 21:40. Biuro zamknięte od pięciu godzin.",
    turns: [
      { who: "Asystent", text: "Dobry wieczór, Couders, słucham?" },
      { who: "Klient", text: "Dzwonię w sprawie montażu w przyszłym miesiącu." },
      { who: "Asystent", text: "Sprawdzam terminy. Wtorek dziewiąta albo środa wpół do drugiej." },
      { who: "Klient", text: "Wtorek." },
      { who: "Asystent", text: "Zapisane. Potwierdzenie wyślę SMS-em." },
    ],
    outcomeTitle: "Wtorek, 9:00 — pomiar u klienta",
    outcomeNote: "SMS potwierdzający wysłany · transkrypt w karcie klienta",
  },

  funnel: {
    introHead: "Ktoś klika Waszą reklamę i zostawia numer. Zwykle oddzwaniacie za kilka godzin — ",
    introStrong: "agent odzywa się w minutę",
    introTail: " i zadaje trzy pytania. Do handlowca trafiają tylko ci, którzy na nie odpowiedzą sensownie.",
    convTitle: "Rozmowa z leadem",
    fromLabel: "z",
    doneLabel: "koniec",
    questions: ["Jaki budżet?", "Kiedy chcecie zacząć?", "Kto podejmuje decyzję?"],
    keptTitle: "Warci telefonu",
    droppedTitle: "Nie teraz",
    keptPrefix: "→ Warto zadzwonić: ",
    droppedPrefix: "→ Odsiany: ",
    leads: [
      {
        who: "Marek W.",
        source: "reklamy na Facebooku",
        answers: ["Do 15 tysięcy", "Jeszcze nie wiem", "Sam się rozglądam"],
        pass: false,
        verdict: "Za mały budżet, brak terminu",
        at: "52 s",
      },
      {
        who: "Anna K.",
        source: "reklamy w Google",
        answers: ["Około 180 tysięcy", "W tym kwartale", "Ja i prezes"],
        pass: true,
        verdict: "Budżet i termin się zgadzają",
        at: "1 min 07 s",
      },
      {
        who: "Tomasz R.",
        source: "reklamy na Facebooku",
        answers: ["Nie odpowiedział", "—", "—"],
        pass: false,
        verdict: "Nie odpisał na trzy wiadomości",
        at: "1 min 44 s",
      },
      {
        who: "Biuro Nowak",
        source: "reklamy w Google",
        answers: ["90 tysięcy", "Za dwa tygodnie", "Właściciel"],
        pass: true,
        verdict: "Gotowy do rozmowy, termin bliski",
        at: "2 min 31 s",
      },
    ],
    footer: "Cztery zgłoszenia z reklamy, dwa warte rozmowy. Handlowiec dzwoni tylko do tych dwóch i zna już ich budżet oraz termin.",
  },

  offer: {
    introHead: "Handlowiec wychodzi ze spotkania i wpisuje w telefonie trzy rzeczy: co klient oglądał, czego się obawiał i kto decyduje. ",
    introStrong: "Piętnaście minut później klient ma gotową ofertę w skrzynce",
    introTail: " — z odpowiedzią dokładnie na te obawy, o których mówił.",
    noteTitle: "Notatka ze spotkania",
    fields: [
      { label: "Co klient oglądał", value: "Linia pakująca LP-400 z podajnikiem" },
      { label: "Czego się obawia", value: "Terminu dostawy i serwisu w regionie" },
      { label: "Kto decyduje", value: "Prezes i dyrektor produkcji" },
    ],
    phases: [
      "Handlowiec wpisuje trzy rzeczy w telefonie",
      "Agent czyta notatkę i wyłapuje obawy klienta",
      "Pisze ofertę pod tego klienta, nie z szablonu",
      "Składa PDF w Waszej szacie graficznej",
      "Wysyła na maila — 15 minut po pożegnaniu",
    ],
    doc: [
      { text: "Oferta — linia pakująca LP-400", big: true },
      { text: "dla: Zakład Produkcyjny Nowak sp. z o.o." },
      { text: "Konfiguracja z podajnikiem, zgodnie z ustaleniami ze spotkania." },
      { text: "Dostawa i uruchomienie: 8 tygodni od zamówienia.", worry: true },
      { text: "Serwis: technik w Waszym województwie, dojazd do 24 h.", worry: true },
      { text: "Szkolenie operatorów w cenie, dwa dni na miejscu." },
    ],
    totalLabel: "Razem netto",
    totalValue: "412 000 zł",
    inboxTitle: "Skrzynka klienta · 15:47",
    inboxSubject: "Oferta — linia pakująca LP-400",
    inboxNote: "Klient czyta ją tego samego popołudnia, a nie w przyszły wtorek.",
    footer: "Dwa zdania na niebiesko to dokładnie te obawy, o których klient mówił na spotkaniu. Nie ma ich w szablonie — agent wyciągnął je z notatki.",
  },
};

const en: ShowcaseContent = {
  eyebrow: "Product",
  h2: "Four ways it works.",
  lead: "Pick an agent and it replays one of its shifts below. Without leaving this page.",
  pick: "See its shift",
  picked: "Shown below",
  waiting: "Scroll a little further to watch the shift.",
  note: "These are sample transcripts. On rollout we fill them with your conversations, your pricing and your calendar.",

  agents: [
    {
      no: "01",
      title: "Corporate Sales Assistant",
      teaser: "Knows your catalog and pricing. Collects leads while you sleep.",
      claim: "See what it does between one reply and the next.",
    },
    {
      no: "02",
      title: "AI Receptionist on the Phone",
      teaser: "Picks up evenings, nights and weekends. Nobody rings out into silence.",
      claim: "The phone rings at 9:40 pm on a Saturday. Someone picks up.",
    },
    {
      no: "03",
      title: "Instant Lead Qualifier",
      teaser: "Reaches ad leads within a minute. Filters out window-shoppers.",
      claim: "Four inquiries from ads. Two worth a phone call.",
    },
    {
      no: "04",
      title: "B2B Offer Generator",
      teaser: "A branded PDF offer in the client's inbox fifteen minutes after the meeting.",
      claim: "The offer lands before the coffee goes cold.",
    },
  ],

  chat: {
    channel: "WhatsApp · Tuesday 10:47 pm",
    workTitle: "What it does meanwhile",
    messages: [
      { from: "client", time: "22:47", text: "Good evening, I'm looking at fitting out a flat. Roughly what does that cost?" },
      { from: "agent", time: "22:47", text: "Good evening. The price depends mainly on floor area and scope. How many square metres, and is this a bare developer shell or a renovation?" },
      { from: "client", time: "22:48", text: "78 m², developer shell, turnkey" },
      { from: "agent", time: "22:48", text: "For 78 m² on the standard package that comes to roughly 144,300 PLN net, so 1,850 PLN per metre. That covers materials from our list, labour and supervision." },
      { from: "client", time: "22:49", text: "And if I want better tiles than the ones on the list?" },
      { from: "agent", time: "22:49", text: "Then the material price difference is added to the estimate and labour stays the same. I won't quote a figure — that one is for our estimator." },
      { from: "client", time: "22:50", text: "How long does it take?" },
      { from: "agent", time: "22:50", text: "At this size, usually 10–12 weeks from signing." },
      { from: "agent", time: "22:50", text: "A binding quote follows a free site survey. I can pass this to the office — could I have your phone number?" },
      { from: "client", time: "22:51", text: "601 234 342" },
      { from: "agent", time: "22:51", text: "Thank you. The office has it, someone will be in touch in the morning. I've attached the transcript." },
    ],
    work: [
      "Checking who's writing — new contact, not in the CRM",
      "Reading intent: fit-out quote",
      "Area and scope missing — asking instead of guessing",
      "Pulling the price list: standard package 1,850 PLN/m²",
      "Calculating: 78 × 1,850 = 144,300 PLN net",
      "Reading the service card — what's in the package",
      "Tiles off-list fall outside the price list — not making it up",
      "Checking typical lead time: 10–12 weeks",
      "The client is ready — asking for a phone number",
      "Creating the lead with transcript, handing it to the office",
    ],
  },

  call: {
    incoming: "Incoming call",
    live: "Call in progress",
    ended: "Call ended",
    number: "+48 601 ··· 342",
    transcriptTitle: "Call transcript",
    idle: "Saturday, 9:40 pm. The office closed five hours ago.",
    turns: [
      { who: "Assistant", text: "Good evening, Couders, how can I help?" },
      { who: "Caller", text: "I'm calling about an installation next month." },
      { who: "Assistant", text: "Checking availability. Tuesday at nine, or Wednesday half past one." },
      { who: "Caller", text: "Tuesday." },
      { who: "Assistant", text: "Booked. I'll send a confirmation by text." },
    ],
    outcomeTitle: "Tuesday, 9:00 — site survey",
    outcomeNote: "Confirmation text sent · transcript on the client record",
  },

  funnel: {
    introHead: "Someone clicks your ad and leaves a number. You usually call back hours later — ",
    introStrong: "the agent replies within a minute",
    introTail: " and asks three questions. Only the people who answer them sensibly reach a salesperson.",
    convTitle: "Conversation with the lead",
    fromLabel: "from",
    doneLabel: "done",
    questions: ["What's the budget?", "When do you want to start?", "Who makes the decision?"],
    keptTitle: "Worth a call",
    droppedTitle: "Not now",
    keptPrefix: "→ Worth calling: ",
    droppedPrefix: "→ Filtered out: ",
    leads: [
      {
        who: "Marek W.",
        source: "Facebook ads",
        answers: ["Up to 15,000", "Not sure yet", "Just browsing"],
        pass: false,
        verdict: "Budget too small, no timeline",
        at: "52 s",
      },
      {
        who: "Anna K.",
        source: "Google ads",
        answers: ["Around 180,000", "This quarter", "Me and the CEO"],
        pass: true,
        verdict: "Budget and timeline both check out",
        at: "1 min 07 s",
      },
      {
        who: "Tomasz R.",
        source: "Facebook ads",
        answers: ["No reply", "—", "—"],
        pass: false,
        verdict: "Ignored three messages",
        at: "1 min 44 s",
      },
      {
        who: "Nowak Office",
        source: "Google ads",
        answers: ["90,000", "In two weeks", "The owner"],
        pass: true,
        verdict: "Ready to talk, timeline is close",
        at: "2 min 31 s",
      },
    ],
    footer: "Four inquiries from ads, two worth a conversation. The salesperson calls only those two — and already knows their budget and timeline.",
  },

  offer: {
    introHead: "The rep walks out of the meeting and types three things into their phone: what the client looked at, what worried them, and who decides. ",
    introStrong: "Fifteen minutes later the offer is in the client's inbox",
    introTail: " — answering exactly the worries they raised.",
    noteTitle: "Meeting note",
    fields: [
      { label: "What they looked at", value: "LP-400 packaging line with feeder" },
      { label: "What worries them", value: "Delivery time and regional service" },
      { label: "Who decides", value: "CEO and production director" },
    ],
    phases: [
      "The rep types three things into their phone",
      "The agent reads the note and picks out the worries",
      "Writes for this client, not from a template",
      "Assembles the PDF in your brand styling",
      "Sends it — 15 minutes after the handshake",
    ],
    doc: [
      { text: "Offer — LP-400 packaging line", big: true },
      { text: "for: Nowak Manufacturing Ltd." },
      { text: "Configuration with feeder, as agreed in the meeting." },
      { text: "Delivery and commissioning: 8 weeks from order.", worry: true },
      { text: "Service: technician in your region, on site within 24 h.", worry: true },
      { text: "Operator training included, two days on site." },
    ],
    totalLabel: "Total net",
    totalValue: "412,000 PLN",
    inboxTitle: "Client's inbox · 3:47 pm",
    inboxSubject: "Offer — LP-400 packaging line",
    inboxNote: "They read it the same afternoon, not next Tuesday.",
    footer: "The two highlighted lines are exactly the worries the client raised in the meeting. They aren't in any template — the agent pulled them from the note.",
  },
};

const SHOWCASE: Record<Locale, ShowcaseContent> = { en, pl };

export const getShowcase = (locale: Locale): ShowcaseContent => SHOWCASE[locale] ?? en;
