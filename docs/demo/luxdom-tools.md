# Lux Dom demo — pięć narzędzi agenta (ElevenLabs → n8n)

Konfiguracje do wklejenia w ElevenLabs plus kontrakt odpowiedzi, którego musi
trzymać się n8n. Wszystkie ścieżki webhooków są przykładowe, podmień host.

---

## Konwencje, których trzymają się wszystkie narzędzia

**1. Zawsze HTTP 200.** Nawet przy błędzie. Kiedy webhook zwraca 500, agent nie
dostaje nic i zaczyna improwizować w telefonie. Błąd zwracaj jako
`{"sukces": false, "komunikat": "..."}` z gotowym zdaniem do wypowiedzenia.

**2. Pole `komunikat` w każdej odpowiedzi.** Jedno polskie zdanie, które agent
może przeczytać dosłownie. To jest najprostszy sposób na to, żeby narzędzie, a
nie model, decydowało o tym, co słyszy mieszkaniec.

**3. Liczby wracają w formie do wymówienia.** Numer sprawy jako
`"cztery, cztery, siedem, jeden"`, kwota jako `"czterysta dwadzieścia złotych i
pięćdziesiąt groszy"`, termin jako `"we wtorek, dziesiątego marca, o dziewiątej"`.
Surowe `4471` zostaw w osobnym polu do logów. Kod w sekcji 7.

**4. Odpowiedź poniżej dwóch sekund.** W n8n odpowiadaj natychmiast węzłem
`Respond to Webhook`, a wolne rzeczy (mail, zapis, powiadomienia) rób po
odpowiedzi. `response_timeout_secs` ustaw na 8, nie na 30. Cisza dłuższa niż
trzy sekundy brzmi jak zerwane połączenie.

**5. Numer dzwoniącego bierz z systemu, nie od modelu.** `{{system__caller_id}}`
wstawiaj jako stałą w body, zamiast pytać rozmówcę o numer, z którego dzwoni.

> Nazwy zmiennych systemowych (`system__caller_id`, `system__conversation_id`)
> potwierdź w panelu przed spotkaniem. Dokumentacja ElevenLabs była w tej sesji
> zablokowana przez politykę sieciową, kształt `api_schema` jest zweryfikowany,
> pełna lista zmiennych systemowych nie.

---

## 1. utworz_zgloszenie

```json
{
  "type": "webhook",
  "name": "utworz_zgloszenie",
  "description": "Tworzy nowe zgłoszenie awarii, usterki lub sprawy administracyjnej. Wywołaj dopiero po potwierdzeniu adresu i numeru lokalu na głos. Przy priorytecie krytycznym od razu po tym narzędziu połącz z dyżurnym przez transfer_to_number. Zwraca numer sprawy, który przeczytaj cyframi pojedynczo.",
  "response_timeout_secs": 8,
  "api_schema": {
    "url": "https://n8n.couders.com/webhook/luxdom/zgloszenie",
    "method": "POST",
    "request_headers": {
      "X-Api-Key": "{{LUXDOM_DEMO_KEY}}",
      "Content-Type": "application/json"
    },
    "request_body_schema": {
      "type": "object",
      "required": ["adres", "numer_lokalu", "kategoria", "opis", "priorytet"],
      "properties": {
        "adres": {
          "type": "string",
          "description": "Adres nieruchomości potwierdzony przez rozmówcę, na przykład 'Sarmacka 12'."
        },
        "numer_lokalu": {
          "type": "string",
          "description": "Numer mieszkania lub lokalu. Jeśli sprawa dotyczy części wspólnej, wpisz 'część wspólna'."
        },
        "kategoria": {
          "type": "string",
          "enum": ["woda", "ogrzewanie", "prad", "winda", "domofon", "brama", "elewacja", "sprzatanie", "rozliczenia", "inne"],
          "description": "Kategoria sprawy. Wybierz najbliższą, przy wątpliwości wpisz 'inne'."
        },
        "opis": {
          "type": "string",
          "description": "Co się dzieje, własnymi słowami rozmówcy, od kiedy trwa. Dwa, trzy zdania. Nie dopisuj własnych domysłów."
        },
        "priorytet": {
          "type": "string",
          "enum": ["krytyczny", "zwykly"],
          "description": "Krytyczny gdy: gaz, dym, trwające zalanie, brak wody, prądu lub ogrzewania w całym budynku, uwięzienie w windzie, zagrożenie zdrowia. W pozostałych przypadkach zwykły."
        },
        "dostep_do_lokalu": {
          "type": "string",
          "description": "Kiedy technik może wejść, na przykład 'po 16:00 w dni robocze'. Pomiń przy priorytecie krytycznym."
        },
        "imie_zglaszajacego": {
          "type": "string",
          "description": "Imię i nazwisko rozmówcy, jeśli je podał."
        },
        "telefon": {
          "type": "string",
          "constant_value": "{{system__caller_id}}",
          "description": "Numer, z którego przyszło połączenie."
        },
        "id_rozmowy": {
          "type": "string",
          "constant_value": "{{system__conversation_id}}",
          "description": "Identyfikator rozmowy do powiązania z transkryptem."
        }
      }
    }
  }
}
```

