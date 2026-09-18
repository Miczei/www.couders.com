# Outreach bez cold callingu — plan na pierwsze 30 dni

Dokument operacyjny dla Couders. Cel: **pierwszy płatny projekt w ciągu 14 dni,
3-4 płatne projekty w ciągu 30 dni**. Bez dzwonienia na zimno.

Pliki w tym katalogu:

| Plik | Co zawiera |
|---|---|
| `README.md` | Ten plan: diagnoza, oferta, kanały, rytm dnia, liczby |
| `sekwencje.md` | Gotowe teksty: maile, LinkedIn, partnerzy, reaktywacja znajomych |
| `lista-leadow-seed.csv` | 75 imiennych decydentów z PL w waszym ICP. **Poza repo**, patrz niżej |
| `jak-odtworzyc-liste.md` | Jak wygenerować kolejne setki leadów tym samym sposobem |

> **Uwaga o danych osobowych.** To repozytorium jest publiczne (GitHub Pages serwuje
> z niego couders.com). Lista leadów zawiera imiona, stanowiska, pracodawców, miasta
> i adresy e-mail realnych osób, więc **nie jest commitowana** i jest wpisana do
> `.gitignore`. Trzymajcie ją na dysku zespołu, nie w gicie. Publikacja takiej listy
> to naruszenie RODO i jednocześnie oddanie konkurencji własnego targetu.

---

## TL;DR — co zrobić jutro rano

1. **Zmień ofertę na jedną, konkretną, z ceną i terminem** (Pilot 7 dni, 5 900 zł netto).
   Bez tego cała reszta nie zadziała, bo nikt nie wie, co kupuje.
2. **Wyślij 30 wiadomości do ludzi, których już znasz** (sekcja 4A). To jedyny kanał,
   który może dać pieniądze w tym tygodniu.
3. **Zbuduj 5 działających demo na danych konkretnych firm** i wyślij linki (sekcja 3).
   To wasza przewaga, której nie ma żadna agencja bez zaplecza inżynierskiego.

---

## 1. Diagnoza: dlaczego od 2 miesięcy nie ma klientów

Cztery przyczyny, wszystkie do naprawienia w tym tygodniu:

1. **Pozycjonowanie jest za ciężkie na waszą sytuację.** Strona mówi "enterprise AI",
   "autonomiczni agenci", "infrastruktura produkcyjna". Enterprise kupuje 3-9 miesięcy,
   przez procurement i pilotaże. Wy potrzebujecie gotówki w 30 dni. To są dwa różne biznesy.
2. **Nie ma dowodu.** Zero case studies to zero zaufania. Klient nie kupi "zaufaj nam".
   Dowód trzeba **wyprodukować**, nie czekać na niego (sekcja 3).
3. **Oferta jest nieskwantyfikowana.** "Wycena wdrożenia AI" = klient nie wie, czy to
   5 tys. czy 150 tys., więc odkłada decyzję. Odkładanie = brak przychodu.
4. **Brak powtarzalnego wolumenu.** Sprzedaż to matematyka. Bez 200+ świadomych dotknięć
   miesięcznie nie ma przewidywalnego przychodu, niezależnie od jakości produktu.

Kolejność naprawy ma znaczenie: **oferta → dowód → wolumen.** Wolumen bez oferty
to spalona lista kontaktów.

---

## 2. Oferta-klin — zmieńcie to najpierw

Przestańcie sprzedawać "wdrożenie AI". Sprzedawajcie **jeden proces, w tydzień, za stałą cenę.**

| Element | Ustawienie |
|---|---|
| Nazwa | **Pilot 7 dni** |
| Cena | 5 900 zł netto (jednorazowo) |
| Termin | 7 dni roboczych od podpisania, data w umowie |
| Zakres | **Jeden** z trzech waszych produktów: asystent na stronie / kwalifikator leadów / generator ofert |
| Utrzymanie | 890 zł/mies. od 2. miesiąca (hosting, model, poprawki, raport) |
| Gwarancja | Nie działa po 30 dniach wg ustalonej metryki → zwrot 100% lub darmowy drugi proces |
| Co dalej | Pilot → abonament → kolejne procesy → stała współpraca |

