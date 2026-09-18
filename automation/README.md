# Automatyczna wysyłka outreachu

Wysyła sekwencje z `docs/outreach/sekwencje.md` do leadów z arkusza, z limitem
dziennym, oknem godzinowym, listą wypisanych i podglądem przed wysyłką.

Kod jest w repo, **dane leadów nigdy**: repozytorium jest publiczne, więc
kolejka żyje w arkuszu Google, do którego skrypt dostaje się przez web app
Apps Script. Ten sam wzorzec, którego używa już formularz kontaktowy.

```
Arkusz Google            GitHub Actions (co rano, pn-pt)
  leady        ──────►     send-outreach.mjs  ──────►  Resend  ──────►  skrzynka
  wypisani                   limit dzienny                              odbiorcy
  log          ◄──────       okno godzinowe
  demos                      lista wypisanych
```

## Uruchomienie (jednorazowo, ok. 30 minut)

### 1. Arkusz

Utwórz arkusz z czterema zakładkami: **leady**, **wypisani**, **log**, **demos**.

W `leady` pierwszy wiersz to nagłówki. Rozpoznawane kolumny:

```
email  firma  domena  osoba  status  sekwencja  krok  demoUrl  demoExpiry
fraza  cpc  konkret  first_sent_at  data_kontaktu  kanal  notatka
```

Plik `lista-leadow-seed.csv` (wysłany osobno, poza repo) importuje się tu
wprost: ma już `firma`, `domena`, `osoba` i `status`. Dołóż kolumnę `email`
po odsłonięciu adresów i kolumnę `sekwencja` z wartością `demo`.

W `wypisani`: kolumna A to adresy, kolumna B to całe domeny do zablokowania.

### 2. Apps Script

Extensions → Apps Script → wklej `apps-script/queue.gs` → w pierwszej linii
podmień `TOKEN` na długi losowy ciąg → Deploy → New deployment → **Web app**,
Execute as **Me**, Access **Anyone** → skopiuj URL kończący się na `/exec`.

"Anyone" znaczy "każdy, kto zna URL **i** token". Bez tokenu każde żądanie
dostaje błąd.

### 3. Nadawca

Kup **osobną domenę** do wysyłki. Nie `couders.com`: jedna nieudana kampania
psuje reputację domeny, na której stoi strona i firmowa poczta. Skrypt to
blokuje i trzeba go świadomie obejść.