**Odpowiedź z n8n:**

```json
{
  "sukces": true,
  "duplikat": false,
  "numer_sprawy": "4471",
  "numer_sprawy_do_wymowienia": "cztery, cztery, siedem, jeden",
  "komunikat": "Zgłoszenie przyjęte, numer sprawy cztery, cztery, siedem, jeden. Dyżurny technik dostał powiadomienie."
}
```

**Wariant z duplikatem** (ten sam adres, ta sama kategoria, otwarta sprawa z
ostatnich 24 godzin). Wykrywaj to po stronie n8n, nie licz na model:

```json
{
  "sukces": true,
  "duplikat": true,
  "numer_sprawy_do_wymowienia": "cztery, cztery, siedem, jeden",
  "komunikat": "Ta awaria jest już zgłoszona pod numerem cztery, cztery, siedem, jeden, przyjęta o dwudziestej dwunastej. Technik jest umówiony na dwudziestą drugą trzydzieści. Dopisałam Panią do sprawy i wyślę powiadomienie o naprawie."
}
```

To jest scena numer jeden z demo. Bez wykrywania duplikatu agent założyłby
czterdzieste zgłoszenie tej samej awarii i wyszedłby na głupszego od człowieka.

---

## 2. status_zgloszenia

```json
{
  "type": "webhook",
  "name": "status_zgloszenia",
  "description": "Sprawdza stan sprawy już zgłoszonej. Użyj gdy rozmówca podaje numer sprawy, pyta 'co ze zgłoszeniem', albo gdy zmienna open_tickets nie jest pusta. Nie twórz nowego zgłoszenia, zanim tego nie sprawdzisz.",
  "response_timeout_secs": 8,
  "api_schema": {
    "url": "https://n8n.couders.com/webhook/luxdom/status",
    "method": "POST",
    "request_headers": {
      "X-Api-Key": "{{LUXDOM_DEMO_KEY}}",
      "Content-Type": "application/json"
    },
    "request_body_schema": {
      "type": "object",
      "required": [],
      "properties": {
        "numer_sprawy": {
          "type": "string",
          "description": "Numer sprawy podany przez rozmówcę, same cyfry bez kratki."
        },
        "adres": {
          "type": "string",
          "description": "Adres nieruchomości, gdy rozmówca nie zna numeru sprawy."
        },
        "numer_lokalu": {
          "type": "string",
          "description": "Numer lokalu, gdy rozmówca nie zna numeru sprawy."
        }
      }
    }
  }
}
```

**Odpowiedź:**

```json
{
  "sukces": true,
  "znaleziono": true,
  "etap": "w realizacji",
  "kto_prowadzi": "dyżurny technik",
  "nastepny_krok": "wizyta technika dziś o dwudziestej drugiej trzydzieści",
  "komunikat": "Sprawa cztery, cztery, siedem, jeden jest w realizacji. Technik jest umówiony na dziś na dwudziestą drugą trzydzieści."
}
```

