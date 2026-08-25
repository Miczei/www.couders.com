# LinkedIn: post „Czym jest Couders" + prompt do Claude Design

Materiał marketingowy. Wszystkie fakty, liczby i formułowania pochodzą
z aktualnej treści strony (`src/i18n/couders.ts`, `src/i18n/about.ts`,
`src/i18n/showcase.ts`, `src/i18n/dictionaries.ts`) — nic nie jest zmyślone.

---

## 1. Post na LinkedIna — wariant A (rekomendowany)

> Narracja „problem → dlaczego powstaliśmy → co robimy → liczby → CTA".
> ~2100 znaków, mieści się w limicie 3000. Bez markdownu — LinkedIn go nie renderuje.

```text
21:42, sobota. Klient wysyła pytanie o wycenę.
09:15, poniedziałek. Handlowiec odpisuje.

35 godzin przerwy. W tym czasie klient kupił u konkurencji, która odpowiedziała szybciej.

To nie jest problem z ludźmi w dziale sprzedaży. To problem z tym, że firmy sprzedają w godzinach pracy, a klienci kupują poza nimi.

Dlatego robimy Couders.

Couders to zespół inżynierów z Krakowa. Budujemy asystentów AI i autonomicznych agentów, którzy przejmują obsługę klienta i pierwszy etap sprzedaży w firmach B2B.

To nie jest chatbot z guzikami. To agent, który:

→ zna na pamięć Wasz katalog, cennik i dokumentację techniczną
→ odpowiada merytorycznie w ułamku sekundy — o 3 w nocy tak samo jak we wtorek w południe
→ odsiewa ciekawskich, a realnie zainteresowanym od razu proponuje termin w kalendarzu
→ generuje spersonalizowaną ofertę PDF w 15 minut po spotkaniu, w Waszej szacie graficznej
→ oddaje handlowcowi gotowego leada wraz z całą historią rozmowy

Trenujemy go na Waszych danych, nie na ogólnym internecie. AI-agnostycznie: OpenAI, Anthropic, Google Gemini, Meta Llama — dobieramy model do zadania, nie odwrotnie.

Liczby, które pokazujemy klientom:

0,8 s — średni czas odpowiedzi
+40% — więcej umówionych spotkań B2B
24/7 — pełna dostępność w weekendy, święta i w nocy

Pracujemy z przemysłem i producentami maszyn, hurtowniami materiałów budowlanych, deweloperami i usługami B2B — wszędzie tam, gdzie jedno zapytanie bez odpowiedzi to realnie utracony kontrakt.

Jeśli chcecie zobaczyć, jak to działa na danych Waszej firmy — robimy 15-minutowe demo. Napiszcie w komentarzu „demo" albo na priv.

#AI #B2B #sprzedaż #automatyzacja #agentAI #Kraków
```

**Link do strony wrzuć w pierwszy komentarz** (`couders.com`), nie w treść posta —
LinkedIn ogranicza zasięg postom z linkiem zewnętrznym w body.

---

## 2. Post na LinkedIna — wariant B (krótki, pod grafikę)

> Gdy grafika ma nieść większość komunikatu. ~700 znaków.

```text
Twój klient nie czeka do poniedziałku.

Couders buduje asystentów AI, którzy odpowiadają na zapytania w sekundy — o każdej porze, na podstawie Waszego katalogu, cennika i dokumentacji.

Agent odbiera zapytanie o 21:42 w sobotę. Analizuje specyfikację z Waszej bazy. Wysyła odpowiedź, generuje ofertę PDF i rezerwuje termin w kalendarzu. Zanim ktokolwiek z zespołu usiądzie w poniedziałek do maila, spotkanie jest już umówione.

Nie chatbot z guzikami. Autonomiczny agent trenowany na Waszych danych.

0,8 s czasu odpowiedzi. +40% spotkań B2B. 24/7.

Piszcie po demo na danych Waszej firmy.

#AI #B2B #automatyzacjaSprzedaży #agentAI
```

---

## 3. Post na LinkedIna — wariant C (founder story, pod zasięg organiczny)

> Osobisty ton, historia z podstrony „O nas". Najlepiej działa z konta osobowego,
> nie firmowego.

