# Jak wygenerować kolejne leady

`lista-leadow-seed.csv` to 75 rekordów zrobionych w ramach darmowego planu Prospeo.
Ten plik opisuje, jak dociągnąć resztę i jak znaleźć firmy palące budżet w reklamach.

## Stan konta Prospeo (18.09.2026)

| | |
|---|---|
| Plan | FREE |
| Kredyty | 100/mies., zużyte 4 na listę seed |
| Odnowienie | 09.10.2026 |
| Koszt | 1 kredyt = 1 strona wyników (25 osób). Odsłonięcie e-maila to osobny kredyt za osobę |

**Wniosek budżetowy:** na darmowym planie wyciągniecie ok. 600 rekordów z LinkedInem
(sam LinkedIn wystarcza do outreachu, o który chodzi) albo ok. 100 pełnych adresów e-mail.
Do wolumenu z planu 30-dniowego (400 dotknięć/mies.) potrzebny jest płatny plan
albo trzymanie się LinkedIna jako kanału głównego.

## Filtry użyte do listy seed

Narzędzie: `mcp__prospeo__search_person`. Segment 1 (2 strony, 50 osób):

```json
{
  "person_location_search": { "include": ["Poland"] },
  "company_industry": { "include": [
    "Building Materials", "Wholesale Building Materials",
    "Industrial Machinery Manufacturing", "Machinery Manufacturing",
    "Metalworking Machinery Manufacturing"
  ]},
  "company_headcount_range": ["11-20", "21-50", "51-100", "101-200"],
  "person_seniority": { "include": ["Founder/Owner", "C-Suite"] },
  "max_person_per_company": 1
}
```

Segment 2 (1 strona, 25 osób): to samo z `company_industry: ["Real Estate"]`.

**W tej puli zostało jeszcze 572 osoby w segmencie 1** (łącznie 597, 24 strony).
Kolejne strony: ten sam payload z `"page": 3, 4, 5...`.

### Warianty warte przetestowania

| Cel | Zmiana w filtrach |
|---|---|
| Szefowie sprzedaży zamiast właścicieli | `person_department: {"include": ["Sales", "Marketing"]}` + `person_seniority: ["Head", "Director"]` |
| Usługi B2B i consulting (czwarty segment ze strony) | `company_type.subtypes: ["Consulting", "Professional Services"]` |
| Firmy, które właśnie rosną (mają ból skalowania) | `company_headcount_growth: {"min": 10, "timeframe_month": 12, "departments": ["Sales"]}` |
| Nowy decydent na stanowisku (kupuje chętniej) | `person_job_change: {"timeframe_days": 90, "only_new_company": true}` |
| Firmy rekrutujące na obsługę klienta | `company_job_posting_hiring_for: {"include": ["specjalista ds. obsługi klienta", "customer service"]}` |

Ostatni wiersz to najmocniejszy sygnał zakupowy, jaki możecie wyciągnąć automatycznie:
firma, która **szuka człowieka do odbierania zapytań**, ma dokładnie ten problem,
który rozwiązujecie, i ma już na to budżet.

**Zawsze** sprawdzajcie wartości filtrów przez `mcp__prospeo__search_suggestions`
(darmowe), zanim wydacie kredyt. Zgadywane nazwy branż i lokalizacji zwracają zero wyników.

## Firmy palące budżet w Google Ads (najlepszy target, dane z Semrush)

Reklamodawca ma policzalny ból: kupuje kliknięcia, a zapytania czekają do rana.

```
mcp__Semrush__execute_report
  report: "phrase_adwords"
  params: { "phrase": "hale stalowe", "database": "pl", "display_limit": 50 }
```

Zwraca domeny reklamujące się na frazę. Dla "hale stalowe" wyszły m.in.
`cobouw.pl`, `centrum-hal.pl`, `tradestaal.pl`.

Koszty kliknięcia w waszych niszach (baza `pl`, wrzesień 2026, raport `phrase_these`,
CPC w USD):

| Fraza | Wolumen | CPC | Konkurencja |
|---|---|---|---|
| hale stalowe | 2 400 | 3,29 | 1,00 |
| fotowoltaika dla firm | 720 | 2,32 | 0,07 |
| konstrukcje stalowe | 9 900 | 1,60 | 0,30 |
| automatyka przemysłowa | 1 900 | 1,15 | 0,27 |
| maszyny cnc | 5 400 | 0,78 | 1,00 |
| domy modułowe | 49 500 | 0,17 | 1,00 |