Gdy nic nie znaleziono, `znaleziono: false` i `komunikat` w stylu: „Nie widzę
takiej sprawy w systemie. Mogę przyjąć nowe zgłoszenie."

---

## 3. umow_wizyte

Jedno narzędzie, dwie akcje. Agent najpierw pobiera terminy, potem potwierdza
wybrany. Jeśli w testach zacznie mylić kolejność, rozbij to na dwa osobne
narzędzia, `pobierz_terminy` i `potwierdz_termin`.

```json
{
  "type": "webhook",
  "name": "umow_wizyte",
  "description": "Umawia wizytę technika, odczyt licznika, odbiór kluczy lub spotkanie z administratorem. Wywołaj najpierw z akcja='pobierz_terminy', przeczytaj rozmówcy dwa lub trzy terminy, a po jego wyborze wywołaj ponownie z akcja='potwierdz' i identyfikatorem wybranego terminu. Nigdy nie podawaj terminu, którego nie zwróciło to narzędzie.",
  "response_timeout_secs": 8,
  "api_schema": {
    "url": "https://n8n.couders.com/webhook/luxdom/wizyta",
    "method": "POST",
    "request_headers": {
      "X-Api-Key": "{{LUXDOM_DEMO_KEY}}",
      "Content-Type": "application/json"
    },
    "request_body_schema": {
      "type": "object",
      "required": ["akcja", "typ_wizyty", "adres", "numer_lokalu"],
      "properties": {
        "akcja": {
          "type": "string",
          "enum": ["pobierz_terminy", "potwierdz"],
          "description": "Najpierw pobierz_terminy, potem potwierdz."
        },
        "typ_wizyty": {
          "type": "string",
          "enum": ["technik", "odczyt_licznika", "odbior_kluczy", "spotkanie_z_administratorem"],
          "description": "Rodzaj wizyty."
        },
        "adres": { "type": "string", "description": "Adres nieruchomości." },
        "numer_lokalu": { "type": "string", "description": "Numer lokalu." },
        "preferencje": {
          "type": "string",
          "description": "Preferencje rozmówcy co do terminu, na przykład 'tylko popołudniami' albo 'nie w piątek'. Pole opcjonalne."
        },
        "id_terminu": {
          "type": "string",
          "description": "Identyfikator terminu zwrócony przy akcji pobierz_terminy. Wymagany tylko przy akcji potwierdz."
        },
        "telefon": {
          "type": "string",
          "constant_value": "{{system__caller_id}}",
          "description": "Numer dzwoniącego."
        }
      }
    }
  }
}
```

**Odpowiedź na `pobierz_terminy`:**

```json
{
  "sukces": true,
  "terminy": [
    { "id": "t1", "opis_do_wymowienia": "we wtorek, dziesiątego marca, o dziewiątej rano" },
    { "id": "t2", "opis_do_wymowienia": "w środę, jedenastego marca, o wpół do drugiej" }
  ],
  "komunikat": "Mam dwa terminy. We wtorek, dziesiątego marca, o dziewiątej rano, albo w środę, jedenastego marca, o wpół do drugiej. Który pasuje?"
}
```

**Odpowiedź na `potwierdz`:**

```json
{
  "sukces": true,
  "termin_do_wymowienia": "we wtorek, dziesiątego marca, o dziewiątej rano",
  "komunikat": "Zapisane, wtorek, dziesiątego marca, o dziewiątej rano. Wyślę potwierdzenie SMS-em."
}
```

---

## 4. zamow_dokument

