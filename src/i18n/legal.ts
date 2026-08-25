import type { Locale } from "./config";

/**
 * Content for the two legal documents: Terms of Service (/terms) and Privacy
 * Policy (/privacy).
 *
 * The copy describes what this site ACTUALLY does, verified against the code:
 *  - the contact form (src/app/api/contact/route.ts) forwards firstName,
 *    lastName, email, message and a timestamp to GOOGLE_SHEETS_WEBHOOK_URL,
 *  - the chat assistant (src/components/chat/ChatProvider.tsx) posts the
 *    conversation to an n8n cloud webhook and keeps a thread id in
 *    sessionStorage under "aiw_thread_id",
 *  - there is no analytics, no advertising pixel and no cookie of our own.
 * If any of that changes, the matching section here has to change with it.
 *
 * The operator's identity is NOT written into this copy. It comes from
 * src/lib/legal.ts, so registering the company later is a one file edit.
 * Bilingual, no dashes.
 */

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export type LegalSection = { id: string; h2: string; blocks: LegalBlock[] };

export type LegalContent = {
  slug: string; // "terms" | "privacy"
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  lead: string;
  updatedLabel: string;
  tocLabel: string;
  identity: {
    h2: string;
    intro: string;
    /** Used while LEGAL_ENTITY.registered is false. */
    unregistered: string;
    addressLabel: string;
    registryLabel: string;
    emailLabel: string;
  };
  sections: LegalSection[];
  contactTitle: string;
  contactBody: string;
  contactCta: string;
};

export type LegalDict = { terms: LegalContent; privacy: LegalContent };

/* ── Polish ────────────────────────────────────────────────────────────── */

