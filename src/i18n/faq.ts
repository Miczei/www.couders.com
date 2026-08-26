import type { Locale } from "./config";

/**
 * Content for the standalone FAQ page (/faq).
 *
 * Answers are written as self-contained 40 to 80 word paragraphs so they stand
 * on their own when lifted into an AI answer or a Google rich result, and they
 * feed the FAQPage JSON-LD in src/lib/schema.ts from this same source, so the
 * markup can never drift from what a visitor reads. Claims stay within what
 * the studio can actually back up: no invented client names, no guaranteed
 * numbers, no promises about billing that depend on a company that does not
 * exist yet. Bilingual, no dashes.
 */

export type FaqQuestion = { q: string; a: string };
export type FaqCategory = { id: string; label: string; items: FaqQuestion[] };

export type FaqContent = {
  slug: string; // "faq"
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  lead: string;
  jumpLabel: string;
  categories: FaqCategory[];
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

/* ── Polish ────────────────────────────────────────────────────────────── */

const pl: FaqContent = {
  slug: "faq",
  metaTitle: "FAQ: najczęstsze pytania o strony i wdrożenia AI | Couders",
  metaDescription:
    "Odpowiedzi na najczęstsze pytania o współpracę z Couders: zakres usług, przebieg projektu, terminy, wycena, chatboty AI, bezpieczeństwo danych i wsparcie po wdrożeniu.",
  keywords: [
    "FAQ agencja AI",
    "pytania o wdrożenie AI",
    "ile kosztuje strona internetowa",
    "chatbot AI dla firmy",
    "jak wygląda proces projektowy",
  ],
  breadcrumb: "FAQ",
  eyebrow: "FAQ",
  h1: "Najczęstsze pytania",
  lead: "Zebraliśmy pytania, które słyszymy najczęściej: o zakres prac, przebieg projektu, koszty, technologię i bezpieczeństwo danych. Jeśli nie znajdziesz swojego, napisz do nas, a dopiszemy odpowiedź.",
  jumpLabel: "Przejdź do sekcji",
  categories: [
    {
      id: "services",
      label: "Usługi i zakres",
      items: [
        {
          q: "Czym dokładnie zajmuje się Couders?",
          a: "Budujemy strony i aplikacje webowe oraz systemy AI, które za nimi stoją: chatboty i autonomicznych agentów wytrenowanych na treściach klienta. Projektujemy interfejs, silnik AI i zabezpieczenia jako jedną całość, więc nie dostajesz osobno strony i osobno wtyczki z czatem, tylko system, w którym oba elementy rozumieją Twój biznes.",
        },
        {
          q: "Czy robicie same strony, bez AI?",
          a: "Tak. Sporo projektów zaczyna się od samej strony: nowoczesnego serwisu firmowego, landing page'a albo przebudowy istniejącego serwisu pod wydajność i SEO. Warstwę AI można dołożyć później, bo architekturę projektujemy tak, żeby dodanie agenta nie wymagało przepisywania strony od zera.",
        },
        {
          q: "Czy przejmiecie stronę, którą zrobił ktoś inny?",
          a: "Tak, o ile mamy dostęp do kodu i hostingu. Zaczynamy od audytu: sprawdzamy stack, wydajność, bezpieczeństwo i dług techniczny, a potem mówimy wprost, co da się rozwijać, a co taniej wyjdzie napisać od nowa. Audyt kończy się listą rekomendacji, którą możesz wykorzystać także bez nas.",
        },
        {
          q: "W jakich językach dostarczacie projekty?",
          a: "Standardowo po polsku i angielsku, a serwisy budujemy jako wielojęzyczne od pierwszego dnia, z poprawnymi znacznikami hreflang i osobnymi adresami dla każdej wersji. Obsługujemy też projekty niemieckojęzyczne dla rynków DACH. Sam agent AI odpowiada w języku, w którym napisze do niego odwiedzający.",
        },
        {
          q: "Z jakimi branżami pracujecie?",
          a: "Najczęściej z firmami usługowymi i B2B, e-commerce oraz zespołami technologicznymi, ale liczy się dla nas nie branża, tylko to, czy da się zmierzyć efekt. Jeśli Twój problem to powtarzalna obsługa zapytań, długi proces ofertowania albo strona, która nie sprzedaje, prawdopodobnie umiemy pomóc.",
        },
      ],
    },
    {
      id: "process",
      label: "Proces i terminy",
      items: [
        {
          q: "Jak wygląda proces współpracy?",
          a: "Pracujemy w czterech krokach: odkrywanie (cele, odbiorcy, pytania, na które ma odpowiadać agent), projekt (prototyp interfejsu i animacji), budowa (wdrożenie na nowoczesnym stacku i trenowanie agenta na realnych treściach) oraz start (publikacja, pomiar Core Web Vitals i optymalizacja pod konwersje). Po każdym etapie dostajesz coś, co można zobaczyć i skomentować.",
        },
        {
          q: "Ile trwa realizacja projektu?",
          a: "Prosty, dobrze zdefiniowany serwis wizytówkowy zamykamy zwykle w kilka tygodni. Rozbudowany serwis z integracjami i agentem AI to najczęściej kilka miesięcy. Największy wpływ na termin ma nie kod, tylko tempo decyzji i dostępność treści po stronie klienta, dlatego harmonogram ustalamy dopiero po rozmowie o zakresie.",
        },
        {
          q: "Ile czasu zajmie mi to po Waszej stronie?",
          a: "Realnie kilka godzin na etap: warsztat startowy, przegląd projektu, dostarczenie treści i materiałów oraz odbiór. Prowadzimy projekt tak, żeby decyzje były zbierane w paczkach, a nie w codziennych pytaniach. Jeśli nie macie gotowych treści, możemy przygotować ich pierwszą wersję do akceptacji.",
        },
        {
          q: "Jak wygląda komunikacja w trakcie projektu?",
          a: "Masz jeden kanał kontaktu i jedną osobę odpowiedzialną za projekt, plus krótkie podsumowanie postępu w ustalonym rytmie. Pracujemy na środowisku testowym dostępnym pod linkiem przez cały czas trwania projektu, więc widzisz efekt na bieżąco, a nie dopiero na prezentacji końcowej.",
        },
      ],
    },
    {
      id: "pricing",
      label: "Wycena i rozliczenia",
      items: [
        {
          q: "Ile kosztuje strona albo wdrożenie AI?",
          a: "Nie mamy cennika z półki, bo zakres bywa skrajnie różny: inaczej wycenia się jednostronicowy landing, a inaczej serwis z integracją do CRM i agentem obsługującym zapytania. Po krótkiej rozmowie o zakresie przygotowujemy wycenę z rozbiciem na etapy, żeby było widać, za co dokładnie płacisz.",
        },
        {
          q: "Czy wycena jest bezpłatna i do czego mnie zobowiązuje?",
          a: "Wycena i pierwsza konsultacja są bezpłatne i nie zobowiązują do niczego. Możesz z nią porównać inne oferty. Dopiero podpisanie umowy uruchamia prace, a jej zakres, harmonogram i warunki rozliczenia ustalamy indywidualnie przed startem.",
        },
        {
          q: "Czy da się rozłożyć projekt na etapy?",
          a: "Tak i zwykle to rekomendujemy. Dzielimy projekt na etapy z własnym rezultatem i odbiorem, dzięki czemu po każdym z nich masz działający fragment systemu i realny punkt decyzyjny. To ogranicza ryzyko po obu stronach i pozwala zacząć od tej części, która najszybciej się zwraca.",
        },
        {
          q: "Co jest po stronie klienta poza budżetem projektu?",
          a: "Zwykle trzy rzeczy: domena, hosting oraz koszty zewnętrznych usług, z których korzysta wdrożenie, na przykład dostęp do modelu językowego rozliczany za zużycie. Te koszty zawsze pokazujemy w wycenie osobno, żeby nie było niespodzianek po starcie.",
        },
      ],
    },
    {
      id: "ai",
      label: "AI i chatboty",
      items: [
        {
          q: "Czym różni się Wasz agent AI od zwykłego chatbota?",
          a: "Zwykły chatbot odpowiada według sztywnego drzewka i gubi się przy pierwszym nietypowym pytaniu. Agent, którego budujemy, rozumie pytanie, korzysta z Twoich treści i podłączonych narzędzi, potrafi wykonać zadanie, na przykład zebrać dane do wyceny, i wie, kiedy przekazać rozmowę człowiekowi.",
        },
        {
          q: "Na czym trenujecie agenta?",
          a: "Na Twoich materiałach: treściach ze strony, ofertach, dokumentacji, bazie wiedzy i historii najczęstszych zapytań. Nie dokładamy wiedzy z zewnątrz do odpowiedzi o Twojej firmie, dzięki czemu agent mówi to, co faktycznie oferujesz, a nie to, co model uznał za prawdopodobne.",
        },
        {
          q: "Czy agent może powiedzieć klientowi coś nieprawdziwego?",
          a: "Ryzyko zawsze istnieje, dlatego ograniczamy je zasadami wpisanymi na stałe w system: agent odpowiada w oparciu o zatwierdzone treści, ma jasno wyznaczone granice tematów, a w sprawach wiążących, jak ceny czy terminy, kieruje do kontaktu z zespołem. Rozmowy można przeglądać i na tej podstawie dokręcać zachowanie agenta.",
        },
        {
          q: "Z jakich modeli korzystacie?",
          a: "Jesteśmy niezależni od dostawcy. Dobieramy model do zadania i budżetu, korzystając między innymi z rozwiązań OpenAI, Anthropic, Google i modeli otwartych. Architekturę projektujemy tak, żeby wymiana modelu była zmianą konfiguracji, a nie przepisywaniem całego wdrożenia.",
        },
        {
          q: "Czy agent zintegruje się z naszym CRM albo kalendarzem?",
          a: "Zwykle tak. Podłączamy się do systemów, które mają API lub obsługę webhooków, na przykład CRM, kalendarza, poczty czy arkusza. Jeśli system jest zamknięty, sprawdzamy w audycie, czy da się to obejść, i mówimy wprost, kiedy integracja nie ma sensu ekonomicznego.",
        },
      ],
    },
    {
      id: "security",
      label: "Bezpieczeństwo i dane",
      items: [
        {
          q: "Co dzieje się z danymi, które trafiają do agenta?",
          a: "Treść rozmowy przekazujemy do dostawcy modelu wyłącznie po to, żeby wygenerować odpowiedź. Nie wykorzystujemy jej do trenowania własnych modeli. Zakres przetwarzania, okresy przechowywania i listę dostawców opisujemy w polityce prywatności, a przy wdrożeniach firmowych ustalamy je dodatkowo w umowie.",
        },
        {
          q: "Czy wdrożenie będzie zgodne z RODO?",
          a: "Projektujemy je z tym założeniem: minimalizujemy zakres zbieranych danych, ustalamy podstawy prawne i okresy przechowywania, podpisujemy umowy powierzenia z dostawcami i dokumentujemy przepływ danych. Ostateczna ocena zgodności zależy też od Twoich wewnętrznych procesów, dlatego przekazujemy komplet informacji potrzebnych osobie odpowiedzialnej za ochronę danych.",
        },
        {
          q: "Kto jest właścicielem kodu i treści po zakończeniu projektu?",
          a: "Ty, na zasadach zapisanych w umowie. Przekazujemy repozytorium, dostęp do środowisk i dokumentację. Nie stosujemy zamkniętych rozwiązań, które uzależniają Cię od nas: projekt stoi na powszechnie używanych technologiach, więc może go rozwijać dowolny kompetentny zespół.",
        },
        {
          q: "Gdzie hostowane są nasze dane?",
          a: "Domyślnie wybieramy dostawców z infrastrukturą w Unii Europejskiej. Część usług, w szczególności dostawcy modeli językowych, działa poza EOG, wtedy przekazywanie danych opiera się na mechanizmach z rozdziału V RODO. Zawsze pokazujemy tę listę przed startem, żeby dało się ją zaakceptować świadomie.",
        },
      ],
    },
    {
      id: "cooperation",
      label: "Współpraca i wsparcie",
      items: [
        {
          q: "Co dzieje się po uruchomieniu strony?",
          a: "Monitorujemy działanie i wydajność, poprawiamy to, co wyjdzie w pierwszych tygodniach użycia, i przekazujemy instrukcję samodzielnej edycji treści. Możemy też prowadzić stałą opiekę: aktualizacje, kopie zapasowe, rozwój agenta i drobne zmiany w ustalonym miesięcznym zakresie.",
        },
        {
          q: "Czy pracujecie z klientami spoza Polski?",
          a: "Tak. Prowadzimy projekty dla zespołów z Niemiec, Austrii i Szwajcarii, Ameryki Północnej oraz regionu Azji i Pacyfiku. Pracujemy zdalnie, dopasowujemy godziny spotkań do Twojej strefy czasowej, a dokumentację i komunikację prowadzimy w uzgodnionym języku.",
        },
        {
          q: "Czy podpisujecie NDA?",
          a: "Tak, chętnie podpisujemy NDA przed rozmową o szczegółach, jeśli tego potrzebujesz. Możesz przesłać własny wzór albo poprosić o nasz. Niezależnie od NDA nie pokazujemy materiałów klienta w portfolio bez wyraźnej zgody.",
        },
        {
          q: "Jak zacząć współpracę?",
          a: "Napisz przez formularz kontaktowy albo bezpośrednio na nasz adres e-mail i opisz w kilku zdaniach, co chcesz osiągnąć. Odpowiadamy w ciągu jednego dnia roboczego, umawiamy krótką rozmowę o zakresie i na tej podstawie przygotowujemy wycenę z podziałem na etapy.",
        },
      ],
    },
  ],
  ctaTitle: "Nie znalazłeś odpowiedzi?",
  ctaBody:
    "Zadaj pytanie wprost, a odpowiemy konkretnie: bez prezentacji sprzedażowej i bez zobowiązań. Jeśli pytanie powtórzy się częściej, trafi na tę stronę.",
  ctaPrimary: "Zadaj pytanie",
  ctaSecondary: "Zobacz rozwiązania",
};

/* ── English ───────────────────────────────────────────────────────────── */

const en: FaqContent = {
  slug: "faq",
  metaTitle: "FAQ: websites and AI implementations answered | Couders",
  metaDescription:
    "Answers to the questions we hear most about working with Couders: scope of work, project process, timelines, pricing, AI agents, data protection and post launch support.",
  keywords: [
    "AI agency FAQ",
    "AI implementation questions",
    "website cost",
    "custom AI chatbot",
    "web project process",
  ],
  breadcrumb: "FAQ",
  eyebrow: "FAQ",
  h1: "Frequently asked questions",
  lead: "The questions we hear most often: what we build, how a project runs, what it costs, which technology we use and how we handle data. If yours is missing, ask us and we will add the answer here.",
  jumpLabel: "Jump to a section",
  categories: [
    {
      id: "services",
      label: "Services and scope",
      items: [
        {
          q: "What exactly does Couders do?",
          a: "We build websites and web applications together with the AI systems behind them: chatbots and autonomous agents trained on your own content. Interface, AI engine and guardrails are designed as one system, so you do not end up with a site and a bolted on chat plugin, but with something where both halves understand your business.",
        },
        {
          q: "Do you build websites without AI?",
          a: "Yes. Many projects start with the site alone: a modern company website, a landing page or a rebuild of an existing site for performance and SEO. The AI layer can come later, because we design the architecture so that adding an agent does not mean rewriting the site from scratch.",
        },
        {
          q: "Can you take over a site somebody else built?",
          a: "Yes, as long as we get access to the code and the hosting. We start with an audit of the stack, performance, security and technical debt, then tell you plainly what is worth keeping and what is cheaper to rebuild. The audit ends with a list of recommendations you can use even without us.",
        },
        {
          q: "Which languages do you deliver in?",
          a: "Polish and English as standard, and we build sites as multilingual from day one, with correct hreflang tags and separate URLs per language. We also run German language projects for the DACH markets. The AI agent itself replies in whatever language the visitor writes in.",
        },
        {
          q: "Which industries do you work with?",
          a: "Mostly service and B2B companies, e-commerce and technology teams, but the industry matters less to us than whether the outcome can be measured. If your problem is repetitive enquiry handling, a slow quoting process or a site that does not sell, we can probably help.",
        },
      ],
    },
    {
      id: "process",
      label: "Process and timelines",
      items: [
        {
          q: "How does a project run?",
          a: "In four steps: discovery (goals, audience, the questions the agent must answer), design (interface and motion prototype), build (implementation on a modern stack and training the agent on real content) and launch (go live, Core Web Vitals measurement, conversion tuning). Each step ends with something you can see and comment on.",
        },
        {
          q: "How long does a project take?",
          a: "A small, well defined company site usually takes a few weeks. A larger site with integrations and an AI agent is more often a few months. The biggest factor is not the code but how fast decisions are made and content arrives on your side, which is why we set the schedule only after a scoping conversation.",
        },
        {
          q: "How much of my time will it take?",
          a: "Realistically a few hours per stage: the kick off workshop, a design review, supplying content and materials, and sign off. We batch decisions rather than pinging you daily. If you have no content ready, we can draft a first version for your approval.",
        },
        {
          q: "How do we communicate during the project?",
          a: "One contact channel and one person accountable for the project, plus a short progress summary at an agreed rhythm. We work on a staging environment that stays available by link throughout, so you see progress continuously instead of at a final presentation.",
        },
      ],
    },
    {
      id: "pricing",
      label: "Pricing and billing",
      items: [
        {
          q: "What does a website or an AI implementation cost?",
          a: "There is no off the shelf price list, because scope varies enormously: a single landing page and a site with CRM integration and an enquiry handling agent are different projects. After a short scoping conversation we prepare a quote broken down by stage, so you can see exactly what you are paying for.",
        },
        {
          q: "Is the quote free, and what does it commit me to?",
          a: "The quote and the first consultation are free and commit you to nothing. You are welcome to compare it with other offers. Work starts only once an agreement is signed, and its scope, schedule and payment terms are agreed individually before that.",
        },
        {
          q: "Can the project be split into stages?",
          a: "Yes, and we usually recommend it. We split the work into stages that each produce a result and a sign off, so after every one you have a working part of the system and a real decision point. It lowers risk on both sides and lets you start with the part that pays back fastest.",
        },
        {
          q: "What costs sit outside the project budget?",
          a: "Usually three: the domain, the hosting and any external services the implementation uses, for example usage based access to a language model. We always list these separately in the quote so nothing surprises you after launch.",
        },
      ],
    },
    {
      id: "ai",
      label: "AI and chatbots",
      items: [
        {
          q: "How is your AI agent different from a normal chatbot?",
          a: "A normal chatbot follows a fixed decision tree and breaks on the first unusual question. The agents we build understand the question, use your content and connected tools, can complete a task such as collecting details for a quote, and know when to hand the conversation to a human.",
        },
        {
          q: "What do you train the agent on?",
          a: "On your material: site content, offers, documentation, knowledge base and the history of your most common enquiries. We do not let outside knowledge into answers about your company, so the agent says what you actually offer rather than what the model finds plausible.",
        },
        {
          q: "Can the agent tell a customer something untrue?",
          a: "The risk always exists, so we constrain it with rules hardcoded into the system: the agent answers from approved content, has clearly bounded topics, and routes anything binding, such as prices or deadlines, to the team. Conversations can be reviewed, and the agent's behaviour tightened from what they show.",
        },
        {
          q: "Which models do you use?",
          a: "We are provider agnostic. We match the model to the task and the budget, working with OpenAI, Anthropic, Google and open models among others. The architecture is designed so that swapping a model is a configuration change rather than a rewrite of the whole implementation.",
        },
        {
          q: "Can the agent integrate with our CRM or calendar?",
          a: "Usually yes. We connect to systems that expose an API or webhooks, such as a CRM, calendar, mailbox or spreadsheet. If a system is closed, the audit tells us whether there is a way around it, and we say plainly when an integration does not make economic sense.",
        },
      ],
    },
    {
      id: "security",
      label: "Security and data",
      items: [
        {
          q: "What happens to the data people give the agent?",
          a: "Conversation content goes to the model provider only to generate an answer. We do not use it to train our own models. The scope of processing, retention periods and the list of providers are described in our privacy policy, and for company deployments they are additionally fixed in the contract.",
        },
        {
          q: "Will the implementation be GDPR compliant?",
          a: "We design it to be: minimal data collection, defined legal bases and retention periods, data processing agreements with providers, and documented data flows. Final compliance also depends on your internal processes, so we hand over everything your data protection officer needs to assess it.",
        },
        {
          q: "Who owns the code and content afterwards?",
          a: "You do, on the terms set out in the agreement. We hand over the repository, environment access and documentation. We avoid proprietary lock in: the project runs on widely used technology, so any competent team can carry it forward.",
        },
        {
          q: "Where is our data hosted?",
          a: "By default we choose providers with infrastructure in the European Union. Some services, language model providers in particular, operate outside the EEA, in which case transfers rely on the mechanisms in Chapter V of the GDPR. We always show that list before we start, so you can accept it knowingly.",
        },
      ],
    },
    {
      id: "cooperation",
      label: "Working together",
      items: [
        {
          q: "What happens after launch?",
          a: "We monitor behaviour and performance, fix whatever the first weeks of real use surface, and hand over instructions for editing content yourselves. We can also provide ongoing care: updates, backups, agent improvements and small changes within an agreed monthly scope.",
        },
        {
          q: "Do you work with clients outside Poland?",
          a: "Yes. We run projects for teams in Germany, Austria and Switzerland, North America and the Asia Pacific region. We work remotely, fit meetings to your time zone, and keep documentation and communication in the language we agree on.",
        },
        {
          q: "Will you sign an NDA?",
          a: "Yes, gladly, before we discuss specifics if that is what you need. Send us your template or ask for ours. NDA or not, we never show client material in our portfolio without explicit permission.",
        },
        {
          q: "How do we get started?",
          a: "Write through the contact form or straight to our email address and describe in a few sentences what you want to achieve. We reply within one business day, arrange a short scoping call, and prepare a stage by stage quote from it.",
        },
      ],
    },
  ],
  ctaTitle: "Question not answered here?",
  ctaBody:
    "Ask it directly and you will get a straight answer, with no sales deck and no obligation. If it comes up often enough, it ends up on this page.",
  ctaPrimary: "Ask a question",
  ctaSecondary: "See our solutions",
};

const faq: Record<Locale, FaqContent> = { en, pl };

export const getFaq = (locale: Locale): FaqContent => faq[locale] ?? en;