```json
{
  "type": "webhook",
  "name": "zamow_dokument",
  "description": "Przyjmuje zamówienie na zaświadczenie, uchwałę, protokół lub inny dokument. Ustal typ dokumentu, lokal, kto zamawia i w jakiej roli oraz formę odbioru. Podaj rozmówcy wyłącznie termin zwrócony przez to narzędzie.",
  "response_timeout_secs": 8,
  "api_schema": {
    "url": "https://n8n.couders.com/webhook/luxdom/dokument",
    "method": "POST",
    "request_headers": {
      "X-Api-Key": "{{LUXDOM_DEMO_KEY}}",
      "Content-Type": "application/json"
    },
    "request_body_schema": {
      "type": "object",
      "required": ["typ_dokumentu", "adres", "numer_lokalu", "zamawiajacy", "rola_zamawiajacego", "forma_odbioru"],
      "properties": {
        "typ_dokumentu": {
          "type": "string",
          "enum": ["zaswiadczenie_o_niezaleganiu", "uchwala", "protokol_zebrania", "plan_gospodarczy", "sprawozdanie_finansowe", "inne"],
          "description": "Rodzaj dokumentu."
        },
        "adres": { "type": "string", "description": "Adres nieruchomości." },
        "numer_lokalu": { "type": "string", "description": "Numer lokalu, którego dotyczy dokument." },
        "zamawiajacy": { "type": "string", "description": "Imię i nazwisko lub nazwa firmy zamawiającego." },
        "rola_zamawiajacego": {
          "type": "string",
          "enum": ["wlasciciel", "notariusz", "posrednik", "bank", "najemca", "inna"],
          "description": "W jakiej roli występuje zamawiający. Zapytaj wprost, jeśli nie wynika to z rozmowy."
        },
        "na_kiedy": {
          "type": "string",
          "description": "Kiedy dokument jest potrzebny, jeśli rozmówca podał termin, na przykład 'na akt notarialny w czwartek'."
        },
        "forma_odbioru": {
          "type": "string",
          "enum": ["email", "osobiscie", "poczta"],
          "description": "Jak dokument ma trafić do zamawiającego."
        },
        "email": {
          "type": "string",
          "description": "Adres e-mail, wymagany przy formie odbioru email. Poproś rozmówcę o przeliterowanie i powtórz do potwierdzenia."
        },
        "telefon": {
          "type": "string",
          "constant_value": "{{system__caller_id}}",
          "description": "Numer dzwoniącego."
        }
      }
    }
  }
}
```

**Odpowiedź:**

```json
{
  "sukces": true,
  "numer_zlecenia_do_wymowienia": "dwa, zero, jeden, osiem",
  "termin_do_wymowienia": "do dwóch dni roboczych",
  "wymaga_zgody_wlasciciela": true,
  "komunikat": "Zamówienie przyjęte, numer dwa, zero, jeden, osiem. Zaświadczenie przygotujemy do dwóch dni roboczych, ale ponieważ nie jest Pan właścicielem lokalu, księgowość poprosi właściciela o zgodę na przekazanie danych."
}
```

Pole `wymaga_zgody_wlasciciela` liczy n8n na podstawie roli zamawiającego. To
jest drobiazg, który na spotkaniu robi duże wrażenie, bo pokazuje, że system
myśli o RODO wcześniej niż ich obecny proces.

---

## 5. wyslij_sms

Agent **nie redaguje treści SMS-a**. Wybiera szablon i podaje dane. Wiadomość
wychodzi pod marką klienta, więc model nigdy nie może napisać jej sam.

```json
{
  "type": "webhook",
  "name": "wyslij_sms",
  "description": "Wysyła SMS z potwierdzeniem. Wywołaj po każdym utworzonym zgłoszeniu, umówionej wizycie i zamówionym dokumencie. Wybierz szablon i przekaż dane. Nie układaj treści wiadomości samodzielnie.",
  "response_timeout_secs": 8,
  "api_schema": {
    "url": "https://n8n.couders.com/webhook/luxdom/sms",
    "method": "POST",
    "request_headers": {
      "X-Api-Key": "{{LUXDOM_DEMO_KEY}}",
      "Content-Type": "application/json"
    },
    "request_body_schema": {
      "type": "object",
      "required": ["szablon"],
      "properties": {
        "szablon": {
          "type": "string",
          "enum": ["potwierdzenie_zgloszenia", "potwierdzenie_wizyty", "potwierdzenie_dokumentu", "dostep_do_ekartoteki"],
          "description": "Który szablon wysłać."
        },
        "numer_sprawy": {
          "type": "string",
          "description": "Numer sprawy lub zlecenia, cyframi. Wymagany dla szablonów potwierdzenia."
        },
        "termin": {
          "type": "string",
          "description": "Termin wizyty lub przygotowania dokumentu, tak jak zwróciło go narzędzie."
        },
        "numer_telefonu": {
          "type": "string",
          "constant_value": "{{system__caller_id}}",
          "description": "Domyślnie numer dzwoniącego. Podmień tylko wtedy, gdy rozmówca wyraźnie poprosi o inny."
        }
      }
    }
  }
}
```