const plTerms: LegalContent = {
  slug: "terms",
  metaTitle: "Regulamin serwisu | Couders",
  metaDescription:
    "Regulamin świadczenia usług drogą elektroniczną w serwisie Couders: zakres usług, zasady korzystania z formularza kontaktowego i asystenta AI, reklamacje oraz prawa autorskie.",
  keywords: [
    "regulamin serwisu",
    "regulamin świadczenia usług drogą elektroniczną",
    "warunki korzystania",
    "Couders regulamin",
  ],
  breadcrumb: "Regulamin",
  eyebrow: "Dokumenty",
  h1: "Regulamin serwisu",
  lead: "Ten regulamin określa zasady korzystania z serwisu couders.com oraz warunki świadczenia usług drogą elektroniczną: przeglądania treści, korzystania z formularza kontaktowego i rozmowy z asystentem AI.",
  updatedLabel: "Ostatnia aktualizacja",
  tocLabel: "W tym dokumencie",
  identity: {
    h2: "Kto prowadzi serwis",
    intro: "Usługodawcą i podmiotem prowadzącym serwis jest:",
    unregistered:
      "Couders to obecnie zespół projektowy, który nie został jeszcze zarejestrowany jako spółka ani jednoosobowa działalność gospodarcza. Do czasu rejestracji serwis prowadzą osoby tworzące zespół Couders, a kontakt we wszystkich sprawach dotyczących serwisu odbywa się przez podany niżej adres e-mail. Po rejestracji uzupełnimy tutaj pełną nazwę, adres siedziby oraz numery NIP i REGON, a informacja o zmianie pojawi się w dacie aktualizacji dokumentu.",
    addressLabel: "Adres",
    registryLabel: "Dane rejestrowe",
    emailLabel: "Kontakt",
  },
  sections: [
    {
      id: "general",
      h2: "1. Postanowienia ogólne",
      blocks: [
        {
          kind: "p",
          text: "Regulamin jest regulaminem w rozumieniu art. 8 ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną i określa zasady, na jakich Usługodawca udostępnia serwis oraz świadczy usługi na rzecz Użytkowników.",
        },
        {
          kind: "p",
          text: "Regulamin jest nieodpłatnie udostępniony przed zawarciem umowy o świadczenie usług drogą elektroniczną w sposób umożliwiający jego pozyskanie, odtwarzanie i utrwalanie treści za pomocą systemu teleinformatycznego, z którego korzysta Użytkownik.",
        },
        {
          kind: "p",
          text: "Rozpoczęcie korzystania z serwisu oznacza akceptację regulaminu. Użytkownik, który nie akceptuje regulaminu, powinien zaprzestać korzystania z serwisu.",
        },
      ],
    },
    {
      id: "definitions",
      h2: "2. Definicje",
      blocks: [
        {
          kind: "ul",
          items: [
            "Serwis: strona internetowa dostępna pod adresem couders.com wraz ze wszystkimi podstronami.",
            "Usługodawca: podmiot prowadzący serwis, wskazany w sekcji „Kto prowadzi serwis”.",
            "Użytkownik: każda osoba korzystająca z serwisu, w tym osoba przeglądająca treści, wysyłająca formularz kontaktowy lub prowadząca rozmowę z asystentem AI.",
            "Konsument: osoba fizyczna zawierająca z Usługodawcą umowę niezwiązaną bezpośrednio z jej działalnością gospodarczą lub zawodową.",
            "Usługi: usługi świadczone drogą elektroniczną w rozumieniu ustawy o świadczeniu usług drogą elektroniczną, opisane w punkcie 3.",
            "Asystent AI: udostępniony w serwisie interfejs rozmowy oparty na modelach językowych, odpowiadający na pytania Użytkownika.",
          ],
        },
      ],
    },
    {
      id: "services",
      h2: "3. Rodzaje i zakres usług",
      blocks: [
        { kind: "p", text: "Usługodawca świadczy drogą elektroniczną następujące usługi nieodpłatne:" },
        {
          kind: "ul",
          items: [
            "Udostępnianie treści serwisu: przeglądanie stron informacyjnych, opisów usług i materiałów o charakterze marketingowym. Usługa rozpoczyna się z chwilą wejścia na stronę i kończy z chwilą jej opuszczenia.",
            "Formularz kontaktowy: umożliwia przesłanie zapytania do zespołu Couders. Usługa rozpoczyna się z chwilą wypełnienia formularza i kończy z chwilą jego wysłania lub opuszczenia strony.",
            "Asystent AI: umożliwia zadanie pytania o zakres usług i uzyskanie automatycznej odpowiedzi. Usługa rozpoczyna się z chwilą otwarcia okna rozmowy i kończy z chwilą jego zamknięcia lub zakończenia sesji przeglądarki.",
          ],
        },
        {
          kind: "p",
          text: "Wszystkie usługi opisane w tym punkcie są bezpłatne. Serwis nie prowadzi sprzedaży online, nie przyjmuje płatności i nie wymaga zakładania konta.",
        },
        {
          kind: "p",
          text: "Właściwa współpraca projektowa (analiza, projektowanie, wdrożenie, utrzymanie) nie jest przedmiotem tego regulaminu. Jej zakres, harmonogram, wynagrodzenie i odpowiedzialność stron regulowane są odrębną umową zawieraną indywidualnie.",
        },
      ],
    },
    {
      id: "technical",
      h2: "4. Wymagania techniczne",
      blocks: [
        {
          kind: "p",
          text: "Do prawidłowego korzystania z serwisu potrzebne są: urządzenie z dostępem do internetu, aktualna wersja przeglądarki (Chrome, Safari, Firefox lub Edge) z włączoną obsługą JavaScript, a w przypadku formularza kontaktowego również aktywny adres e-mail.",
        },
        {
          kind: "p",
          text: "Usługodawca informuje, że korzystanie z internetu wiąże się z typowymi zagrożeniami, w szczególności z możliwością działania szkodliwego oprogramowania oraz prób nieuprawnionego dostępu do danych. Zalecane jest korzystanie z aktualnego oprogramowania antywirusowego i aktualizowanie przeglądarki.",
        },
      ],
    },
    {
      id: "contact-form",
      h2: "5. Formularz kontaktowy",
      blocks: [
        {
          kind: "p",
          text: "Formularz kontaktowy wymaga podania imienia, nazwiska i adresu e-mail. Treść wiadomości jest opcjonalna. Podanie danych jest dobrowolne, ale niezbędne do udzielenia odpowiedzi.",
        },
        {
          kind: "p",
          text: "Użytkownik zobowiązuje się do podania danych prawdziwych oraz do niepodawania danych osób trzecich bez ich zgody. Wysłanie formularza nie zobowiązuje żadnej ze stron do zawarcia umowy.",
        },
        {
          kind: "p",
          text: "Zasady przetwarzania danych z formularza opisuje Polityka prywatności.",
        },
      ],
    },
    {
      id: "ai-assistant",
      h2: "6. Asystent AI",
      blocks: [
        {
          kind: "p",
          text: "Asystent AI generuje odpowiedzi automatycznie, na podstawie modelu językowego i materiałów o serwisie. Odpowiedzi mają charakter wyłącznie informacyjny i pomocniczy.",
        },
        {
          kind: "ul",
          items: [
            "Odpowiedzi asystenta mogą być niekompletne, nieaktualne lub błędne i nie powinny być traktowane jako porada prawna, podatkowa, finansowa ani techniczna.",
            "Odpowiedź asystenta, w tym wskazanie ceny, terminu lub zakresu prac, nie stanowi oferty w rozumieniu art. 66 Kodeksu cywilnego ani wiążącego zobowiązania Usługodawcy.",
            "Wiążące ustalenia zapadają wyłącznie w bezpośrednim kontakcie z zespołem i w formie pisemnej lub dokumentowej.",
            "Użytkownik nie powinien wprowadzać do rozmowy danych wrażliwych, haseł, danych objętych tajemnicą przedsiębiorstwa ani danych osobowych osób trzecich.",
          ],
        },
        {
          kind: "p",
          text: "Usługodawca może w każdej chwili zmienić, ograniczyć lub wyłączyć asystenta AI, w szczególności w celu jego rozwoju, konserwacji lub ze względów bezpieczeństwa.",
        },
      ],
    },
    {
      id: "prohibited",
      h2: "7. Zakaz dostarczania treści bezprawnych",
      blocks: [
        {
          kind: "p",
          text: "Użytkownika obowiązuje zakaz dostarczania treści o charakterze bezprawnym, w szczególności treści naruszających prawa osób trzecich, dobra osobiste, prawa autorskie, tajemnicę przedsiębiorstwa oraz treści obraźliwych, wulgarnych lub wprowadzających w błąd.",
        },
        {
          kind: "p",
          text: "Zabronione jest korzystanie z serwisu w sposób zakłócający jego funkcjonowanie, w szczególności podejmowanie prób nieuprawnionego dostępu, automatycznego pobierania treści na skalę obciążającą infrastrukturę, wprowadzania złośliwego oprogramowania oraz wykorzystywania asystenta AI w celu obejścia jego zabezpieczeń lub generowania treści zabronionych prawem.",
        },
        {
          kind: "p",
          text: "W przypadku otrzymania urzędowego zawiadomienia lub wiarygodnej wiadomości o bezprawnym charakterze przekazanych danych Usługodawca może uniemożliwić dostęp do tych danych, zgodnie z art. 14 ustawy o świadczeniu usług drogą elektroniczną.",
        },
      ],
    },
    {
      id: "offers",
      h2: "8. Charakter informacji w serwisie",
      blocks: [
        {
          kind: "p",
          text: "Treści prezentowane w serwisie, w tym opisy usług, przykłady wdrożeń, wskaźniki i kalkulatory, mają charakter informacyjny i poglądowy. Nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego, a przedstawione wyniki są przykładowe i nie stanowią gwarancji osiągnięcia takich samych rezultatów.",
        },
        {
          kind: "p",
          text: "Usługodawca dokłada starań, aby treści były aktualne i rzetelne, i zastrzega sobie prawo do ich zmiany, uzupełnienia lub usunięcia w dowolnym momencie.",
        },
      ],
    },
    {
      id: "ip",
      h2: "9. Prawa własności intelektualnej",
      blocks: [
        {
          kind: "p",
          text: "Serwis oraz jego elementy, w tym teksty, grafiki, animacje, kod źródłowy, układ i nazwa Couders, podlegają ochronie prawnej i przysługują Usługodawcy lub podmiotom, z którymi Usługodawca zawarł stosowne umowy.",
        },
        {
          kind: "p",
          text: "Korzystanie z serwisu nie oznacza nabycia jakichkolwiek praw do jego elementów. Kopiowanie, zwielokrotnianie, modyfikowanie i rozpowszechnianie treści serwisu w celach komercyjnych wymaga uprzedniej pisemnej zgody Usługodawcy. Dozwolony jest użytek osobisty oraz cytowanie z podaniem źródła.",
        },
      ],
    },
    {
      id: "liability",
      h2: "10. Odpowiedzialność",
      blocks: [
        {
          kind: "p",
          text: "Usługodawca dokłada starań, aby serwis działał w sposób ciągły i poprawny, jednak nie gwarantuje nieprzerwanej dostępności. Możliwe są przerwy techniczne wynikające z konserwacji, aktualizacji lub przyczyn niezależnych od Usługodawcy, w tym awarii po stronie dostawcy hostingu.",
        },
        {
          kind: "p",
          text: "Usługodawca nie ponosi odpowiedzialności za skutki decyzji podjętych wyłącznie na podstawie treści serwisu lub odpowiedzi asystenta AI, ani za treść stron zewnętrznych, do których prowadzą odesłania.",
        },
        {
          kind: "p",
          text: "Ograniczenia odpowiedzialności nie wyłączają ani nie ograniczają odpowiedzialności Usługodawcy w zakresie, w jakim przepisy bezwzględnie obowiązujące, w szczególności przepisy o ochronie konsumentów, tego zabraniają.",
        },
      ],
    },
    {
      id: "complaints",
      h2: "11. Reklamacje",
      blocks: [
        {
          kind: "p",
          text: "Reklamacje dotyczące działania serwisu i usług świadczonych drogą elektroniczną można składać na adres e-mail wskazany w sekcji „Kto prowadzi serwis”.",
        },
        {
          kind: "p",
          text: "Reklamacja powinna zawierać opis zastrzeżeń, adres e-mail do kontaktu oraz oczekiwany sposób rozpatrzenia. Usługodawca rozpatruje reklamację i udziela odpowiedzi na podany adres e-mail w terminie 14 dni od dnia jej otrzymania.",
        },
        {
          kind: "p",
          text: "Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, w tym z platformy internetowego rozstrzygania sporów ODR prowadzonej przez Komisję Europejską, dostępnej pod adresem ec.europa.eu/consumers/odr.",
        },
      ],
    },
    {
      id: "withdrawal",
      h2: "12. Odstąpienie od umowy",
      blocks: [
        {
          kind: "p",
          text: "Usługi opisane w punkcie 3 są nieodpłatne, a Użytkownik może w każdej chwili zakończyć korzystanie z nich, zamykając stronę lub okno rozmowy, bez ponoszenia jakichkolwiek kosztów i bez podawania przyczyny.",
        },
        {
          kind: "p",
          text: "Jeżeli w przyszłości w serwisie pojawi się usługa odpłatna, do umów zawieranych na odległość z Konsumentem zastosowanie znajdą przepisy ustawy o prawach konsumenta, w tym prawo odstąpienia od umowy w terminie 14 dni, a regulamin zostanie odpowiednio uzupełniony przed jej udostępnieniem.",
        },
      ],
    },
    {
      id: "changes",
      h2: "13. Zmiany regulaminu",
      blocks: [
        {
          kind: "p",
          text: "Usługodawca może zmienić regulamin z ważnych przyczyn, w szczególności zmiany przepisów prawa, zmiany zakresu lub sposobu świadczenia usług, względów bezpieczeństwa lub zmiany danych Usługodawcy, w tym rejestracji działalności.",
        },
        {
          kind: "p",
          text: "Zmieniony regulamin publikowany jest na tej stronie wraz ze zaktualizowaną datą. Korzystanie z serwisu po publikacji zmian oznacza zapoznanie się z nimi. Do usług rozpoczętych przed zmianą stosuje się regulamin w brzmieniu dotychczasowym.",
        },
      ],
    },
    {
      id: "final",
      h2: "14. Postanowienia końcowe",
      blocks: [
        {
          kind: "p",
          text: "W sprawach nieuregulowanych regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego, ustawy o świadczeniu usług drogą elektroniczną oraz ustawy o prawach konsumenta.",
        },
        {
          kind: "p",
          text: "Wybór prawa polskiego nie pozbawia Konsumenta ochrony wynikającej z bezwzględnie obowiązujących przepisów prawa państwa jego zwykłego pobytu.",
        },
        {
          kind: "p",
          text: "Spory z Użytkownikiem niebędącym Konsumentem rozstrzyga sąd właściwy dla siedziby Usługodawcy. Spory z Konsumentem rozstrzyga sąd właściwy według przepisów ogólnych.",
        },
      ],
    },
  ],
  contactTitle: "Masz pytanie do regulaminu?",
  contactBody:
    "Jeżeli którykolwiek punkt wymaga wyjaśnienia albo potrzebujesz tego dokumentu w innej formie, napisz do nas. Odpowiadamy w ciągu jednego dnia roboczego.",
  contactCta: "Napisz do nas",
};