**Dlaczego stała cena i 7 dni:**
- decyzję o 5 900 zł podejmuje jedna osoba, bez zarządu, bez przetargu, bez budżetowania;
- 7 dni to termin, w którym klient nie musi w was wierzyć — wystarczy, że zaryzykuje tydzień;
- gwarancja przenosi ryzyko na was, co jest jedyną rzeczą, jaką macie zamiast case studies;
- każdy zamknięty pilot to case study, którego brak was dziś blokuje.

**Widełki:** przy firmach 100+ osób podnieście pilot do 8 900-12 000 zł. Cena za nisko
też zabija sprzedaż, bo sygnalizuje brak kompetencji. Ale **nie negocjujcie w dół pierwszego
projektu** — zejdźcie raczej z zakresu.

**Metryka do gwarancji** (ustalcie ją na spotkaniu, zapiszcie w mailu):
np. "agent obsłuży ≥60% zapytań bez człowieka" albo "czas pierwszej odpowiedzi <2 min
dla 100% leadów z formularza". Metryka musi być mierzalna z danych, które i tak zbieracie.

---

## 3. Wasza przewaga: outreach z działającym demo (demo-first)

Wszyscy wysyłają maile "dzień dobry, zajmujemy się AI". Wy możecie wysłać **link do
działającego agenta, który zna katalog i cennik firmy odbiorcy.** Wasz produkt to dokładnie
to. To jest różnica między "opowiadamy" a "pokazujemy" i ona zamyka sprzedaż.

### Proces (po zbudowaniu pipeline'u: ~10 min na firmę)

1. **Scrape** strony firmy: oferta, katalog, cennik, FAQ, kontakt (Python/Apify — sprzedajecie
   to jako usługę, więc użyjcie na sobie).
2. **Zbuduj agenta** na tych danych, na waszym stacku, w izolowanej instancji.
3. **Wystaw na dedykowanej podstronie**: `couders.com/demo/nazwa-firmy`, z ich logo,
   nagłówkiem "Asystent sprzedaży dla [Firma] — wersja testowa".
4. **Nagraj 60-90 s wideo** (Loom/Screen Studio): zadajesz agentowi 2 realne pytania klienta
   tej firmy, agent odpowiada z ich cennika. Zero slajdów, zero "dzień dobry, nazywam się".
5. **Wyślij** maila lub LinkedIn (teksty w `sekwencje.md`) z linkiem i jednym zdaniem CTA.
6. **Link wygasa po 7 dniach.** Deadline jest częścią oferty, nie sztuczką — obniża
   wasz koszt hostingu i wymusza decyzję.

### Dlaczego to działa
- Odbiorca widzi **swoje** produkty i **swoje** ceny — nie da się tego zignorować jak szablonu.
- Sam demo dowodzi, że umiecie dowieźć, zanim ktokolwiek zapłaci.
- Odróżnia was od 100% agencji, które wysyłają PDF z ofertą.
- Jest w pełni automatyzowalny: to sama w sobie wasza reklama ("zbudowaliśmy to o 3 w nocy, maszynowo").

### Automatyzacja (zbudujcie w dniach 1-3, potem skaluje się samo)
`n8n: wiersz z arkusza → scrape → build agenta → deploy podstrony → wygeneruj tekst maila
→ zwróć link`. Wtedy 10 demo dziennie to 1,5 h pracy, a nie 10 h. **Zbudujcie to raz
i zróbcie z tego case study numer jeden** ("nasz własny system pozyskiwania klientów").

---

## 4. Kogo zaczepiać — pięć list, w kolejności szybkości gotówki

### A. Ciepła sieć — jedyny kanał, który może dać kasę w tym tygodniu

Wypiszcie **40 nazwisk** dziś wieczorem: byli klienci, byli pracodawcy i współpracownicy,
znajomi z uczelni, ludzie z poprzednich projektów, każdy, kto kiedyś pytał o wycenę i nie kupił,
znajomi prowadzący firmy, rodzina prowadząca firmy.