```text
Couders zaczął się przy stole w Krakowie, długo po północy, w trakcie gry w karty.

Rozdanie zamieniło się w spór przy tablicy: dlaczego enterprise AI wykłada się dokładnie w tym momencie, w którym wychodzi z demo. Do świtu rdzeń architektury miał już nazwę i kształt.

Byliśmy tymi studentami, o których wszyscy zakładali, że znikną w wielkich laboratoriach badawczych. Wybraliśmy trudniejszy problem: autonomicznych agentów, którym firma naprawdę może zaufać — otoczonych twardo zakodowanymi regułami biznesowymi, punktami akceptacji przez człowieka i prawdziwą full-stackową inżynierią za każdą decyzją.

Dziś to znaczy tyle: asystent, który zna katalog i cennik klienta na pamięć, odpowiada w 0,8 sekundy o trzeciej w nocy, sam kwalifikuje leada i generuje ofertę PDF w 15 minut po spotkaniu.

Ten sam mały zespół. Ta sama obsesja. Tyle że teraz na produkcji, u klientów w Europie i poza nią.

Jeśli Wasza firma traci zapytania po godzinach — pogadajmy.

#AI #startup #Kraków #B2B #agentAI
```

---

## 4. Prompt do Claude Design (kopiuj w całości)

> Wkleić jako pierwszą wiadomość w Claude Design. Zawiera pełny system wizualny
> zdjęty ze strony couders.com: kolory, typografię, promienie, motyw „jednej
> ciągłej linii" i zasadę białego minimalizmu.