const plPrivacy: LegalContent = {
  slug: "privacy",
  metaTitle: "Polityka prywatności i cookies | Couders",
  metaDescription:
    "Jak Couders przetwarza dane osobowe zgodnie z RODO: jakie dane zbieramy przez formularz kontaktowy i asystenta AI, na jakiej podstawie prawnej, komu je powierzamy i jakie masz prawa.",
  keywords: [
    "polityka prywatności",
    "RODO",
    "przetwarzanie danych osobowych",
    "pliki cookies",
    "Couders prywatność",
  ],
  breadcrumb: "Polityka prywatności",
  eyebrow: "Dokumenty",
  h1: "Polityka prywatności",
  lead: "Ten dokument wyjaśnia, jakie dane osobowe zbieramy w serwisie couders.com, po co je przetwarzamy, komu je powierzamy i jak możesz skorzystać ze swoich praw wynikających z RODO.",
  updatedLabel: "Ostatnia aktualizacja",
  tocLabel: "W tym dokumencie",
  identity: {
    h2: "Administrator danych",
    intro: "Administratorem Twoich danych osobowych jest:",
    unregistered:
      "Couders to obecnie zespół projektowy, który nie został jeszcze zarejestrowany jako spółka ani jednoosobowa działalność gospodarcza. Do czasu rejestracji administratorem danych są wspólnie osoby tworzące zespół Couders, a wszystkie sprawy dotyczące danych osobowych, w tym realizację Twoich praw, obsługujemy pod podanym niżej adresem e-mail. Po rejestracji uzupełnimy tutaj pełną nazwę, adres siedziby oraz numery NIP i REGON.",
    addressLabel: "Adres",
    registryLabel: "Dane rejestrowe",
    emailLabel: "Kontakt w sprawie danych",
  },
  sections: [
    {
      id: "scope",
      h2: "1. Jakie dane przetwarzamy",
      blocks: [
        {
          kind: "p",
          text: "Przetwarzamy wyłącznie dane, które sam nam przekazujesz, oraz podstawowe dane techniczne zapisywane automatycznie przez serwer. Nie kupujemy baz danych i nie pozyskujemy danych z innych źródeł.",
        },
        {
          kind: "ul",
          items: [
            "Formularz kontaktowy: imię, nazwisko, adres e-mail, treść wiadomości (opcjonalna) oraz data i godzina wysłania.",
            "Asystent AI: treść wiadomości, które wpisujesz w oknie rozmowy, oraz techniczny identyfikator wątku, pozwalający powiązać kolejne wiadomości w jednej sesji.",
            "Dane techniczne: adres IP, typ przeglądarki i systemu operacyjnego oraz data zapytania, zapisywane w logach przez dostawcę hostingu.",
          ],
        },
        {
          kind: "p",
          text: "Nie prosimy o dane szczególnych kategorii (art. 9 RODO) i prosimy, byś nie umieszczał ich w treści wiadomości ani w rozmowie z asystentem AI.",
        },
      ],
    },
    {
      id: "purposes",
      h2: "2. Cele i podstawy prawne przetwarzania",
      blocks: [
        {
          kind: "ul",
          items: [
            "Odpowiedź na zapytanie z formularza i prowadzenie korespondencji: art. 6 ust. 1 lit. b RODO (działania na żądanie osoby przed zawarciem umowy) oraz art. 6 ust. 1 lit. f RODO (nasz prawnie uzasadniony interes w obsłudze kontaktu).",
            "Obsługa rozmowy z asystentem AI i udzielenie odpowiedzi: art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes polegający na obsłudze zapytań i prezentacji usług).",
            "Zapewnienie bezpieczeństwa i stabilności serwisu, w tym analiza logów: art. 6 ust. 1 lit. f RODO.",
            "Ustalenie, dochodzenie lub obrona roszczeń: art. 6 ust. 1 lit. f RODO.",
            "Wypełnienie obowiązków prawnych, w szczególności podatkowych i rachunkowych, jeżeli dojdzie do zawarcia umowy: art. 6 ust. 1 lit. c RODO.",
          ],
        },
        {
          kind: "p",
          text: "Podanie danych jest dobrowolne. Bez imienia, nazwiska i adresu e-mail nie jesteśmy jednak w stanie odpowiedzieć na zapytanie wysłane przez formularz.",
        },
      ],
    },
    {
      id: "retention",
      h2: "3. Jak długo przechowujemy dane",
      blocks: [
        {
          kind: "ul",
          items: [
            "Dane z formularza kontaktowego: przez czas prowadzenia korespondencji, a następnie do 24 miesięcy od ostatniego kontaktu, na wypadek powrotu do rozmowy.",
            "Treść rozmów z asystentem AI: przez czas potrzebny do obsługi zapytania i diagnostyki, nie dłużej niż 12 miesięcy.",
            "Logi serwera: przez okres wynikający z ustawień dostawcy hostingu, standardowo do 12 miesięcy.",
            "Dane związane z zawartą umową: przez okres jej realizacji, a następnie przez okres przedawnienia roszczeń i okres wymagany przepisami podatkowymi (co do zasady 5 lat od końca roku, w którym powstał obowiązek podatkowy).",
          ],
        },
        {
          kind: "p",
          text: "Po upływie tych okresów dane usuwamy lub anonimizujemy.",
        },
      ],
    },
    {
      id: "recipients",
      h2: "4. Komu powierzamy dane",
      blocks: [
        {
          kind: "p",
          text: "Twoje dane mogą być przetwarzane przez zaufanych dostawców, którzy działają na nasze zlecenie na podstawie umów powierzenia przetwarzania. Aktualnie są to:",
        },
        {
          kind: "ul",
          items: [
            "Dostawca hostingu i sieci dostarczania treści, na którego serwerach działa serwis i który zapisuje logi dostępowe.",
            "Dostawca platformy automatyzacji, przez którą przechodzą zgłoszenia z formularza kontaktowego i wiadomości z asystenta AI.",
            "Dostawca arkusza kalkulacyjnego i poczty, w którym zapisujemy zgłoszenia z formularza i prowadzimy korespondencję.",
            "Dostawca modelu językowego, który generuje odpowiedzi asystenta AI na podstawie treści Twojej wiadomości.",
          ],
        },
        {
          kind: "p",
          text: "Dane mogą być udostępnione również podmiotom uprawnionym na podstawie przepisów prawa, na przykład organom ścigania, wyłącznie na ich uzasadnione żądanie. Nie sprzedajemy danych i nie udostępniamy ich w celach marketingowych podmiotom trzecim.",
        },
      ],
    },
    {
      id: "transfers",
      h2: "5. Przekazywanie danych poza EOG",
      blocks: [
        {
          kind: "p",
          text: "Część naszych dostawców, w szczególności dostawca hostingu i dostawca modelu językowego, ma siedzibę lub infrastrukturę poza Europejskim Obszarem Gospodarczym, głównie w Stanach Zjednoczonych.",
        },
        {
          kind: "p",
          text: "W takich przypadkach przekazywanie danych odbywa się na podstawie mechanizmów przewidzianych w rozdziale V RODO, to jest decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony (Data Privacy Framework) lub standardowych klauzul umownych, uzupełnionych o dodatkowe środki bezpieczeństwa. Kopię zastosowanych zabezpieczeń możesz uzyskać, pisząc na nasz adres kontaktowy.",
        },
      ],
    },
    {
      id: "ai",
      h2: "6. Dane w asystencie AI",
      blocks: [
        {
          kind: "p",
          text: "Wiadomości wpisane w oknie rozmowy przekazujemy do dostawcy modelu językowego wyłącznie w celu wygenerowania odpowiedzi. Nie wykorzystujemy tych treści do trenowania własnych modeli.",
        },
        {
          kind: "p",
          text: "Prosimy, byś nie wpisywał w rozmowie haseł, numerów dokumentów, danych finansowych, danych o zdrowiu ani danych osobowych innych osób. Jeżeli takie dane zostaną wysłane omyłkowo, napisz do nas, a usuniemy je z naszych rejestrów.",
        },
      ],
    },
    {
      id: "cookies",
      h2: "7. Pliki cookies i pamięć przeglądarki",
      blocks: [
        {
          kind: "p",
          text: "Serwis nie zapisuje własnych plików cookies w celach analitycznych, marketingowych ani profilujących. Nie korzystamy z Google Analytics, pikseli reklamowych ani narzędzi śledzących zachowanie użytkowników między stronami.",
        },
        {
          kind: "p",
          text: "Korzystamy natomiast z pamięci sesyjnej przeglądarki (sessionStorage), w której zapisujemy jeden techniczny identyfikator wątku rozmowy z asystentem AI. Pozwala on powiązać kolejne wiadomości w tej samej sesji. Wpis nie zawiera danych osobowych i jest automatycznie usuwany po zamknięciu karty przeglądarki. Możesz go też skasować w każdej chwili, czyszcząc dane witryny w ustawieniach przeglądarki.",
        },
        {
          kind: "p",
          text: "Jeżeli w przyszłości wdrożymy narzędzia analityczne wymagające zgody, uruchomimy je dopiero po jej udzieleniu, a ten dokument zostanie wcześniej zaktualizowany.",
        },
      ],
    },
    {
      id: "rights",
      h2: "8. Twoje prawa",
      blocks: [
        { kind: "p", text: "W związku z przetwarzaniem danych przysługuje Ci prawo do:" },
        {
          kind: "ul",
          items: [
            "dostępu do danych i uzyskania ich kopii (art. 15 RODO),",
            "sprostowania danych nieprawidłowych lub niekompletnych (art. 16 RODO),",
            "usunięcia danych, czyli prawo do bycia zapomnianym (art. 17 RODO),",
            "ograniczenia przetwarzania (art. 18 RODO),",
            "przenoszenia danych do innego administratora (art. 20 RODO),",
            "wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO),",
            "cofnięcia zgody w dowolnym momencie, jeżeli przetwarzanie odbywa się na jej podstawie, bez wpływu na zgodność z prawem przetwarzania dokonanego przed cofnięciem.",
          ],
        },
        {
          kind: "p",
          text: "Aby skorzystać z tych praw, napisz na nasz adres kontaktowy. Odpowiadamy bez zbędnej zwłoki, nie później niż w ciągu miesiąca od otrzymania żądania.",
        },
        {
          kind: "p",
          text: "Masz również prawo wniesienia skargi do organu nadzorczego, którym w Polsce jest Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.",
        },
      ],
    },
    {
      id: "automated",
      h2: "9. Zautomatyzowane podejmowanie decyzji",
      blocks: [
        {
          kind: "p",
          text: "Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu, które wywoływałyby skutki prawne lub w podobny sposób istotnie na Ciebie wpływały. Odpowiedzi asystenta AI mają charakter informacyjny i nie służą ocenie ani kwalifikowaniu osób.",
        },
      ],
    },
    {
      id: "security",
      h2: "10. Bezpieczeństwo danych",
      blocks: [
        {
          kind: "p",
          text: "Stosujemy środki techniczne i organizacyjne odpowiednie do ryzyka, w tym szyfrowanie połączenia (HTTPS), ograniczenie dostępu do danych wyłącznie do osób, którym jest on niezbędny, uwierzytelnianie dwuskładnikowe w narzędziach, w których przechowujemy zgłoszenia, oraz przechowywanie kluczy dostępowych po stronie serwera, poza kodem wysyłanym do przeglądarki.",
        },
      ],
    },
    {
      id: "changes",
      h2: "11. Zmiany polityki prywatności",
      blocks: [
        {
          kind: "p",
          text: "Politykę aktualizujemy, gdy zmienia się sposób działania serwisu, zakres przetwarzanych danych, lista dostawców lub przepisy prawa. Aktualna wersja jest zawsze dostępna pod tym adresem, a data ostatniej aktualizacji widnieje na górze strony.",
        },
      ],
    },
  ],
  contactTitle: "Chcesz skorzystać ze swoich praw?",
  contactBody:
    "Napisz do nas jednym zdaniem, czego dotyczy Twoje żądanie: dostępu do danych, sprostowania, usunięcia czy sprzeciwu. Nie potrzebujesz żadnego formularza ani uzasadnienia.",
  contactCta: "Napisz do nas",
};

