# Paczki wiadomości

Jeden plik JSON to jedna paczka do wysłania. Treści pisze Claude w rozmowie,
skrypt ich nie generuje, więc każde zdanie, które trafi do prospekta, zostało
wcześniej przeczytane przez człowieka.

**Pliki z prawdziwymi paczkami nie trafiają do repo** (są w `.gitignore`),
bo zawierają adresy i nazwiska. W repo zostaje tylko `przyklad.json`.

## Format

```json
{
  "batch": "2026-09-22-przemysl",
  "sequence": "demo",
  "step": 1,
  "messages": [
    {
      "to": "prezes@firma.pl",
      "firma": "Firma",
      "osoba": "Jan Kowalski",
      "notatka": "Dlaczego ten lead pasuje. Nie jest wysyłane.",
      "temat": "temat wiadomości",
      "tresc": "Pełna treść, bez stopki.\n\nStopkę z identyfikacją i sposobem\nwypisania się dokleja skrypt."
    }
  ]
}
```

- `batch` musi być **unikalne dla każdej paczki**. To po nim skrypt pamięta, co
  już wyszło. Powtórzenie nazwy sprawi, że nowa paczka zostanie uznana za
  wysłaną. Konwencja `RRRR-MM-DD-segment` załatwia sprawę.
- `notatka` jest dla Was, nie dla odbiorcy. Służy do szybkiego sprawdzenia,
  czy lead faktycznie pasuje, zanim cokolwiek pójdzie.
- `tresc` **nie zawiera stopki ani podpisu**. Skrypt dokleja identyfikację
  nadawcy i zdanie o wypisaniu się do każdej wiadomości.

## Walidacja

Skrypt odrzuca całą paczkę, zanim wyśle cokolwiek, jeśli znajdzie:
niepoprawny adres, pusty temat, treść krótszą niż 120 znaków albo dłuższą niż
2500, ten sam adres dwa razy, albo nieuzupełnione pole (`{{cokolwiek}}`,
`[Firma]`). Lepiej stracić minutę na poprawkę niż wysłać 30 maili z dziurą.

## Arkusz z leadami

Do przeglądania i zarządzania leadami służy plik `.xlsx` (też poza repo).
Zakładka **Leady** to jeden wiersz na lead: dane firmy i osoby, sygnał
kwalifikujący, fraza reklamowa z CPC, narzędzia wykryte na stronie oraz gotowy
temat i treść wiadomości. Zakładka **Instrukcja** trzyma założenia, kurs USD
użyty do przeliczenia CPC i podsumowanie.

Kolumny na żółtym tle (`Status`, `Data wysyłki`, `Notatki`) są Wasze. Reszta to
dane źródłowe.

### Z arkusza z powrotem do wysyłki

Wysyłacz czyta JSON, nie arkusz. Jeśli poprawicie treść w Excelu:

```bash
# W Excelu: Plik > Zapisz jako > CSV UTF-8 (zakładka Leady)
node scripts/csv-to-outbox.mjs ~/Downloads/leady.csv --batch 2026-09-25-hurtownie
npm run check -- --outbox outbox/2026-09-25-hurtownie.json --show
```

Konwerter pomija wiersze ze statusem innym niż pusty albo `nowy`, więc nie
wyśle drugi raz do kogoś, kto już coś dostał. Radzi sobie z przecinkami,
cudzysłowami i przełamaniami linii wewnątrz treści maila.

**Nazwa paczki musi być nowa.** Skrypt pamięta wysyłki w obrębie paczki, więc
ta sama nazwa na innej liście oznacza, że uzna nowe wiersze za już wysłane, a
inna nazwa na tej samej liście oznacza wysyłkę po raz drugi. Konwencja
`RRRR-MM-DD-segment` wystarcza.

## Jak zamówić nową paczkę

Napisz w rozmowie z Claude, na przykład:

> Zrób paczkę 15 leadów z branży materiałów budowlanych, firmy 20-100 osób,
> które reklamują się w Google. Do każdego spersonalizowany mail, pierwszy
> kontakt.

Dostaniesz plik do wrzucenia w `outbox/`. Potem:

```bash
cd automation
npm run check -- --outbox outbox/nazwa.json --show   # przeczytaj wszystko
npm run send  -- --outbox outbox/nazwa.json          # rozsyłaj
```