**Odpowiedź:**

```json
{
  "sukces": true,
  "komunikat": "Potwierdzenie wysłałam SMS-em na Pana numer."
}
```

**Szablony po stronie n8n:**

```
potwierdzenie_zgloszenia:
  LUX DOM: zgloszenie nr {numer_sprawy} przyjete. Status sprawdzisz w e-kartotece. Nie odpowiadaj na tego SMS-a.

potwierdzenie_wizyty:
  LUX DOM: wizyta {termin}, sprawa nr {numer_sprawy}. Zmiana terminu: 22 292 19 15.

potwierdzenie_dokumentu:
  LUX DOM: zamowienie nr {numer_sprawy} przyjete, termin {termin}.

dostep_do_ekartoteki:
  LUX DOM: e-kartoteka i instrukcja logowania: {link}. Saldo i dokumenty po zalogowaniu.
```

Bez polskich znaków, bo SMS z ogonkami to trzy segmenty zamiast jednego.

---

## 6. transfer_to_number (narzędzie systemowe, nie webhook)

Nie ma schematu JSON, konfigurujesz je w panelu. Na demo dwa cele:

| Warunek | Numer | Komunikat przed przełączeniem |
|---|---|---|
| Awaria krytyczna | dyżurny technik | „Łączę z dyżurnym technikiem, proszę się nie rozłączać." |
| Prośba o człowieka, rada wspólnoty, sprawa sporna, zapytanie nowej wspólnoty | biuro | „Już łączę z biurem." |

Włącz przekazanie transkryptu do odbierającego, jeśli plan na to pozwala.
Na demo drugim numerem niech będzie Twoja własna komórka, odbierana przy stole.
Nic tak nie domyka sceny z awarią jak dzwoniący telefon leżący obok laptopa.

---

## 7. Normalizacja liczb (węzeł Code w n8n)

Wspólny kod dla wszystkich pięciu workflowów. To jest ta jedna rzecz, która
najbardziej podnosi jakość demo, i jednocześnie ta, o której najłatwiej
zapomnieć.

```js
const J = ["zero","jeden","dwa","trzy","cztery","piec","szesc","siedem","osiem","dziewiec"];
const JED = ["zero","jeden","dwa","trzy","cztery","pięć","sześć","siedem","osiem","dziewięć"];
const NAS = ["dziesięć","jedenaście","dwanaście","trzynaście","czternaście","piętnaście","szesnaście","siedemnaście","osiemnaście","dziewiętnaście"];
const DZI = ["","","dwadzieścia","trzydzieści","czterdzieści","pięćdziesiąt","sześćdziesiąt","siedemdziesiąt","osiemdziesiąt","dziewięćdziesiąt"];
const SET = ["","sto","dwieście","trzysta","czterysta","pięćset","sześćset","siedemset","osiemset","dziewięćset"];

// "4471" -> "cztery, cztery, siedem, jeden"
function cyfry(x) {
  return String(x).replace(/\D/g, "").split("").map(d => JED[+d]).join(", ");
}

function pod1000(n) {
  const out = [];
  if (n >= 100) { out.push(SET[Math.floor(n / 100)]); n %= 100; }
  if (n >= 20) { out.push(DZI[Math.floor(n / 10)]); n %= 10; }
  else if (n >= 10) { out.push(NAS[n - 10]); n = 0; }
  if (n > 0) out.push(JED[n]);
  return out.join(" ");
}

function slownie(n) {
  if (n === 0) return "zero";
  const tys = Math.floor(n / 1000), reszta = n % 1000, out = [];
  if (tys === 1) out.push("tysiąc");
  else if (tys > 1) out.push(pod1000(tys), forma(tys, "tysiąc", "tysiące", "tysięcy"));
  if (reszta > 0) out.push(pod1000(reszta));
  return out.filter(Boolean).join(" ");
}

// Polska odmiana przez liczebnik: 1 zloty, 2 zlote, 5 zlotych, 22 zlote, 25 zlotych
function forma(n, jeden, dwa, piec) {
  if (n === 1) return jeden;
  const d = n % 10, s = n % 100;
  if (d >= 2 && d <= 4 && !(s >= 12 && s <= 14)) return dwa;
  return piec;
}

// 1234.5 -> "tysiac dwiescie trzydziesci cztery zlote i piecdziesiat groszy"
function kwota(v) {
  const zl = Math.floor(v), gr = Math.round((v - zl) * 100);
  let out = `${slownie(zl)} ${forma(zl, "złoty", "złote", "złotych")}`;
  if (gr > 0) out += ` i ${slownie(gr)} ${forma(gr, "grosz", "grosze", "groszy")}`;
  return out;
}

return { cyfry, slownie, kwota };
```