Konwersja tej listy jest 10-20x wyższa niż zimnej. Zasady:
- **1:1, imiennie, bez szablonu** i bez wysyłki masowej;
- nie sprzedawaj w pierwszej wiadomości — poproś o 15 minut albo o opinię;
- pytaj wprost o polecenie: *"kogo znasz, kto płaci za leady z reklam?"* — polecenie od
  znajomego zamyka się kilka razy szybciej niż zimny kontakt;
- odezwij się też do tych, którzy kiedyś powiedzieli "nie teraz". Po 2-3 miesiącach
  sytuacja w firmie bywa inna.

Teksty: `sekwencje.md`, sekcja "Reaktywacja ciepłej sieci".

### B. Firmy, które już płacą za leady (najlepszy zimny target)

Firma, która pali budżet w Google Ads, **ma policzalny problem**: kupuje kliknięcia,
a nie odpowiada na zapytania przez kilka godzin. To jest dokładnie wasz kwalifikator leadów
i rozmowa idzie o pieniądzach, a nie o "AI".

Realne dane z waszego rynku (Semrush, baza PL, wrzesień 2026):

| Fraza | Wolumen/mies. | CPC (USD) | Konkurencja |
|---|---|---|---|
| hale stalowe | 2 400 | 3,29 | 1,00 (maks.) |
| fotowoltaika dla firm | 720 | 2,32 | 0,07 |
| konstrukcje stalowe | 9 900 | 1,60 | 0,30 |
| automatyka przemysłowa | 1 900 | 1,15 | 0,27 |
| maszyny cnc | 5 400 | 0,78 | 1,00 (maks.) |
| domy modułowe | 49 500 | 0,17 | 1,00 (maks.) |

**Argument sprzedażowy, którego użyjcie dosłownie:** kliknięcie w "hale stalowe" kosztuje
ok. 13 zł. Przy 2-3% konwersji na formularz jedno zapytanie kosztuje tę firmę **430-650 zł**.
Pytanie do właściciela brzmi: *ile z tych zapytań dostaje odpowiedź w 5 minut, a ile leży
do rana?* Jeśli leży 40%, firma wyrzuca kilkanaście tysięcy złotych miesięcznie.

Jak znaleźć takie firmy (bez płacenia za dane):
- wpisz frazę w Google i spisz wszystkich z oznaczeniem "Sponsorowane";
- Semrush → raport `phrase_adwords` dla frazy (macie dostęp; dla "hale stalowe" wyszły m.in.
  `cobouw.pl`, `centrum-hal.pl`, `tradestaal.pl`);
- Meta Ad Library (darmowa) — firmy z aktywnymi reklamami lead-ads;
- każda firma z formularzem "wyślij zapytanie" i telefonem czynnym 8-16.

### C. Partnerzy — dźwignia, jeden kontakt = wielu klientów

Najszybsza droga do powtarzalności. Zamiast szukać 20 klientów, znajdźcie 3 partnerów,
którzy mają po 20 klientów.

| Partner | Ich ból, który rozwiązujecie | Model |
|---|---|---|
| Agencje performance / freelancerzy Google Ads | Klient mówi "leady są słabe", a naprawdę nikt ich nie odbiera. Tracą klienta co kwartał. | White-label kwalifikatora, 15-20% prowizji albo odsprzedaż z marżą |
| Studia webowe / no-code | Nie umieją dowieźć AI, a klienci pytają | Podwykonawstwo, wy pod ich marką |
| Wdrożeniowcy CRM (HubSpot, Pipedrive, Livespace) | Klient ma CRM, ale nikt nie nadąża z obsługą | Integracje + agenci jako dodatek do wdrożenia |
| Freelancerzy n8n/Make | Mają leady na automatyzacje, nie ogarniają części AI/dev | Split projektów |
| Księgowe, kancelarie, izby branżowe | Mają zaufanie SMB i zero powodu, by polecać kogokolwiek | Prowizja od poleceń |

