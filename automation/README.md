# Wysyłka outreachu

Dwa tryby. **Domyślny jest lokalny** i nie wymaga żadnego klucza API.

| Tryb | Kiedy | Czego potrzebuje |
|---|---|---|
| **Lokalny** (`send-local.mjs`) | teraz | własna skrzynka i hasło aplikacji |
| Zautomatyzowany (`send-outreach.mjs`) | gdy zechcecie, żeby pisało się samo | arkusz Google, Resend, GitHub Actions |

---

# Tryb lokalny

```
Claude w rozmowie              Twój laptop                    Twoja skrzynka
  szuka leadów        ──►  outbox/paczka.json  ──►  send-local.mjs  ──►  Gmail
  pisze maile                (przeczytaj je)        co 10-12 min losowo
```

Claude robi research i pisze treści, Wy je czytacie, skrypt tylko rozsyła.
Nic się nie generuje w momencie wysyłki, więc każde zdanie, które trafia do
prospekta, przeszło przez człowieka. Żadnych kluczy API.

## Uruchomienie (ok. 20 minut)

### 1. Skrzynka

Załóżcie **osobną domenę i skrzynkę** do wysyłki. Nie `couders.com`: jedna
nieudana kampania psuje reputację domeny, na której stoi strona i firmowa
poczta. Skrypt to blokuje i trzeba go świadomie obejść.

Gmail wymaga **hasła aplikacji**, nie hasła do konta:
Konto Google → Bezpieczeństwo → Weryfikacja dwuetapowa (musi być włączona)
→ Hasła aplikacji → wygeneruj, skopiuj 16 znaków.

Ustawcie SPF, DKIM i DMARC na nowej domenie i przez pierwsze dwa tygodnie
wysyłajcie po kilka wiadomości dziennie, zanim wejdziecie na pełne 20.

### 2. Konfiguracja

```bash
cd automation
npm install
cp .env.example .env    # uzupełnij SMTP_USER, SMTP_PASS, OUTREACH_FROM, stopkę
```

### 3. Sprawdzenie

```bash
npm run check -- --outbox outbox/przyklad.json --show
```

Pokaże plan, tempo, szacowany czas i pełną treść każdej wiadomości.
**Przeczytajcie to jak odbiorca.** Nic nie wychodzi.

### 4. Wysyłka

```bash
npm run send -- --outbox outbox/nazwa-paczki.json
```

Skrypt najpierw sprawdza logowanie do skrzynki, potem wysyła pierwszą
wiadomość i czeka losowo 10-12 minut przed następną. Zostawcie terminal
otwarty; w logu widać, co poszło i o której będzie następna:

```
Skrzynka OK: michal@couders-ai.com
[09:12]  1/15  g.rusak@example.pl                 SPETECH
           następna za 11:24 (09:23)
[09:23]  2/15  m.kowalski@example.pl              Baumalog
           następna za 10:41 (09:34)
```

Ctrl+C kończy po bieżącej wiadomości. Zamknięcie laptopa, zerwane wifi,
restart: stan jest zapisywany po **każdej** wysyłce, więc kolejne uruchomienie
podejmuje pracę dokładnie tam, gdzie stanęła, i nigdy nie wyśle drugi raz do
tego samego adresu w tej samej paczce.

## Tempo i dlaczego akurat tak

Losowy odstęp 10-12 minut to jedna z trzech rzeczy, które sprawiają, że
wysyłka wygląda jak człowiek przy klawiaturze, i sama z siebie jest najsłabszą
z nich:

| Mechanizm | Po co |
|---|---|
| Losowy odstęp 10-12 min, co do sekundy | żadne dwie wysyłki nie są w równym odstępie ani na granicy minuty |
| Okno 8:00-17:00, dni robocze | nikt nie pisze zimnych maili o 4 rano, a taki wzorzec widać od razu |
| Limit 20 dziennie | to wolumen, nie odstęp, uruchamia większość heurystyk |

Same odstępy przy 200 mailach dziennie i tak skończą się filtrem. Wszystkie
trzy ustawia się w `.env`.

Przy 20 wiadomościach i średnio 11 minutach przerwy jeden przebieg zajmuje
około 3,5 godziny, czyli mieści się w jednym przedpołudniu.

## Bezpieczniki

Skrypt woli nie wysłać, niż wysłać coś, czego nie powinien:

| Bezpiecznik | Zachowanie |
|---|---|
| Domyślne sprawdzanie | Bez `--send` nic nie wychodzi |
| Weryfikacja skrzynki | Złe hasło aplikacji wychodzi na jaw przed pierwszą wysyłką, nie po jedenastu minutach |
| Stan na dysku | Zapisywany po każdej wysyłce. Restart nie powtarza adresu |
| Lista wypisanych | `automation/wypisani.txt`, adres albo cała domena, jedna linia na wpis |
| Limit dzienny | Liczony ze stanu, więc obejmuje wszystkie paczki z danego dnia |
| Okno godzinowe | Poza godzinami skrypt zatrzymuje się i mówi, kiedy wrócić |
| Domena główna | Nadawca na `couders.com` jest odrzucany |
| Walidacja paczki | Zły adres, pusty temat, duplikat, `{{pole}}` albo `[Firma]` blokują całą paczkę przed wysyłką |
| Trzy błędy z rzędu | Przy zerze wysłanych skrypt się zatrzymuje, zamiast tłuc w ścianę |
| Stopka | Identyfikacja nadawcy, sposób wypisania się i nagłówek `List-Unsubscribe` doklejane automatycznie |

Reguły mają testy:

```bash
cd automation && npm test
```

## Lista wypisanych

Jedna linia na wpis, `#` to komentarz:

```
jan.kowalski@firma.pl      # poprosił mailem 22.09
konkurencja.pl             # cała domena
```

Gdy ktoś odpisze "STOP", dopiszcie go **od razu**. Plik jest w `.gitignore`.

## Skąd się biorą paczki

Z rozmowy z Claude. Format i sposób zamawiania: `outbox/README.md`.

---

# Tryb zautomatyzowany (opcjonalny)

Gdy zechcecie, żeby leady i teksty powstawały bez Waszego udziału, w repo
czeka drugi komplet: kolejka w arkuszu Google (`apps-script/queue.gs`),
szablony sekwencji (`templates/`), wysyłka przez Resend
(`scripts/send-outreach.mjs`) i harmonogram w GitHub Actions
(`.github/workflows/outreach.yml`), a do tego generator demo w `n8n/`.

Wymaga trzech kluczy: Anthropic, Resend i tokenu arkusza. Do czasu, aż je
założycie, ta ścieżka jest wyłączona (`OUTREACH_ENABLED=false`) i nic nie robi.

---

# Prawo

Prawo komunikacji elektronicznej (od listopada 2024) wymaga uprzedniej zgody
na marketing bezpośredni i obejmuje także firmy. Dlatego każda wiadomość
niesie pełną identyfikację nadawcy, sposób wypisania się i nagłówek
`List-Unsubscribe`, a lista wypisanych jest sprawdzana przed każdą wysyłką.
W `templates/zgoda-1.md` jest wariant, w którym pierwszy kontakt pyta o zgodę
zamiast sprzedawać.

To ogranicza ryzyko, ale go nie zeruje. **Przed masową wysyłką skonsultujcie
się z kancelarią.** Godzina konsultacji kosztuje mniej niż jedna skarga.