Ustaw SPF, DKIM i DMARC, podepnij domenę w [Resend](https://resend.com)
i rozgrzewaj ją 2-3 tygodnie, zaczynając od kilku wiadomości dziennie.
Do tego czasu jedźcie LinkedInem i ciepłą siecią.

### 4. GitHub

**Secrets** (Settings → Secrets and variables → Actions → Secrets):

```
OUTREACH_QUEUE_URL      URL web appa, kończy się na /exec
OUTREACH_QUEUE_TOKEN    ten sam token co w queue.gs
RESEND_API_KEY          klucz z resend.com
```

**Variables** (ta sama strona, zakładka Variables):

```
OUTREACH_FROM                   "Imię z Couders <imie@nowa-domena.com>"
OUTREACH_REPLY_TO               adres, na który mają przychodzić odpowiedzi
OUTREACH_UNSUBSCRIBE_MAILBOX    skrzynka do wypisywania się, realnie czytana
OUTREACH_SENDER_BLOCK           "Couders, Kraków | NIP ... | couders.com"
OUTREACH_DAILY_CAP              20
OUTREACH_TIMEZONE               Europe/Warsaw
OUTREACH_ENABLED                false   <- główny włącznik, na razie zostaw
```

### 5. Test

Actions → **Outreach** → Run workflow → `send` odznaczone. Przebieg pokaże
w logu każdą wiadomość, która by wyszła, i powód pominięcia każdej, która nie.
Przeczytajcie to jak odbiorca.

Lokalnie to samo:

```bash
cp automation/.env.example automation/.env   # uzupełnij
set -a && . automation/.env && set +a
node automation/scripts/send-outreach.mjs            # podgląd
node automation/scripts/send-outreach.mjs --limit 3  # mniejsza porcja
```

### 6. Start

Gdy podgląd wygląda dobrze, ustaw `OUTREACH_ENABLED` na `true`. Od tej chwili
harmonogram (7:10 UTC, pn-pt) wysyła naprawdę. Pauza to ta sama zmienna z
powrotem na `false`.

## Bezpieczniki

Skrypt odmawia wysyłki, a nie wysyła "na wszelki wypadek":

| Bezpiecznik | Zachowanie |
|---|---|
| Domyślny dry run | Bez `--send` nic nie wychodzi. Harmonogram dodaje ten flag sam |
| `OUTREACH_ENABLED` | Musi być `true`, inaczej twardy błąd. Drugi, niezależny włącznik |
| Domena główna | Nadawca na `couders.com` jest odrzucany |
| Limit dzienny | Domyślnie 20 wiadomości na przebieg |
| Okno godzinowe | Tylko dni robocze, 8:00-17:00 czasu lokalnego |
| Lista wypisanych | Adres albo cała domena, sprawdzane przed każdą wysyłką |
| Jedna firma dziennie | Dwie osoby z tej samej domeny nie dostają maila tego samego dnia |
| Status zamykający | `odpowiedz`, `spotkanie`, `klient`, `odpadl`, `wypisany` zatrzymują sekwencję |
| Braki w danych | Wiersz bez `cpc` albo bez `demoUrl` jest pomijany z powodem, zamiast wysłać wiadomość z dziurą |
| Nieuzupełnione pola | Tekst z `{{...}}` albo `[Firma]` nigdy nie wychodzi |
| Stopka | Identyfikacja nadawcy i sposób wypisania się doklejane automatycznie, plus nagłówek `List-Unsubscribe` |

Reguły decyzyjne mają testy:

```bash
node --test automation/scripts/guards.test.mjs
```

Te same testy blokują wysyłkę w Actions: jeśli logika jest zepsuta, nic nie
wychodzi.

## Sekwencje i szablony

`templates/` zawiera po jednym pliku na wiadomość. Nazwa pliku nie ma
znaczenia, liczy się `id` we front matter w formacie `<sekwencja>-<krok>`:

| Plik | Kiedy |
|---|---|
| `demo-1.md` | dzień 0, link do demo |
| `demo-2.md` | dzień 3, matematyka kosztu leada |
| `demo-3.md` | dzień 7, zamknięcie pętli |
| `zgoda-1.md` | wariant zgodowy, pierwszy kontakt pyta o zgodę zamiast sprzedawać |

`requires` wymienia pola, bez których wiadomość nie wyjdzie. `threadWith`
sprawia, że follow-up trafia do tego samego wątku zamiast zakładać nowy.
Odstępy zmienia `OUTREACH_STEP_DELAYS` (domyślnie `0,3,7` dni).

Żeby prowadzić sekwencję zgodową zamiast demo, wpiszcie `zgoda` w kolumnie
`sekwencja`. Nic więcej nie trzeba zmieniać.

## Prawo

Prawo komunikacji elektronicznej (od listopada 2024) wymaga uprzedniej zgody
na marketing bezpośredni i obejmuje także firmy. Dlatego w repo jest wariant
zgodowy, stopka z pełną identyfikacją, nagłówek `List-Unsubscribe` i lista
wypisanych sprawdzana przy każdej wysyłce.

To ogranicza ryzyko, ale go nie zeruje. **Przed masową wysyłką skonsultujcie
się z kancelarią.** Godzina konsultacji kosztuje mniej niż jedna skarga.

## Zmiana dostawcy poczty

`scripts/lib/mailer.mjs` to jedna funkcja i jedno zapytanie HTTP. Zamiana
Resend na cokolwiek innego to podmiana tego pliku. Reszta pipeline'u nie wie,
czym wysyłacie.