Argument dla agencji performance jest mocniejszy niż dla klienta końcowego:
**"wasz klient nie odchodzi, bo leady są złe — odchodzi, bo nikt ich nie odbiera.
Naprawiamy to pod waszą marką, a wy zatrzymujecie klienta."**

### D. Zimny ICP — gotowa lista 75 decydentów

`lista-leadow-seed.csv` (dostarczony osobno, poza repo): **75 imiennych decydentów** (właściciele, prezesi, C-level)
z polskich firm 11-200 osób z waszych branż docelowych:

- 50 × przemysł, maszyny, materiały budowlane,
- 25 × nieruchomości / deweloperzy,
- 72 z 75 ma zweryfikowany adres e-mail, 75 z 75 ma profil LinkedIn.

To jest próbka. W tej samej bazie siedzi **597 osób** tylko w segmencie przemysł/materiały —
jak dociągnąć resztę, opisuje `jak-odtworzyc-liste.md`.

### E. Inbound i marketplace — most gotówkowy

Nie strategia, ale potrafi zamknąć dziurę w kasie w 2 tygodnie:
- **Useme / Rocket Jobs / JustJoin** — zlecenia na automatyzacje i integracje;
- **Clutch, Sortlist, katalogi agencji AI** — darmowe profile, zajmują 2 h, działają miesiącami;
- **Katalogi partnerskie n8n / Make** — mały ruch, ale intencja zakupowa bardzo wysoka;
- **Grupy FB dla przedsiębiorców, społeczność n8n, r/automation** — odpowiadajcie na
  pytania techniczne, nie sprzedawajcie. Z tego przychodzą zapytania.

---

## 5. Rytm dnia — 2,5-3 h dziennie, nie więcej

Outreach przegrywa nie przez złe pomysły, tylko przez nieregularność. Blok w kalendarzu,
codziennie o tej samej porze.

| Blok | Czas | Zadanie |
|---|---|---|
| 1 | 45 min | 10 nowych firm: research + zbudowanie demo (po automatyzacji: 15 min) |
| 2 | 45 min | 10 maili demo-first + 10 zaproszeń/wiadomości LinkedIn |
| 3 | 30 min | Follow-upy z poprzednich dni (tu zamyka się większość spotkań) |
| 4 | 30 min | 2 rozmowy partnerskie lub 3 wiadomości do ciepłej sieci |
| 5 | 15 min | 1 post na LinkedIn: co dziś zbudowaliście, ze zrzutem lub 20-sekundowym wideo |

**Follow-up to nie uprzejmość, to sprzedaż.** Większość odpowiedzi przychodzi po 2. i 3.
wiadomości. Jeśli robicie tylko pierwsze wysyłki, wyrzucacie ~60% wyników.

---

## 6. Matematyka — ile dotknięć daje ile pieniędzy

To są **założenia planistyczne, nie obietnice**. Realne liczby poznacie po pierwszym tygodniu
i wtedy je tu podmieńcie.

| Etap | Założenie | Miesięcznie |
|---|---|---|
| Wysłane dotknięcia (mail + LinkedIn, spersonalizowane, z demo) | 20/dzień × 20 dni | 400 |
| Odpowiedzi | 8-12% (demo-first bije standardowe 2-4%) | 32-48 |
| Odpowiedzi pozytywnych | ~35% odpowiedzi | 11-17 |
| Spotkania (15 min, wideo) | ~60% pozytywnych | 7-10 |
| Piloty sprzedane | 25-35% spotkań | 2-3 |
| Przychód z pilotów | × 5 900 zł | **12-18 tys. zł** |
| + ciepła sieć i partnerzy | 40 kontaktów, konwersja 5-10% | +2-4 projekty |
| + abonamenty narastająco | 890 zł × liczba klientów | rośnie co miesiąc |

Wniosek liczbowy: **żeby zamknąć jeden pilot, potrzebujecie ok. 150-200 dobrych dotknięć.**
Jeśli w tym tygodniu wyślecie 20, nie oczekujcie klienta. Wolumen jest niezbywalny.

