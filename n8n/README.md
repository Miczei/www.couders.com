# Generator demo (n8n)

Dwa workflow'y, które zamieniają wiersz w arkuszu w działające demo asystenta
na danych konkretnej firmy, pod adresem `couders.com/pl/demo/?id=<token>`.

To jest silnik kroku 3 z `docs/outreach/README.md`: zamiast pisać "zajmujemy
się AI", wysyłacie link do asystenta, który zna katalog odbiorcy.

| Plik | Co robi |
|---|---|
| `demo-generator.workflow.json` | Co rano bierze firmy bez demo, czyta ich stronę, buduje konfigurację asystenta i zapisuje link na wierszu leada |
| `demo-serve.workflow.json` | Serwuje demo przeglądarce: konfigurację strony i odpowiedzi w czacie |

## Jak to się spina

```
arkusz (leady)                    n8n: generator demo
  │ status = nowy                   │ czyta stronę firmy
  │ brak demoUrl        ──────────► │ Claude buduje konfigurację
  │                                 │ zapisuje demos + demoUrl na wierszu
  ▼                                 ▼
arkusz (demos)  ◄──── n8n: serwer demo ◄──── couders.com/pl/demo/?id=token
                          │ konfiguracja + czat
                          ▼
                      Claude (wiedza tylko ze strony firmy)
```

Klucz do Anthropic i token arkusza nigdy nie trafiają do przeglądarki:
strona rozmawia wyłącznie z webhookiem n8n.

## Import

1. n8n → **Workflows → Import from File** → oba pliki.
2. Ustaw zmienne środowiskowe instancji n8n (Settings → Environment albo
   `docker-compose.yml`):

   | Zmienna | Wartość |
   |---|---|
   | `ANTHROPIC_API_KEY` | klucz z console.anthropic.com |
   | `ANTHROPIC_MODEL` | opcjonalnie, domyślnie `claude-opus-5` |
   | `COUDERS_QUEUE_URL` | URL web appa Apps Script (kończy się na `/exec`) |
   | `COUDERS_QUEUE_TOKEN` | ten sam token co `TOKEN` w `automation/apps-script/queue.gs` |
   | `COUDERS_SITE_URL` | `https://couders.com` |
   | `COUDERS_DEMO_BATCH` | ile demo dziennie, domyślnie 10 |
   | `COUDERS_DEMO_TTL_DAYS` | po ilu dniach demo wygasa, domyślnie 7 |

   n8n domyślnie blokuje `$env` w wyrażeniach. Ustaw
   `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, inaczej węzły dostaną puste wartości.

3. Aktywuj **oba** workflow'y. Serwer demo musi być aktywny, bo inaczej
   webhooki działają tylko w trybie testowym i link z maila nie zadziała.
4. Skopiuj produkcyjny adres webhooka (bez `/demo-config` na końcu, np.
   `https://n8n.couders.com/webhook`) i wpisz go w GitHubie jako zmienną
   repozytorium `NEXT_PUBLIC_DEMO_API`. Strona pobiera go przy budowaniu.

## Co robi generator, krok po kroku

1. **Co rano** o 6:30 pobiera kolejkę leadów z arkusza.
2. **Wybiera firmy bez demo**: status `nowy`, pusty `demoUrl`, jest domena.
   Maksymalnie `COUDERS_DEMO_BATCH` na przebieg.
3. **Po jednej firmie** (batch = 1), żeby błąd jednej strony nie wywracał reszty.
4. **Pobiera stronę** firmy i **wyciąga treść**. Mniej niż 400 znaków tekstu
   kończy się pominięciem: lepiej brak demo niż demo, po którym widać, że
   nikt nie spojrzał na biznes odbiorcy.
5. **Claude buduje konfigurację**: nazwa, opis, powitanie, 3 sugerowane
   pytania, 6-10 par pytanie/odpowiedź z treści strony, prompt systemowy oraz
   `emailDetail`, czyli dopełnienie zdania "zna ofertę ..." do maila.
6. **Sprawdza konfigurację**. Model dostaje polecenie "wyłącznie JSON", ale
   parser i tak zdejmuje bloki kodu i sprawdza komplet pól. Braki kończą się
   pominięciem z powodem zapisanym na wierszu, nie wysypaniem workflow.
7. **Zapisuje** demo do zakładki `demos`, a na wierszu leada ustawia
   `demoUrl`, `demoExpiry` i `konkret`. Od tej chwili wysyłka maili widzi ten
   wiersz jako gotowy.

Token demo to slug firmy plus losowy sufiks (`spetech-a7f3c1`). Dzięki temu
linków nie da się zgadywać ani wyliczyć, więc lista celów nie wycieka.

## Zasady, które celowo są w środku

- **Asystent odpowiada wyłącznie z treści strony firmy.** Prompt zabrania
  wymyślania cen, terminów i certyfikatów, a czego nie ma w wiedzy, o tym
  asystent mówi wprost i proponuje kontakt z zespołem. Demo, które kłamie o
  cenniku odbiorcy, kosztuje więcej niż brak demo.
- **Historia rozmowy jest przycinana** do 12 ostatnich wiadomości po 2000
  znaków. Jedna otwarta karta nie wygeneruje rachunku bez końca.
- **Demo wygasa.** Data wygaśnięcia jest sprawdzana po stronie serwera, więc
  stary link przestaje działać nawet, jeśli ktoś go zachował. To także deadline
  w sekwencji mailowej.
- **Odmowa modelu** nie pokazuje się odbiorcy jako błąd, tylko jako zdanie
  odsyłające do zespołu.

## Koszt

Jedno demo to jedno wywołanie modelu na kilkanaście tysięcy tokenów wejścia.
Rozmowa to kolejne wywołania, krótkie, z `effort: low` dla szybkiej odpowiedzi.
Przy 10 demo dziennie koszt jest rzędu kilku dolarów miesięcznie, czyli mniej
niż jedno kliknięcie w "hale stalowe" tygodniowo. Aktualne stawki:
https://www.anthropic.com/pricing

## Zanim odpalicie na ostro

Uruchomcie generator ręcznie (**Execute workflow**) na dwóch, trzech firmach
i **przeczytajcie wygenerowane demo jak odbiorca**. Jeśli asystent myli
produkty albo brzmi ogólnikowo, poprawcie prompt w węźle "Zbuduj konfigurację
demo", a nie wysyłajcie. Pierwsze demo, które zobaczy prezes, decyduje o tym,
czy odpisze.
