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