Drugi wniosek: sam zimny outreach daje 12-18 tys. zł/mies. To za mało, żeby utrzymać zespół.
Dlatego partnerzy (C) i ciepła sieć (A) nie są dodatkiem — **one robią różnicę między
przetrwaniem a zamknięciem.**

---

## 7. Plan 30 dni

### Dni 1-3 — fundament (bez tego nie wysyłajcie nic)
- [ ] Zamrozić ofertę: Pilot 7 dni, 5 900 zł, gwarancja. Jedna strona A4, nie prezentacja.
- [ ] Kupić i podpiąć domenę do maili wychodzących (**nie couders.com**) + rozgrzewanie.
- [ ] Kalendarz do spotkań (Cal.com), 15-minutowe sloty, link w każdej wiadomości.
- [ ] Arkusz CRM: wrzućcie `lista-leadow-seed.csv` na Dysk zespołu, ma już kolumny
      `status`, `data_kontaktu`, `kanal`, `notatka`.
- [ ] Wypisać 40 nazwisk ciepłej sieci.
- [ ] Zbudować pierwsze 3 demo ręcznie, żeby zmierzyć czas i dopracować format.

### Dni 4-7 — pierwsze pieniądze mogą przyjść tylko stąd
- [ ] 40 wiadomości 1:1 do ciepłej sieci (nie masowo, po 10 dziennie).
- [ ] 10 rozmów partnerskich (agencje Ads z waszego miasta — Kraków jest tu przewagą,
      można się spotkać na kawie, to nie cold calling).
- [ ] 20 demo dla firm z Google Ads (lista B).
- [ ] Profile na Clutch/Sortlist/Useme.
- [ ] Pipeline n8n do automatycznego budowania demo.

### Dni 8-14 — wolumen
- [ ] 20 dotknięć dziennie z listy seed + Ads.
- [ ] Follow-up #2 do wszystkich z tygodnia 1.
- [ ] Pierwsze spotkania → **zamknąć pierwszego pilota**. Jeśli trzeba, pierwszy klient
      dostaje 50% rabatu za zgodę na case study i referencję wideo. To nie jest strata,
      to zakup dowodu.
- [ ] 5 postów na LinkedIn.

### Dni 15-21 — powtarzalność
- [ ] Dowieźć pierwszego pilota w terminie (reputacja > marża).
- [ ] Case study: liczby przed/po, 1 strona + wideo.
- [ ] Podmienić w sekwencjach "nie mamy jeszcze case study" na realny wynik.
- [ ] Podpisać 1-2 umowy partnerskie na prowizję.
- [ ] Przegląd metryk: co ma odpowiedzi, co nie — wyciąć to, co nie działa.

### Dni 22-30 — skalowanie tego, co zadziałało
- [ ] Podwoić kanał o najwyższej konwersji, resztę zostawić na minimum.
- [ ] 200+ nowych leadów z Prospeo w segmentach, które odpowiadały.
- [ ] Zamknąć projekty 2-4.
- [ ] Zamienić klientów pilotowych na abonament 890 zł/mies.

---

## 8. Co mierzyć i jak diagnozować

Mierzcie tygodniowo, pięć liczb, jeden arkusz:
**wysłane → odpowiedzi → odpowiedzi pozytywne → spotkania → sprzedane.**

| Objaw | Co jest zepsute | Co zrobić |
|---|---|---|
| Odpowiedzi <5% | Wiadomość albo lista | Krótsza wiadomość, mocniejszy pierwszy wiersz, lepsze demo. Sprawdź, czy maile nie idą do spamu |
| Odpowiedzi są, ale negatywne | Targetowanie | Zła branża albo za mała firma. Idź w firmy płacące za Ads |
| Pozytywne, ale brak spotkań | CTA | Nie pytaj "czy jest zainteresowanie". Proponuj konkretny termin albo link do kalendarza |
| Spotkania bez sprzedaży | Oferta albo dowód | Za drogo / za mgliście / brak gwarancji. Skróć zakres, dodaj gwarancję zwrotu |
| Wszystko działa, za mało pieniędzy | Wolumen albo cena | Podnieś liczbę dotknięć lub cenę pilota dla większych firm |