Użyjcie tych liczb dosłownie w mailu (`sekwencje.md`, mail 2). Konkretna kwota z rynku
odbiorcy robi więcej niż akapit o korzyściach z AI.

Kolejne frazy do sprawdzenia: `wynajem koparek`, `magazyn wysokiego składowania`,
`mieszkania [miasto] deweloper`, `hale namiotowe`, `posadzki przemysłowe`,
`automatyka bram`, `systemy alarmowe dla firm`.

## Przepis na "perfekcyjny lead" (trzy kroki, sprawdzone)

Tak powstała paczka `2026-09-18-ads-hale`. Każdy krok dokłada inną warstwę
i dopiero trzeci daje materiał na naprawdę osobistą wiadomość.

**1. Kto płaci za leady** (Semrush, `phrase_adwords`). Firma, która kupuje
kliknięcia, ma policzalny ból i zna cenę swojego leada. Frazy, które zwróciły
reklamodawców: `hale stalowe`, `konstrukcje stalowe`, `hale namiotowe`,
`regały magazynowe`. Wiele fraz zwraca `NOTHING FOUND`, więc trzeba ich
przejechać kilkanaście, żeby uzbierać pulę.

**2. Kto tam decyduje** (Prospeo, `search_person` z filtrem
`company.websites.include` na domenach z kroku 1). Jedno zapytanie zamienia
listę domen w listę nazwisk ze stanowiskami i wielkością firmy.

**3. Czym ta firma żyje** (Prospeo, `enrich_person` pojedynczo). To jest krok,
który robi różnicę, i ten, o którym łatwo zapomnieć, bo wygląda jak zwykłe
odsłonięcie adresu. Zwraca przy okazji:

| Dane | Co z tego wynika dla wiadomości |
|---|---|
| Opis firmy po polsku | czym naprawdę handlują, ich własnymi słowami |
| Stack technologiczny strony | czy mają czat, jaki formularz, czy mają Google Ads, czy mierzą konwersję |
| Historia zatrudnienia osoby | czy jest nowa na stanowisku, czy ma przeszłość techniczną |
| Słowa kluczowe i telefon | konkrety do zaczepienia |

Przykłady z tej paczki: prezes UNI-FORM był wcześniej programistą .NET
i Salesforce. Wicedyrektor Das Company prowadziła dział IT, a wcześniej
pracowała w contact center, a firma ma na stronie czat. Dyrektor w WDX awansował
pięć miesięcy temu. Żadnej z tych rzeczy nie ma w zwykłej bazie firm, a każda
daje pierwsze zdanie, którego nie da się wysłać do nikogo innego.

**Uwaga na limity.** Na darmowym planie `bulk_enrich_person` odbija się od
limitu zapytań. `enrich_person` pojedynczo działa, ale też z przerwami, więc
paczkę buduje się partiami. Koszt to 1 kredyt za odsłonięty adres.

## Pipeline docelowy (zbudujcie w n8n, dni 1-3)

```
Arkusz/CSV
  -> scrape strony firmy (oferta, cennik, FAQ)
  -> build agenta na tych danych
  -> deploy podstrony couders.com/demo/<slug>
  -> wygeneruj tekst maila z [konkret] ze strony
  -> zapisz link i status w arkuszu
  -> wysyłka 20/dzień + follow-up po 3 i 7 dniach
```

To jest jednocześnie wasz system sprzedaży i case study numer jeden.
Firma, która pokazuje własną maszynę do pozyskiwania klientów, nie musi tłumaczyć,
że umie budować automatyzacje.

## Struktura pliku CSV

Plik z listą **nie jest i nie może być trzymany w tym repo** (patrz `README.md`,
sekcja o danych osobowych). Trzymajcie go na dysku zespołu.

`segment, firma, domena, branza, zatrudnienie, osoba, stanowisko, miasto, linkedin,
email_status, email_maska, prospeo_person_id, status, data_kontaktu, kanal, notatka`

- `email_maska` to podgląd (`j*****@przyklad.pl`). Pełny adres wymaga odsłonięcia
  przez `mcp__prospeo__bulk_enrich_person` z `prospeo_person_id`, 1 kredyt za osobę.
  72 z 75 rekordów ma status `VERIFIED`, więc adresy istnieją i nie odbiją.
- `status` prowadźcie w wartościach: `nowy` → `demo_gotowe` → `wyslane` → `follow_1`
  → `follow_2` → `odpowiedz` → `spotkanie` → `oferta` → `klient` / `odpadl`.
- Ten CSV wystarcza za CRM na pierwsze 30 dni. Nie kupujcie narzędzia, którego jeszcze
  nie potrzebujecie.