/* ── English ───────────────────────────────────────────────────────────── */

const enTerms: LegalContent = {
  slug: "terms",
  metaTitle: "Terms of Service | Couders",
  metaDescription:
    "Terms of service for couders.com: the scope of the free online services, rules for the contact form and the AI assistant, intellectual property, liability and complaints.",
  keywords: ["terms of service", "website terms", "terms and conditions", "Couders terms"],
  breadcrumb: "Terms of Service",
  eyebrow: "Legal",
  h1: "Terms of Service",
  lead: "These terms set out the rules for using couders.com and the conditions under which we provide our online services: browsing the site, using the contact form and talking to the AI assistant.",
  updatedLabel: "Last updated",
  tocLabel: "In this document",
  identity: {
    h2: "Who operates this site",
    intro: "The site is operated by:",
    unregistered:
      "Couders is currently a project team and is not yet registered as a company or a sole proprietorship. Until registration is complete, the site is operated by the individuals who make up the Couders team, and all matters concerning the site are handled through the email address below. Once registered, we will add the full legal name, registered address and tax identifiers here, and the change will be reflected in the document date.",
    addressLabel: "Address",
    registryLabel: "Registration details",
    emailLabel: "Contact",
  },
  sections: [
    {
      id: "general",
      h2: "1. General provisions",
      blocks: [
        {
          kind: "p",
          text: "These terms define the rules on which the operator makes the site available and provides services to users by electronic means. They are made available free of charge before any service begins, in a form that can be downloaded, reproduced and stored.",
        },
        {
          kind: "p",
          text: "Using the site means you accept these terms. If you do not accept them, please stop using the site.",
        },
      ],
    },
    {
      id: "definitions",
      h2: "2. Definitions",
      blocks: [
        {
          kind: "ul",
          items: [
            "Site: the website available at couders.com, including all subpages.",
            "Operator: the entity running the site, identified in the section “Who operates this site”.",
            "User: anyone using the site, whether browsing content, submitting the contact form or talking to the AI assistant.",
            "Consumer: a natural person entering into an agreement not directly related to their business or professional activity.",
            "Services: the free electronic services described in section 3.",
            "AI assistant: the chat interface available on the site, powered by a language model, which answers user questions.",
          ],
        },
      ],
    },
    {
      id: "services",
      h2: "3. Scope of services",
      blocks: [
        { kind: "p", text: "The operator provides the following services free of charge:" },
        {
          kind: "ul",
          items: [
            "Access to site content: browsing information pages, service descriptions and marketing materials. The service starts when you open a page and ends when you leave it.",
            "Contact form: lets you send an enquiry to the Couders team. The service starts when you begin filling in the form and ends when you submit it or leave the page.",
            "AI assistant: lets you ask about our services and receive an automated answer. The service starts when you open the chat window and ends when you close it or end the browser session.",
          ],
        },
        {
          kind: "p",
          text: "All of the above are free. The site does not sell anything online, does not take payments and does not require an account.",
        },
        {
          kind: "p",
          text: "Actual project work (analysis, design, implementation, maintenance) is not covered by these terms. Its scope, schedule, fees and liability are governed by a separate agreement signed individually.",
        },
      ],
    },
    {
      id: "technical",
      h2: "4. Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "To use the site you need a device with an internet connection, a current version of Chrome, Safari, Firefox or Edge with JavaScript enabled, and, for the contact form, a working email address.",
        },
        {
          kind: "p",
          text: "Please note that using the internet carries the usual risks, in particular malware and attempts at unauthorised access to data. We recommend keeping your browser and security software up to date.",
        },
      ],
    },
    {
      id: "contact-form",
      h2: "5. Contact form",
      blocks: [
        {
          kind: "p",
          text: "The contact form requires a first name, last name and email address. The message itself is optional. Providing this data is voluntary but necessary for us to reply.",
        },
        {
          kind: "p",
          text: "You agree to provide accurate information and not to submit third party data without their consent. Submitting the form does not oblige either side to enter into an agreement.",
        },
        { kind: "p", text: "How we handle this data is described in the Privacy Policy." },
      ],
    },
    {
      id: "ai-assistant",
      h2: "6. AI assistant",
      blocks: [
        {
          kind: "p",
          text: "The AI assistant generates answers automatically, using a language model and materials about our services. Its answers are informational and supportive only.",
        },
        {
          kind: "ul",
          items: [
            "Answers may be incomplete, out of date or wrong, and must not be treated as legal, tax, financial or technical advice.",
            "An answer from the assistant, including any price, timeline or scope it mentions, is not an offer and does not bind the operator.",
            "Binding arrangements are made only in direct contact with the team, in writing or documentary form.",
            "Please do not enter sensitive data, passwords, trade secrets or other people's personal data into the chat.",
          ],
        },
        {
          kind: "p",
          text: "The operator may change, limit or switch off the AI assistant at any time, in particular for development, maintenance or security reasons.",
        },
      ],
    },
    {
      id: "prohibited",
      h2: "7. Prohibited content and conduct",
      blocks: [
        {
          kind: "p",
          text: "You must not supply unlawful content, in particular content infringing third party rights, personal rights, copyright or trade secrets, nor content that is offensive, abusive or misleading.",
        },
        {
          kind: "p",
          text: "You must not use the site in a way that disrupts it, in particular by attempting unauthorised access, scraping content at a scale that burdens the infrastructure, introducing malicious software, or using the AI assistant to bypass its safeguards or generate unlawful content.",
        },
        {
          kind: "p",
          text: "On receiving official notice or credible information that supplied data is unlawful, the operator may block access to that data.",
        },
      ],
    },
    {
      id: "offers",
      h2: "8. Nature of the information on the site",
      blocks: [
        {
          kind: "p",
          text: "Content on the site, including service descriptions, example implementations, metrics and calculators, is informational and illustrative. It is not an offer, and any results shown are examples rather than a guarantee of the same outcome.",
        },
        {
          kind: "p",
          text: "We work to keep the content accurate and current, and we reserve the right to change, extend or remove it at any time.",
        },
      ],
    },
    {
      id: "ip",
      h2: "9. Intellectual property",
      blocks: [
        {
          kind: "p",
          text: "The site and its elements, including text, graphics, animations, source code, layout and the Couders name, are legally protected and belong to the operator or to parties the operator has agreements with.",
        },
        {
          kind: "p",
          text: "Using the site does not grant you any rights to its elements. Copying, reproducing, modifying or distributing the content for commercial purposes requires our prior written consent. Personal use and quoting with attribution are permitted.",
        },
      ],
    },
    {
      id: "liability",
      h2: "10. Liability",
      blocks: [
        {
          kind: "p",
          text: "We work to keep the site running correctly and continuously, but we do not guarantee uninterrupted availability. Downtime may occur due to maintenance, updates or causes beyond our control, including failures at our hosting provider.",
        },
        {
          kind: "p",
          text: "We are not liable for decisions made solely on the basis of site content or an answer from the AI assistant, nor for the content of external sites we link to.",
        },
        {
          kind: "p",
          text: "These limitations do not exclude or limit our liability where mandatory law, in particular consumer protection law, does not allow it.",
        },
      ],
    },
    {
      id: "complaints",
      h2: "11. Complaints",
      blocks: [
        {
          kind: "p",
          text: "Complaints about the site or the online services can be sent to the email address given in “Who operates this site”.",
        },
        {
          kind: "p",
          text: "A complaint should describe the issue, give a contact email address and state the outcome you expect. We review complaints and reply to the address given within 14 days of receiving them.",
        },
        {
          kind: "p",
          text: "Consumers may also use out of court dispute resolution, including the European Commission's ODR platform at ec.europa.eu/consumers/odr.",
        },
      ],
    },
    {
      id: "withdrawal",
      h2: "12. Withdrawal",
      blocks: [
        {
          kind: "p",
          text: "The services in section 3 are free and you may stop using them at any time by closing the page or the chat window, at no cost and without giving a reason.",
        },
        {
          kind: "p",
          text: "If a paid service is ever added, distance contracts with consumers will be subject to consumer protection law, including a 14 day right of withdrawal, and these terms will be updated before that service goes live.",
        },
      ],
    },
    {
      id: "changes",
      h2: "13. Changes to these terms",
      blocks: [
        {
          kind: "p",
          text: "We may change these terms for important reasons, in particular changes in law, changes to the scope or the way services are provided, security considerations, or a change to the operator's details, including company registration.",
        },
        {
          kind: "p",
          text: "The updated terms are published on this page with a new date. Services started before a change remain governed by the previous version.",
        },
      ],
    },
    {
      id: "final",
      h2: "14. Final provisions",
      blocks: [
        {
          kind: "p",
          text: "Matters not covered here are governed by Polish law, in particular the Civil Code, the Act on providing services by electronic means and consumer protection law.",
        },
        {
          kind: "p",
          text: "Choosing Polish law does not deprive a consumer of the protection of mandatory provisions of the law of their country of habitual residence.",
        },
        {
          kind: "p",
          text: "Disputes with users who are not consumers are settled by the court with jurisdiction over the operator's seat. Disputes with consumers are settled under the general rules.",
        },
      ],
    },
  ],
  contactTitle: "A question about these terms?",
  contactBody:
    "If any clause needs clarifying, or you need this document in another format, write to us. We reply within one business day.",
  contactCta: "Get in touch",
};

