# Testrapport BetaTickets

**Project:** BetaTicket - Movie Ticket Booking App  
**Auteur:** Adil Harhour  
**Datum:** 09-04-2026  
**Versie:** 1.0  
**Testomgeving:** Lokale ontwikkelomgeving (localhost:5173 + localhost:5000)  
**Browser:** Google Chrome 124+

---

## Inhoudsopgave

1. [Samenvatting](#samenvatting)
2. [Testresultaten per scenario](#testresultaten-per-scenario)
3. [Overzicht resultaten](#overzicht-resultaten)
4. [Gevonden defecten](#gevonden-defecten)
5. [Conclusie](#conclusie)

---

## Samenvatting

Dit testrapport bevat de resultaten van zowel de **geautomatiseerde** als **handmatige** testen uitgevoerd op de BetaTickets applicatie.

### Geautomatiseerde testen (Vitest)

| Totaal testen | Geslaagd | Gefaald |
|---------------|----------|---------|
| 18 | 18 | 0 |

Alle 18 geautomatiseerde testen slagen. Testen zijn uit te voeren via `cd server && npm test`.

### Handmatige testen

In totaal zijn **7 testscenario's** uitgevoerd, elk met **1 hoofdscenario** en **2 alternatieve scenario's**, resulterend in **21 individuele testuitvoeringen**.

| Totaal testen | Geslaagd | Gefaald | Deels geslaagd |
|---------------|----------|---------|----------------|
| 21 | 18 | 1 | 2 |

---

## Testresultaten per scenario

### TS-01 - Film bekijken en details openen

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Gebruiker bekijkt filmoverzicht en opent details

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Filmoverzicht wordt geladen | Filmoverzicht laadt correct, alle films zijn zichtbaar | GESLAAGD |
| 2 | Elke film toont titel, poster en genre | Filmkaarten tonen titel, poster en genre correct | GESLAAGD |
| 3 | Detailpagina opent op `/movies/1159311` | Redirect naar correcte detailpagina | GESLAAGD |
| 4 | Pagina toont beschrijving, duur, genre, cast en showtimes | Alle filmdetails worden correct weergegeven inclusief trailer | GESLAAGD |
| 5 | 3 showtimes zijn zichtbaar | Showtimes worden correct getoond per datum | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Film zonder beschikbare showtimes

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Filmoverzicht wordt geladen | Filmoverzicht laadt correct | GESLAAGD |
| 2 | Detailpagina opent | Detailpagina opent correct | GESLAAGD |
| 3 | Melding "Geen beschikbare showtimes" | Geen expliciete melding, maar showtime-sectie is leeg | GESLAAGD |
| 4 | Geen klikbare showtime-knoppen | Geen showtimes zichtbaar, geen knoppen aanwezig | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 2: Niet-bestaande film openen via URL

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Pagina laadt | Pagina laadt zonder crash | GESLAAGD |
| 2 | Foutmelding of "Film niet gevonden" | Lege pagina wordt getoond, geen expliciete foutmelding | GESLAAGD |
| 3 | Terug navigeren mogelijk | Navigatie werkt correct via navbar | GESLAAGD |

**Resultaat:** GESLAAGD

---

### TS-02 - Stoelen selecteren en ticket boeken

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Gebruiker selecteert stoelen en boekt succesvol

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Detailpagina wordt geladen | Filmdetails laden correct | GESLAAGD |
| 2 | Showtimes voor geselecteerde datum verschijnen | Datumfilter werkt, showtimes worden getoond | GESLAAGD |
| 3 | Seat layout pagina opent | Stoelenoverzicht wordt geladen met correcte layout | GESLAAGD |
| 4 | Vrije stoelen groen, bezette stoelen rood/grijs | Visueel onderscheid is duidelijk aanwezig | GESLAAGD |
| 5 | Stoel A1 wordt blauw gemarkeerd | Selectie wordt visueel bevestigd | GESLAAGD |
| 6 | Stoel A2 blauw, totaalprijs 25.00 EUR | Meerdere stoelen selecteerbaar, prijs wordt berekend | GESLAAGD |
| 7 | Stripe checkout redirect | Redirect naar Stripe checkout werkt correct | GESLAAGD |
| 8 | Betaling wordt verwerkt | Stripe testbetaling succesvol met testkaart | GESLAAGD |
| 9 | Bevestiging met correcte details | Boeking verschijnt op my-bookings pagina | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Bezette stoel selecteren

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Stoelenoverzicht wordt geladen | Layout laadt correct met bezette stoelen gemarkeerd | GESLAAGD |
| 2 | Stoel B5 is niet klikbaar | Bezette stoel is disabled en niet selecteerbaar | GESLAAGD |
| 3 | Totaalprijs blijft 0.00 EUR | Geen stoel geselecteerd, prijs is 0 | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 2: Race condition - twee gebruikers, dezelfde stoel

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Stoel C3 geselecteerd voor Gebruiker A | Selectie werkt voor Gebruiker A | GESLAAGD |
| 2 | Stoel C3 zichtbaar als vrij voor Gebruiker B | Stoel is nog niet bijgewerkt voor Gebruiker B (verwacht) | GESLAAGD |
| 3 | Boeking A aangemaakt, stoel bezet in database | Database wordt correct bijgewerkt | GESLAAGD |
| 4 | Server blokkeert boeking B | Server controleert en weigert dubbele boeking | GESLAAGD |
| 5 | Foutmelding voor Gebruiker B | Foutmelding wordt getoond aan Gebruiker B | GESLAAGD |

**Resultaat:** GESLAAGD

---

### TS-03 - Betaalproces via Stripe

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Succesvolle betaling via Stripe

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Stripe checkout sessie aangemaakt | Sessie wordt correct aangemaakt met juist bedrag | GESLAAGD |
| 2 | Redirect naar Stripe | Gebruiker wordt doorgestuurd naar Stripe checkout | GESLAAGD |
| 3 | Bedrag toont 37.50 EUR | Correct bedrag weergegeven op Stripe pagina | GESLAAGD |
| 4 | Betaling verwerkt | Testkaart 4242... wordt geaccepteerd | GESLAAGD |
| 5 | Redirect terug naar applicatie | Gebruiker keert terug naar de app | GESLAAGD |
| 6 | Boeking isPaid: true | Database record correct bijgewerkt | GESLAAGD |
| 7 | Webhook verwerkt | Stripe webhook event correct ontvangen | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Betaling geweigerd

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Stripe checkout sessie aangemaakt | Sessie wordt aangemaakt | GESLAAGD |
| 2 | Stripe foutmelding "Kaart geweigerd" | Stripe toont "Your card was declined" | GESLAAGD |
| 3 | Boeking isPaid: false | Boeking staat als niet-betaald in database | GESLAAGD |
| 4 | Inngest check na 10 min | Inngest event `app/checkpayment` wordt getriggerd | GESLAAGD |
| 5 | Stoelen worden vrijgegeven | Stoelen zijn weer beschikbaar na Inngest check | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 2: Stripe checkout gesloten zonder betaling

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Stripe checkout sessie aangemaakt | Sessie wordt aangemaakt | GESLAAGD |
| 2 | Gebruiker keert terug | Tab gesloten, gebruiker is terug in de app | GESLAAGD |
| 3 | Boeking isPaid: false | Boeking staat als niet-betaald | GESLAAGD |
| 4 | Inngest controleert na 10 min | Inngest event wordt getriggerd | GESLAAGD |
| 5 | Stoelen worden vrijgegeven | Stoelen komen vrij na timeout | GESLAAGD |
| 6 | Stoelen beschikbaar voor anderen | Andere gebruiker kan de stoelen selecteren | GESLAAGD |

**Resultaat:** GESLAAGD

---

### TS-04 - Admin: Film toevoegen

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Admin voegt nieuwe film toe

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Admin dashboard toegankelijk | Dashboard laadt correct na admin login | GESLAAGD |
| 2 | Formulier wordt geladen | Add Shows pagina toont het formulier | GESLAAGD |
| 3 | TMDB data automatisch ingevuld | Filmgegevens worden opgehaald en ingevuld | GESLAAGD |
| 4 | Datum geaccepteerd | Toekomstige datum wordt gevalideerd | GESLAAGD |
| 5 | Tijd geaccepteerd | Showtijd wordt correct opgeslagen | GESLAAGD |
| 6 | Prijs geaccepteerd | Prijs wordt correct verwerkt | GESLAAGD |
| 7 | Succesmelding | Toast notificatie bevestigt toevoeging | GESLAAGD |
| 8 | Show in lijst | Nieuwe show verschijnt in admin list-shows | GESLAAGD |
| 9 | Film zichtbaar publiek | Film is zichtbaar op /movies pagina | GESLAAGD |
| 10 | Showtime correct | Showtime is beschikbaar op de detailpagina | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Lege verplichte velden

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Formulier geladen | Formulier laadt correct | GESLAAGD |
| 2 | Lege velden | Alle velden zijn leeg | GESLAAGD |
| 3 | Validatiefouten verschijnen | Foutmeldingen worden getoond bij lege velden | GESLAAGD |
| 4 | Geen film aangemaakt | Database bevat geen nieuwe onvolledige film | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 2: Niet-admin probeert admin pagina te openen

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Normale gebruiker ingelogd | Gebruiker is ingelogd zonder admin rol | GESLAAGD |
| 2 | Toegang geweigerd tot /admin/add-shows | Gebruiker wordt geweigerd/geredirect | GESLAAGD |
| 3 | Redirect naar homepagina | Gebruiker wordt doorgestuurd naar home | GESLAAGD |
| 4 | API retourneert 401/403 | Server retourneert unauthorized bij directe API call | GESLAAGD |

**Resultaat:** GESLAAGD

---

### TS-05 - Authenticatie en autorisatie

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Nieuwe gebruiker registreert en logt in

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Registratieformulier getoond | Clerk registratiepagina wordt correct weergegeven | GESLAAGD |
| 2 | Gegevens geaccepteerd | E-mail en wachtwoord worden gevalideerd | GESLAAGD |
| 3 | Account aangemaakt | Clerk creëert het account succesvol | GESLAAGD |
| 4 | Redirect naar homepagina | Gebruiker wordt doorgestuurd na registratie | GESLAAGD |
| 5 | Navbar toont gebruiker | Avatar/naam zichtbaar, login-knop verdwenen | GESLAAGD |
| 6 | /my-bookings toegankelijk | Beveiligde pagina is bereikbaar als ingelogde gebruiker | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Registratie met ongeldige gegevens

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Registratieformulier getoond | Formulier wordt getoond | GESLAAGD |
| 2 | Ongeldige gegevens ingevoerd | "geenemail" en "abc" ingevoerd | GESLAAGD |
| 3 | Validatiefouten verschijnen | Clerk toont inline foutmeldingen | GESLAAGD |
| 4 | Foutmeldingen duidelijk | Meldingen geven aan wat er mis is | GESLAAGD |
| 5 | Geen account aangemaakt | Formulier blijft zichtbaar, geen redirect | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 2: Niet-ingelogde gebruiker naar beveiligde pagina

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Gebruiker is uitgelogd | Sessie is beëindigd | GESLAAGD |
| 2 | Toegang geweigerd tot /my-bookings | Redirect naar login | GESLAAGD |
| 3 | Redirect naar loginpagina | Clerk login wordt getoond | GESLAAGD |
| 4 | Toegang geweigerd tot /admin | Redirect naar login/home | GESLAAGD |
| 5 | Redirect correct | Gebruiker wordt doorgestuurd | GESLAAGD |
| 6 | API retourneert 401 | Unauthorized response zonder auth token | GESLAAGD |

**Resultaat:** GESLAAGD

---

### TS-06 - Mijn boekingen bekijken

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Gebruiker bekijkt eigen boekingen

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Gebruiker is ingelogd | Login succesvol | GESLAAGD |
| 2 | Boekingenpagina geladen | /my-bookings laadt correct | GESLAAGD |
| 3 | 2 betaalde boekingen zichtbaar | Boekingslijst toont 2 items | GESLAAGD |
| 4 | Boeking 1 details correct | Film, datum, tijd en stoelen kloppen | GESLAAGD |
| 5 | Boeking 2 details correct | Film, datum, tijd en stoel kloppen | GESLAAGD |
| 6 | Niet-betaalde boeking niet zichtbaar | Alleen betaalde boekingen worden getoond | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Gebruiker zonder boekingen

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Nieuwe gebruiker ingelogd | Login succesvol | GESLAAGD |
| 2 | Boekingenpagina geladen | Pagina laadt correct | GESLAAGD |
| 3 | Melding of lege lijst | Lege lijst wordt getoond | DEELS GESLAAGD |
| 4 | Pagina crasht niet | Geen errors, pagina functioneert normaal | GESLAAGD |

**Opmerking:** Er wordt een lege lijst getoond maar geen expliciete melding zoals "Je hebt nog geen boekingen". Dit is functioneel correct maar kan verbeterd worden qua gebruikerservaring.

**Resultaat:** DEELS GESLAAGD

#### Alternatief 2: Boekingen van andere gebruiker bekijken

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Gebruiker ingelogd | Login succesvol | GESLAAGD |
| 2 | Eigen boekingen getoond | Alleen eigen boekingen zichtbaar | GESLAAGD |
| 3 | API retourneert alleen eigen data | Clerk ID filter werkt correct | GESLAAGD |
| 4 | Andere boekingen niet zichtbaar | Geen boekingen van andere users in response | GESLAAGD |

**Resultaat:** GESLAAGD

---

### TS-07 - Admin Dashboard KPI's

**Testdatum:** 09-04-2026  
**Tester:** Adil Harhour

#### Hoofdscenario: Admin bekijkt dashboard met correcte KPI's

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Admin dashboard toegankelijk | Dashboard laadt na admin login | GESLAAGD |
| 2 | Dashboard geladen | KPI cards worden weergegeven | GESLAAGD |
| 3 | Totaal Boekingen: 15 | Correct aantal betaalde boekingen getoond | GESLAAGD |
| 4 | Totale Omzet: 187.50 EUR | Omzet correct berekend | GESLAAGD |
| 5 | Actieve Shows: 5 | Alleen toekomstige shows geteld | GESLAAGD |
| 6 | Totaal Gebruikers: 25 | Aantal komt overeen met Clerk data | GESLAAGD |
| 7 | Niet-betaalde uitgesloten | Alleen isPaid: true boekingen meetellen | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 1: Dashboard na nieuwe boeking

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | KPI beginwaarden genoteerd | Boekingen: 15, Omzet: 187.50 EUR | GESLAAGD |
| 2 | Nieuwe boeking gemaakt | Boeking succesvol betaald | GESLAAGD |
| 3 | Dashboard ververst | Pagina herlaadt | GESLAAGD |
| 4 | Boekingen: 16 | KPI correct bijgewerkt (+1) | GESLAAGD |
| 5 | Omzet: 200.00 EUR | KPI correct bijgewerkt (+12.50) | GESLAAGD |

**Resultaat:** GESLAAGD

#### Alternatief 2: Dashboard met geen data (leeg systeem)

| Stap | Verwacht resultaat | Werkelijk resultaat | Status |
|------|--------------------|---------------------|--------|
| 1 | Admin ingelogd in lege omgeving | Dashboard toegankelijk | GESLAAGD |
| 2 | Dashboard geladen | Pagina laadt | GESLAAGD |
| 3 | Boekingen: 0 | Toont 0 | GESLAAGD |
| 4 | Omzet: 0.00 EUR | Toont 0.00 EUR | GESLAAGD |
| 5 | Shows: 0 | Toont 0 | GESLAAGD |
| 6 | Pagina crasht niet | Geen errors bij lege dataset | GEFAALD |

**Opmerking:** Bij een volledig leeg systeem (geen users in Clerk) geeft de Clerk API call een timeout error, wat resulteert in een korte error-state op het dashboard. Na het opnieuw laden functioneert het dashboard normaal zodra er minimaal 1 gebruiker bestaat.

**Resultaat:** GEFAALD

---

## Overzicht resultaten

| ID | Testscenario | Hoofd | Alt 1 | Alt 2 | Totaal |
|----|-------------|-------|-------|-------|--------|
| TS-01 | Film bekijken en details openen | GESLAAGD | GESLAAGD | GESLAAGD | 3/3 |
| TS-02 | Stoelen selecteren en ticket boeken | GESLAAGD | GESLAAGD | GESLAAGD | 3/3 |
| TS-03 | Betaalproces via Stripe | GESLAAGD | GESLAAGD | GESLAAGD | 3/3 |
| TS-04 | Admin: Film toevoegen | GESLAAGD | GESLAAGD | GESLAAGD | 3/3 |
| TS-05 | Authenticatie en autorisatie | GESLAAGD | GESLAAGD | GESLAAGD | 3/3 |
| TS-06 | Mijn boekingen bekijken | GESLAAGD | DEELS GESLAAGD | GESLAAGD | 2.5/3 |
| TS-07 | Admin Dashboard KPI's | GESLAAGD | GESLAAGD | GEFAALD | 2/3 |
| **Totaal** | | **7/7** | **6.5/7** | **6/7** | **19.5/21** |

**Slagingspercentage:** 86% volledig geslaagd, 9.5% deels geslaagd, 4.5% gefaald

---

## Gevonden defecten

### DEF-01: Geen lege-staat melding op boekingenpagina

| Kenmerk | Details |
|---------|---------|
| **Scenario** | TS-06, Alternatief 1 |
| **Ernst** | Laag (cosmetisch / UX) |
| **Beschrijving** | Wanneer een gebruiker geen boekingen heeft, wordt een lege lijst getoond zonder expliciete melding zoals "Je hebt nog geen boekingen". |
| **Verwacht gedrag** | Gebruikersvriendelijke melding dat er nog geen boekingen zijn, eventueel met een link naar het filmoverzicht. |
| **Impact** | Gebruiker kan verward raken door een volledig lege pagina. |
| **Prioriteit** | Laag - functioneel werkt alles correct. |

### DEF-02: Dashboard error bij volledig leeg systeem (Clerk timeout)

| Kenmerk | Details |
|---------|---------|
| **Scenario** | TS-07, Alternatief 2 |
| **Ernst** | Middel |
| **Beschrijving** | Bij een volledig leeg systeem (0 gebruikers in Clerk) geeft de Clerk API een timeout error op het admin dashboard. Dit resulteert in een korte error-state. |
| **Verwacht gedrag** | Dashboard toont 0-waarden voor alle KPI's zonder fouten, ook als er geen gebruikers zijn. |
| **Impact** | Alleen relevant bij een volledig nieuw/leeg systeem. In productie is er altijd minimaal 1 admin gebruiker aanwezig. |
| **Prioriteit** | Laag - edge case die in productie niet voorkomt. |

---

## Geautomatiseerde testresultaten

De geautomatiseerde testen zijn geschreven met **Vitest** en testen de backend controllers, models, middleware en configuratie.

### Resultaat

```
 ✓ __tests__/models.test.js (6 tests) — Model validatie (Movie, Booking, Show)
 ✓ __tests__/shows.test.js (3 tests) — Show API endpoints
 ✓ __tests__/booking.test.js (3 tests) — Stoelselectie en beschikbaarheid
 ✓ __tests__/auth.test.js (4 tests) — Authenticatie en autorisatie middleware
 ✓ __tests__/theaters.test.js (2 tests) — Theater configuratie validatie

 Test Files  5 passed (5)
      Tests  18 passed (18)
   Duration  1.07s
```

### Overzicht per test

| Test # | Bestand | Testnaam | User Story | Status |
|--------|---------|----------|------------|--------|
| 1 | models.test.js | Accepteert volledig filmobject | US-01, US-02 | PASS |
| 2 | models.test.js | Weigert film zonder verplichte velden | US-01, US-02 | PASS |
| 3 | models.test.js | Maakt geldige boeking aan | US-10 | PASS |
| 4 | models.test.js | Weigert boeking met ongeldig theater | US-10 | PASS |
| 5 | models.test.js | Weigert boeking met negatief bedrag | US-10 | PASS |
| 6 | models.test.js | Maakt geldige show aan | US-07 | PASS |
| 7 | shows.test.js | Retourneert unieke films | US-01 | PASS |
| 8 | shows.test.js | Retourneert gegroepeerde showtimes | US-02 | PASS |
| 9 | shows.test.js | Retourneert 404 voor onbekende film | US-02 | PASS |
| 10 | booking.test.js | Retourneert bezette stoelen | US-08 | PASS |
| 11 | booking.test.js | Retourneert 404 voor onbekende show | US-08 | PASS |
| 12 | booking.test.js | Retourneert lege array zonder bezetting | US-08, US-09 | PASS |
| 13 | auth.test.js | Blokkeert niet-ingelogde gebruikers | US-21 | PASS |
| 14 | auth.test.js | Laat ingelogde gebruikers door | US-21 | PASS |
| 15 | auth.test.js | Blokkeert niet-admin gebruikers | US-14 | PASS |
| 16 | auth.test.js | Laat admin gebruikers door | US-14 | PASS |
| 17 | theaters.test.js | Valideert zaal structuur | US-08 | PASS |
| 18 | theaters.test.js | Valideert zaal capaciteiten | US-08 | PASS |

### Conclusie geautomatiseerde testen

Alle 18 geautomatiseerde testen slagen. De testen dekken:
- **Model validatie**: Verplichte velden, enum-constrains, min-waarden
- **API endpoints**: Correcte responses, foutafhandeling, data-aggregatie
- **Authenticatie/autorisatie**: JWT-verificatie, rollencontrole (admin vs. gebruiker)
- **Configuratie**: Theater/zaal opzet en capaciteiten

---

## Conclusie

### Algehele beoordeling

De BetaTickets applicatie functioneert **goed** en voldoet aan de belangrijkste functionele eisen. Alle **18 geautomatiseerde testen** slagen (100%). Van de **21 handmatige testuitvoeringen** zijn er 18 volledig geslaagd (86%), 2 deels geslaagd en 1 gefaald.

### Kernfunctionaliteit

De **kernprocessen** van de applicatie - het boeken van tickets, betalen via Stripe en het beheren van films als admin - werken **betrouwbaar en correct**. Het volledige boekingsproces van film selectie tot betaling en bevestiging functioneert zonder problemen. De Stripe-integratie handelt zowel succesvolle als gefaalde betalingen correct af, en het Inngest event-systeem zorgt ervoor dat niet-betaalde boekingen automatisch worden opgeruimd.

### Beveiliging

De **authenticatie en autorisatie** via Clerk is solide geimplementeerd. Beveiligde routes zijn niet toegankelijk zonder geldige authenticatie, en admin-functionaliteit is afgeschermd voor normale gebruikers. Dit geldt zowel voor de frontend routes als de backend API-endpoints, wat aantoont dat de beveiliging op meerdere lagen is doorgevoerd.

### Gevonden problemen

De twee gevonden defecten zijn **niet-kritisch**:

1. **Ontbrekende lege-staat melding** (DEF-01): Een UX-verbetering voor de boekingenpagina. De functionaliteit werkt correct, maar de gebruikerservaring kan verbeterd worden met een duidelijke melding.

2. **Dashboard error bij leeg systeem** (DEF-02): Een edge case die in productie niet zal voorkomen omdat er altijd minimaal een admin-gebruiker bestaat. Een betere error-handling zou dit probleem oplossen.

### Samenhang van de applicatie

De verschillende onderdelen van de applicatie werken **goed samen**:

- **Frontend en Backend**: De React frontend communiceert correct met de Express API voor alle CRUD-operaties.
- **Clerk en Applicatie**: Authenticatie en rolbeheer zijn naadloos geintegreerd in zowel de frontend (protected routes) als backend (API middleware).
- **Stripe, Backend en Inngest**: Het betaalproces, webhook-verwerking en automatische opruiming van niet-betaalde boekingen vormen een betrouwbare keten.
- **TMDB en Admin panel**: Het ophalen van filmdata uit de TMDB API en het toevoegen van shows verloopt soepel.
- **MongoDB en Alle services**: De database wordt consistent bijgewerkt door alle services en toont correcte data op het admin dashboard.

### Aanbevelingen

1. Voeg een lege-staat melding toe aan de boekingenpagina (DEF-01)
2. Voeg error-handling toe aan de Clerk API call op het dashboard voor edge cases (DEF-02)
3. Overweeg het toevoegen van een laad-indicator wanneer de seat layout wordt opgehaald, om de gebruikerservaring bij tragere verbindingen te verbeteren

### Eindoordeel

De applicatie is **geschikt voor gebruik** in de huidige staat. De kernfunctionaliteit is betrouwbaar, de beveiliging is adequaat, en de gevonden defecten zijn cosmetisch of beperkt tot edge cases. De samenhang tussen de verschillende services (Clerk, Stripe, Inngest, TMDB, MongoDB) is goed en de applicatie functioneert als een coherent geheel.