Jeśli po 14 dniach przy 200 wysłanych dotknięciach macie **zero** odpowiedzi — problem jest
techniczny (dostarczalność maili), nie sprzedażowy. Sprawdźcie SPF/DKIM/DMARC i testem
sprawdźcie, czy maile lądują w Offer/Spam.

---

## 9. Ryzyka i higiena — przeczytajcie przed pierwszą wysyłką

**Domena.** Nie wysyłajcie zimnych maili z `couders.com`. Jeden nieudany miesiąc spala
reputację domeny, na której stoi wasza strona i poczta firmowa. Kupcie osobną domenę
(np. `couders.pl`, `couders-ai.com`), ustawcie SPF/DKIM/DMARC, rozgrzewajcie 2-3 tygodnie
(Instantly/Smartlead) i dopiero wtedy zwiększajcie wolumen. Do tego czasu: **LinkedIn,
ciepła sieć i partnerzy** — one nie wymagają rozgrzewania i dlatego są pierwsze w planie.

**Limity.** Maks. 20-30 maili dziennie z jednej skrzynki, nawet po rozgrzaniu.
LinkedIn: maks. 20 zaproszeń dziennie z darmowego konta, inaczej blokada.

**Prawo (ważne, zweryfikujcie z prawnikiem).** Prawo komunikacji elektronicznej (obowiązuje
od listopada 2024) wymaga **uprzedniej zgody** na marketing bezpośredni kierowany do
użytkowników końcowych, a przepis obejmuje także firmy. Cold mailing B2B w Polsce jest więc
obarczony realnym ryzykiem, wyższym niż w USA czy UK. Minimum higieny:
- pierwsza wiadomość jako **zapytanie o zgodę na przesłanie informacji**, a nie sama oferta
  (wzór w `sekwencje.md`);
- pełna identyfikacja nadawcy, jasny opt-out, natychmiastowe usuwanie na żądanie;
- kontakt do firmowych, publicznie dostępnych adresów, nie prywatnych;
- prowadźcie rejestr sprzeciwów.
LinkedIn i kontakt przez polecenie nie podlegają tym ograniczeniom w ten sam sposób —
to dodatkowy argument, żeby zaczynać od nich. **Nie jestem prawnikiem: przed masową wysyłką
skonsultujcie to z kancelarią, jedna godzina konsultacji kosztuje mniej niż jedna skarga.**

---

## 10. Czego NIE robić przez najbliższe 30 dni

- **Nie przepisujcie strony.** Jest dobra. Nowa sekcja nie przyniesie klienta w 30 dni.
- **Nie liczcie na SEO.** Domena jest młoda, pozycje w waszych frazach to 6-12 miesięcy.
  Róbcie SEO, ale traktujcie jako inwestycję na Q1, nie jako plan ratunkowy.
- **Nie palcie budżetu w reklamy.** Bez case studies i dopracowanej oferty reklama tylko
  szybciej wyda pieniądze, których nie macie.
- **Nie budujcie nowych produktów.** Macie trzy. Sprzedajcie jeden.
- **Nie idźcie w enterprise teraz.** Cykl zakupowy jest dłuższy niż wasz bufor gotówki.
  Wróćcie do tego, gdy będą 3 case studies i poduszka finansowa.
- **Nie wysyłajcie masowych, nieskonkretyzowanych maili.** Spalą domenę, listę i markę,
  a przy obecnych przepisach są też ryzykiem prawnym.

---

## Jedno zdanie na koniec

Nie macie problemu z produktem ani z jakością inżynierii — macie problem z tym, że nikt
o was nie wie, a ci, którzy się dowiadują, nie wiedzą, ile to kosztuje i co dostaną.
Stała cena, tydzień terminu, działające demo na danych odbiorcy i 20 dotknięć dziennie
rozwiązują wszystkie trzy rzeczy naraz.
