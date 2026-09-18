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