Godziny i daty składaj z gotowych słowników, nie licz ich w locie: „o wpół do
drugiej" brzmi po ludzku, „o trzynastej trzydzieści" brzmi jak automat.

---

## 8. Struktura workflow w n8n (ta sama dla każdego narzędzia)

```
Webhook (POST, Respond: Using Respond to Webhook node)
  → IF: X-Api-Key poprawny?  (nie → Respond 200 {"sukces": false, ...})
  → Google Sheets: odczyt (duplikaty, terminy, sprawy)
  → Code: logika + normalizacja liczb do wymowy
  → Respond to Webhook   ← TU KOŃCZY SIĘ CZAS, KTÓRY SŁYCHAĆ
  → Google Sheets: zapis
  → Gmail: powiadomienie administratora
  → HTTP Request: odświeżenie panelu na drugim ekranie
```

Wszystko po węźle `Respond to Webhook` dzieje się już poza słyszalnym czasem
rozmowy. Jeśli zapis do arkusza wykonasz przed odpowiedzią, w telefonie zrobi
się dwusekundowa cisza i cała scena traci tempo.

---

## 9. Testy przed spotkaniem

```bash
KEY=...
BASE=https://n8n.couders.com/webhook/luxdom

# nowe zgłoszenie
curl -s -X POST $BASE/zgloszenie -H "X-Api-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"adres":"Sarmacka 12","numer_lokalu":"34","kategoria":"woda","opis":"Brak cieplej wody od rana","priorytet":"zwykly"}'

# duplikat: to samo drugi raz, oczekiwane duplikat=true
curl -s -X POST $BASE/zgloszenie -H "X-Api-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"adres":"Sarmacka 12","numer_lokalu":"12","kategoria":"woda","opis":"Tez nie ma cieplej wody","priorytet":"zwykly"}'

# awaria krytyczna
curl -s -X POST $BASE/zgloszenie -H "X-Api-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"adres":"Sarmacka 12","numer_lokalu":"34","kategoria":"woda","opis":"Leje sie woda z sufitu","priorytet":"krytyczny"}'

# terminy i potwierdzenie
curl -s -X POST $BASE/wizyta -H "X-Api-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"akcja":"pobierz_terminy","typ_wizyty":"technik","adres":"Sarmacka 12","numer_lokalu":"34"}'

# zaświadczenie zamawiane przez notariusza
curl -s -X POST $BASE/dokument -H "X-Api-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"typ_dokumentu":"zaswiadczenie_o_niezaleganiu","adres":"Sarmacka 12","numer_lokalu":"34","zamawiajacy":"Kancelaria Kowalski","rola_zamawiajacego":"notariusz","forma_odbioru":"email","email":"kancelaria@example.com"}'
```

Sprawdź w odpowiedziach jedną rzecz ponad wszystkie inne: czy każde pole
`komunikat` da się przeczytać na głos bez zająknięcia. Jeśli tak, demo zabrzmi
dobrze. Jeśli gdzieś wyskoczy `4471` albo `420,50 zł`, poprawiaj to teraz, nie
przy kliencie.