```text
Zaprojektuj zestaw grafik na LinkedIna dla firmy Couders. Jedno płótno, trzy artboardy 1200 × 1200 px (kwadrat, feed LinkedIn). Wybiorę jeden i dopieszczę go ręcznie.

KIM JEST COUDERS
Couders to studio inżynierskie z Krakowa. Buduje asystentów AI i autonomicznych agentów dla firm B2B — takich, którzy przejmują obsługę klienta i pierwszy etap sprzedaży. Agent jest trenowany na prywatnych danych firmy (katalog, cennik, dokumentacja techniczna), odpowiada w sekundy 24/7, kwalifikuje leady i generuje oferty PDF. AI-agnostycznie: OpenAI, Anthropic, Google Gemini, Meta Llama. Ton marki: precyzyjny, inżynierski, spokojny, zero hype'u. Klient to prezes lub dyrektor sprzedaży w firmie produkcyjnej, hurtowni budowlanej, u dewelopera albo w consultingu B2B — nie startupowiec.

SYSTEM WIZUALNY (ściśle ze strony couders.com — trzymaj się go dosłownie)
- Tło: czysta biel #FFFFFF. Bez ciemnych motywów, bez gradientowego tła na całej powierzchni.
- Tekst główny (ink): #0B0B0C, nagłówki #0F172A (slate-900).
- Tekst drugorzędny: #64748B, wyciszony #A2A5AC.
- Jedyny akcent: sky-500 #0EA5E9. Używaj oszczędnie — jedna liczba, jedna linia, jeden badge. Poświata: radialny blur rgba(14,165,233,0.12–0.20) za punktem centralnym.
- Linie: hairline 1 px w kolorze rgba(0,0,0,0.10) lub #E2E8F0. Nigdy grube ramki.
- Typografia: nagłówki Space Grotesk Bold, tracking −0.03em, leading 1.02–1.1. Tekst Inter Regular/Medium. Nadtytuł (eyebrow) monospace, UPPERCASE, 11 px, tracking 0.22em, kolor #94A3B8.
- Logotyp „Couders": zapis odręczny, font Schoolbell (Google Fonts), waga 400, kolor #0B0B0C. Nigdy nie ustawiaj go wersalikami ani nie pogrubiaj — kontrast między odręcznym logotypem a geometrycznym Space Grotesk to sedno tej marki.
- Karty: białe lub półprzezroczyste (rgba(255,255,255,0.65)) z lekkim blurem, promień 32 px (duże karty 40 px), cień 0 8px 30px rgba(0,0,0,0.05). Przyciski w formie pigułki (pełny promień).
- Motyw sygnaturowy: pojedyncza ciągła cienka linia (stroke 2–3 px, #0B0B0C), która płynie przez kompozycję — na stronie linia morfuje z abstrakcyjnej twarzy w logotyp. Użyj tego motywu jako subtelnego elementu graficznego, nie jako ozdobnika.
- Bardzo dużo whitespace. Kompozycja ma być editorialna i oddychająca, bliżej strony tytułowej raportu niż reklamy.

ARTBOARD 1 — „Sobota 21:42" (główny, opowiada problem)
Kompozycja pionowa, dwie kolumny rozdzielone hairline'em.
Nadtytuł u góry: TRADYCYJNY MODEL / AGENT AI (monospace, wersaliki).
Lewa kolumna, wyciszona szarość: „21:42, sobota — klient pyta o wycenę" → „09:15, poniedziałek — handlowiec odpisuje" → w stopce kolumny: „35 godzin. Klient kupił u konkurencji."
Prawa kolumna, akcent sky #0EA5E9: „21:42:00 — klient pyta o wycenę" → „21:42:01 — AI analizuje specyfikację z bazy firmy" → „21:42:02 — odpowiedź wysłana, oferta PDF, spotkanie w kalendarzu" → w stopce: „2 sekundy. Demo umówione na wtorek 10:00."
Znaczniki czasu monospace, opisy Inter. Kropki na osi czasu połączone cienką linią pionową — po prawej stronie ta linia świeci na sky.
Na dole, wyśrodkowany: odręczny logotyp Couders + mikropodpis „couders.com".

ARTBOARD 2 — „Czym jest Couders" (wyjaśniający)
Góra: eyebrow monospace „ASYSTENCI AI DLA FIRM B2B".
Nagłówek Space Grotesk, maks. 3 linie: „Nie chatbot z guzikami. Agent, który zna Wasz katalog, cennik i dokumentację."
Pod nim rząd trzech kart z hairline'em i promieniem 32 px, każda z małą ikoną liniową (stroke 1,5 px, bez wypełnień):
1) Asystent sprzedaży 24/7 — „Zna katalog i cennik. Zbiera leady, gdy śpicie."
2) Kwalifikator leadów — „Odzywa się do leadów z reklam w minutę. Odsiewa ciekawskich."
3) Generator ofert B2B — „Firmowa oferta PDF u klienta 15 minut po spotkaniu."
Stopka: odręczny logotyp Couders po lewej, po prawej wyciszona linia „Kraków · couders.com".

ARTBOARD 3 — „Liczby" (dowód, najprostszy)
Jedna wielka liczba na środku, Space Grotesk, ~200 px, w kolorze sky #0EA5E9: „0,8 s”, podpis pod spodem: „średni czas odpowiedzi”.
Pod spodem, w jednym rzędzie oddzielonym hairline'em, dwie mniejsze metryki w ciemnym inku: „+40% więcej spotkań B2B” oraz „24/7 pełna dostępność”.
Za wielką liczbą delikatna radialna poświata sky (blur ~100 px, krycie 0,15).
Na dole odręczny logotyp Couders.

CZEGO NIE ROBIĆ
- Żadnych zdjęć stockowych, robotów, mózgów, humanoidów, sieci neuronowych ani ikon „AI” w formie chipu.
- Żadnego fioletowo-różowego gradientu „AI”, żadnego ciemnego tła w kosmicznym stylu, żadnego neonu poza jednym akcentem sky.
- Żadnych efektów 3D, cieni rzucanych, obrysowanych ramek, emoji ani clipartów.
- Maksymalnie dwa poziomy wielkości tekstu na artboard poza nagłówkiem — nie zagęszczaj.
- Nie wersalizuj i nie pogrubiaj logotypu Couders.
- Tekst po polsku, z pełnymi polskimi znakami diakrytycznymi.

WYMAGANIA TECHNICZNE
- Wszystko czytelne na miniaturze telefonu: najmniejszy tekst nie mniej niż 24 px w skali 1200 × 1200.
- Margines bezpieczeństwa 80 px od każdej krawędzi.
- Wysoki kontrast: żaden tekst informacyjny nie może być jaśniejszy niż #64748B na bieli.
- Eksport do PNG.
```

### Wariant formatu

Jeśli chcesz format poziomy (link preview / karuzela), dopisz na końcu promptu:

```text
Dodatkowo: zduplikuj wybrany artboard w formacie 1200 × 627 px, przekomponowany
poziomo — nagłówek po lewej, element graficzny po prawej, ten sam system wizualny.
```

---

## 5. Notatki wdrożeniowe

- **Liczby `0,8 s` i `+40%`** to obietnice publikowane już na couders.com
  (sekcja `metrics` w `src/i18n/couders.ts`). Zanim pójdą w post — upewnij się,
  że masz je czym poprzeć, jeśli ktoś dopyta w komentarzu.
- **Najlepsza pora publikacji** dla B2B w Polsce: wtorek–czwartek, 8:00–10:00.
- **Pierwszy komentarz**: link do `couders.com` + jedno zdanie CTA.
- **Alt text grafiki** (dostępność + SEO):
  „Grafika Couders: porównanie tradycyjnej obsługi zapytania (odpowiedź po 35
  godzinach) z agentem AI, który odpowiada w 2 sekundy, generuje ofertę PDF
  i rezerwuje spotkanie."