const enPrivacy: LegalContent = {
  slug: "privacy",
  metaTitle: "Privacy Policy and Cookies | Couders",
  metaDescription:
    "How Couders handles personal data under the GDPR: what we collect through the contact form and the AI assistant, the legal basis, who processes it on our behalf and how to exercise your rights.",
  keywords: ["privacy policy", "GDPR", "personal data", "cookies policy", "Couders privacy"],
  breadcrumb: "Privacy Policy",
  eyebrow: "Legal",
  h1: "Privacy Policy",
  lead: "This document explains what personal data we collect on couders.com, why we process it, who processes it on our behalf and how you can exercise your rights under the GDPR.",
  updatedLabel: "Last updated",
  tocLabel: "In this document",
  identity: {
    h2: "Data controller",
    intro: "The controller of your personal data is:",
    unregistered:
      "Couders is currently a project team and is not yet registered as a company or a sole proprietorship. Until registration is complete, the individuals who make up the Couders team act as joint controllers, and all data protection matters, including your requests, are handled at the email address below. Once registered, we will add the full legal name, registered address and tax identifiers here.",
    addressLabel: "Address",
    registryLabel: "Registration details",
    emailLabel: "Data protection contact",
  },
  sections: [
    {
      id: "scope",
      h2: "1. What data we process",
      blocks: [
        {
          kind: "p",
          text: "We process only the data you give us yourself, plus basic technical data recorded automatically by the server. We do not buy databases and we do not obtain data from other sources.",
        },
        {
          kind: "ul",
          items: [
            "Contact form: first name, last name, email address, an optional message, and the date and time of submission.",
            "AI assistant: the messages you type into the chat window, plus a technical thread identifier that links messages within one session.",
            "Technical data: IP address, browser and operating system type and request time, recorded in logs by our hosting provider.",
          ],
        },
        {
          kind: "p",
          text: "We do not ask for special categories of data (art. 9 GDPR) and we ask that you do not include such data in a message or in the chat.",
        },
      ],
    },
    {
      id: "purposes",
      h2: "2. Purposes and legal bases",
      blocks: [
        {
          kind: "ul",
          items: [
            "Replying to a form enquiry and handling correspondence: art. 6(1)(b) GDPR (steps taken at your request before entering into a contract) and art. 6(1)(f) GDPR (our legitimate interest in handling enquiries).",
            "Running the AI assistant conversation and answering it: art. 6(1)(f) GDPR (legitimate interest in handling enquiries and presenting our services).",
            "Keeping the site secure and stable, including log analysis: art. 6(1)(f) GDPR.",
            "Establishing, exercising or defending legal claims: art. 6(1)(f) GDPR.",
            "Meeting legal obligations, in particular tax and accounting ones, if a contract is signed: art. 6(1)(c) GDPR.",
          ],
        },
        {
          kind: "p",
          text: "Providing data is voluntary. Without a name and email address, however, we cannot answer an enquiry sent through the form.",
        },
      ],
    },
    {
      id: "retention",
      h2: "3. How long we keep data",
      blocks: [
        {
          kind: "ul",
          items: [
            "Contact form data: for as long as the correspondence lasts, then up to 24 months from the last contact in case the conversation resumes.",
            "AI assistant conversations: for as long as needed to handle the enquiry and for diagnostics, no longer than 12 months.",
            "Server logs: for the period set by our hosting provider, typically up to 12 months.",
            "Contract related data: for the duration of the contract, then for the limitation period for claims and the period required by tax law (as a rule 5 years from the end of the year in which the tax obligation arose).",
          ],
        },
        { kind: "p", text: "After these periods we delete or anonymise the data." },
      ],
    },
    {
      id: "recipients",
      h2: "4. Who processes your data",
      blocks: [
        {
          kind: "p",
          text: "Your data may be processed by trusted providers acting on our instructions under data processing agreements. These are currently:",
        },
        {
          kind: "ul",
          items: [
            "A hosting and content delivery provider, whose servers run the site and record access logs.",
            "An automation platform provider, through which contact form submissions and AI assistant messages pass.",
            "A spreadsheet and email provider, where we store submissions and handle correspondence.",
            "A language model provider, which generates the AI assistant's answers from your message.",
          ],
        },
        {
          kind: "p",
          text: "Data may also be disclosed to authorities entitled to it by law, on a justified request. We do not sell data and we do not share it with third parties for their marketing.",
        },
      ],
    },
    {
      id: "transfers",
      h2: "5. Transfers outside the EEA",
      blocks: [
        {
          kind: "p",
          text: "Some of our providers, in particular the hosting provider and the language model provider, are based or operate infrastructure outside the European Economic Area, mainly in the United States.",
        },
        {
          kind: "p",
          text: "Such transfers rely on the mechanisms in Chapter V of the GDPR: an adequacy decision of the European Commission (the Data Privacy Framework) or standard contractual clauses, supplemented by additional safeguards. You can request a copy of the safeguards in place at our contact address.",
        },
      ],
    },
    {
      id: "ai",
      h2: "6. Data in the AI assistant",
      blocks: [
        {
          kind: "p",
          text: "Messages you type into the chat are sent to the language model provider solely to generate an answer. We do not use them to train our own models.",
        },
        {
          kind: "p",
          text: "Please do not enter passwords, document numbers, financial data, health data or other people's personal data into the chat. If such data is sent by mistake, contact us and we will remove it from our records.",
        },
      ],
    },
    {
      id: "cookies",
      h2: "7. Cookies and browser storage",
      blocks: [
        {
          kind: "p",
          text: "This site does not set its own cookies for analytics, marketing or profiling. We do not use Google Analytics, advertising pixels or cross site tracking tools.",
        },
        {
          kind: "p",
          text: "We do use the browser's session storage to keep one technical identifier for the AI assistant conversation, so that consecutive messages can be linked within a session. It holds no personal data and is deleted automatically when you close the tab. You can also clear it at any time through your browser's site data settings.",
        },
        {
          kind: "p",
          text: "If we ever add analytics that require consent, they will run only after you give it, and this document will be updated beforehand.",
        },
      ],
    },
    {
      id: "rights",
      h2: "8. Your rights",
      blocks: [
        { kind: "p", text: "In relation to your data you have the right to:" },
        {
          kind: "ul",
          items: [
            "access your data and obtain a copy of it (art. 15 GDPR),",
            "have inaccurate or incomplete data corrected (art. 16 GDPR),",
            "have your data erased, the right to be forgotten (art. 17 GDPR),",
            "restrict processing (art. 18 GDPR),",
            "port your data to another controller (art. 20 GDPR),",
            "object to processing based on legitimate interest (art. 21 GDPR),",
            "withdraw consent at any time where processing is based on it, without affecting the lawfulness of processing before withdrawal.",
          ],
        },
        {
          kind: "p",
          text: "To exercise any of these, write to our contact address. We respond without undue delay and no later than one month from receiving the request.",
        },
        {
          kind: "p",
          text: "You also have the right to lodge a complaint with a supervisory authority. In Poland this is the President of the Personal Data Protection Office, ul. Stawki 2, 00-193 Warsaw.",
        },
      ],
    },
    {
      id: "automated",
      h2: "9. Automated decision making",
      blocks: [
        {
          kind: "p",
          text: "We do not make decisions about you based solely on automated processing, including profiling, that would produce legal effects or similarly significantly affect you. The AI assistant's answers are informational and are not used to assess or score people.",
        },
      ],
    },
    {
      id: "security",
      h2: "10. Data security",
      blocks: [
        {
          kind: "p",
          text: "We apply technical and organisational measures appropriate to the risk, including encrypted connections (HTTPS), access limited to people who need it, two factor authentication on the tools that hold submissions, and keeping access keys server side, outside the code sent to the browser.",
        },
      ],
    },
    {
      id: "changes",
      h2: "11. Changes to this policy",
      blocks: [
        {
          kind: "p",
          text: "We update this policy when the way the site works, the data we process, the list of providers or the law changes. The current version is always available at this address, with the date of the last update shown at the top.",
        },
      ],
    },
  ],
  contactTitle: "Want to exercise your rights?",
  contactBody:
    "Write us one sentence saying what your request concerns: access, rectification, erasure or objection. No form and no justification needed.",
  contactCta: "Get in touch",
};

const legal: Record<Locale, LegalDict> = {
  en: { terms: enTerms, privacy: enPrivacy },
  pl: { terms: plTerms, privacy: plPrivacy },
};

export const getLegal = (locale: Locale): LegalDict => legal[locale] ?? legal.en;
export const getTerms = (locale: Locale): LegalContent => getLegal(locale).terms;
export const getPrivacy = (locale: Locale): LegalContent => getLegal(locale).privacy;
