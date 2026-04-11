# Verbetervoorstellen BetaTickets

**Project:** BetaTicket - Movie Ticket Booking App  
**Auteur:** Adil Harhour  
**Datum:** 09-04-2026  
**Versie:** 1.0

---

## Inhoudsopgave

1. [5.1 Verbetervoorstellen op basis van testresultaten](#51-verbetervoorstellen-op-basis-van-testresultaten)
2. [5.2 Verbetervoorstellen op basis van oplevering](#52-verbetervoorstellen-op-basis-van-oplevering)
3. [5.3 Reflectie op het proces](#53-reflectie-op-het-proces)
4. [Planning](#planning)

---

## 5.1 Verbetervoorstellen op basis van testresultaten

De volgende verbetervoorstellen komen voort uit de testresultaten en conclusie van het testrapport (Opdracht 4). Tijdens het testen zijn er twee defecten gevonden en zijn er aanvullende observaties gedaan die leiden tot concrete verbetervoorstellen.

### Voorstel 1: Lege-staat meldingen toevoegen op alle pagina's

**Relatie met testresultaat:** TS-06 Alternatief 1 (DEELS GESLAAGD) - Bij het testen van de boekingenpagina voor een gebruiker zonder boekingen werd vastgesteld dat er een lege lijst wordt getoond zonder gebruikersvriendelijke melding.

**Relatie met User Story:** US-11 (Mijn boekingen bekijken)

**Probleem:** Wanneer een gebruiker geen boekingen heeft, toont de `/my-bookings` pagina een volledig lege lijst. Er is geen tekst die de gebruiker informeert over de situatie of een suggestie doet om films te bekijken. Dit kan verwarrend zijn, vooral voor nieuwe gebruikers die net een account hebben aangemaakt.

**Verbetervoorstel:** Voeg op alle pagina's die lijsten tonen (boekingen, favorieten, admin-lijsten) een lege-staat component toe. Dit component toont een duidelijke melding zoals "Je hebt nog geen boekingen" met een call-to-action knop naar het filmoverzicht. Dit verbetert de gebruikerservaring en helpt gebruikers navigeren naar de juiste plek.

**Technische aanpak:**
- Maak een herbruikbaar `EmptyState` component met een icoon, tekst en optionele actieknop
- Implementeer dit component in `MyBookings.jsx`, `Favorite.jsx` en de admin-lijstpagina's
- Toon het component wanneer de opgehaalde data een lege array is

**Impact:** Verbetert de gebruikerservaring en voorkomt verwarring bij nieuwe gebruikers. Sluit aan bij de acceptatiecriteria van US-11 door de boekingenpagina informatief te maken in alle scenario's.

---

### Voorstel 2: Error-handling verbeteren op het admin dashboard (Clerk API)

**Relatie met testresultaat:** TS-07 Alternatief 2 (GEFAALD) - Bij het testen van het admin dashboard in een leeg systeem werd vastgesteld dat de Clerk API een timeout error geeft, waardoor het dashboard kort een error-state toont.

**Relatie met User Story:** US-17 (Totaal gebruikers bekijken), US-19 (Totale omzet bekijken)

**Probleem:** Het admin dashboard haalt KPI-data op via de `/api/admin/dashboard` endpoint. Deze endpoint doet onder andere een call naar de Clerk API om het totaal aantal gebruikers op te halen. Als deze call faalt (door timeout, netwerkproblemen of een leeg systeem) crasht de gehele dashboard-response. De andere KPI's (boekingen, omzet, actieve shows) die uit de eigen MongoDB database komen, worden dan ook niet getoond.

**Verbetervoorstel:** Implementeer onafhankelijke error-handling per KPI in de dashboard controller. Als een enkele API-call faalt, toon dan een fallback-waarde (0 of "Niet beschikbaar") voor die specifieke KPI, terwijl de overige KPI's gewoon worden getoond. Voeg daarnaast een retry-mechanisme toe voor de Clerk API-call.

**Technische aanpak:**
- Gebruik `Promise.allSettled()` in plaats van `Promise.all()` voor het ophalen van dashboard data
- Geef per KPI een status mee in de response (succes of fout)
- Toon in de frontend een waarschuwing bij KPI's die niet geladen konden worden
- Voeg een retry-knop toe waarmee de admin individuele KPI's kan herladen

**Impact:** Maakt het dashboard robuuster tegen externe API-fouten. De admin kan altijd de KPI's zien die beschikbaar zijn, zelfs als een externe service (Clerk) tijdelijk niet bereikbaar is.

---

### Voorstel 3: Correcte HTTP-statuscodes implementeren in API-responses

**Relatie met testresultaat:** Tijdens het testen van de alternatieve scenario's (TS-02 Alt 2: race condition, TS-04 Alt 2: unauthorized access) is gebleken dat de API functioneel correct reageert, maar technisch altijd HTTP-status 200 retourneert, ook bij fouten. Dit werd geobserveerd bij het testen van directe API-calls.

**Relatie met User Story:** US-09 (Dubbele boekingen voorkomen), US-21 (Protected routes)

**Probleem:** De server controllers retourneren bij fouten een JSON-response met `{ success: false, message: error.message }` maar gebruiken geen juiste HTTP-statuscodes. Dit betekent dat een geweigerde boeking (409 Conflict), een validatiefout (400 Bad Request) en een serverfout (500 Internal Server Error) allemaal dezelfde status 200 krijgen. Dit maakt het voor de frontend lastig om onderscheid te maken tussen fouttypen en bemoeilijkt debugging in productie.

**Verbetervoorstel:** Implementeer correcte HTTP-statuscodes in alle API-controllers:
- `400` voor validatiefouten (ontbrekende velden, ongeldige data)
- `401` voor authenticatiefouten (niet ingelogd)
- `403` voor autorisatiefouten (geen admin)
- `409` voor conflicten (stoel al bezet)
- `500` voor onverwachte serverfouten

**Technische aanpak:**
- Maak een centraal error-handling middleware in Express
- Definieer custom error-klassen (ValidationError, ConflictError, AuthError)
- Pas de controllers aan om specifieke errors te gooien
- De frontend kan dan op basis van de statuscode de juiste foutmelding tonen

**Impact:** Verbetert de technische kwaliteit van de API en maakt het makkelijker om fouten te debuggen en af te handelen. De frontend kan gerichter reageren op specifieke fouttypen, wat de gebruikerservaring bij foutscenario's verbetert.

---

### Voorstel 4: Realtime stoelstatus-updates voor het boekingsproces

**Relatie met testresultaat:** TS-02 Alternatief 2 (race condition test) - Hoewel de server dubbele boekingen correct voorkomt, werd vastgesteld dat Gebruiker B pas een foutmelding krijgt na het klikken op "Boek nu". De stoelenstatus op het scherm van Gebruiker B is op dat moment al verouderd.

**Relatie met User Story:** US-08 (Stoelen selecteren), US-09 (Dubbele boekingen voorkomen)

**Probleem:** De seat layout wordt eenmalig opgehaald bij het laden van de pagina. Als een andere gebruiker in de tussentijd stoelen boekt, ziet de huidige gebruiker nog steeds de oude stoelenstatus. De fout wordt pas ontdekt bij het daadwerkelijk aanmaken van de boeking. Dit kan frustrerend zijn voor gebruikers die al stoelen hebben geselecteerd en het betaalproces willen starten.

**Verbetervoorstel:** Voeg een polling-mechanisme of WebSocket-verbinding toe die de stoelenstatus elke 10-15 seconden ververst. Wanneer een stoel die de gebruiker heeft geselecteerd in de tussentijd bezet raakt, toon dan een melding en deselecteer de stoel automatisch.

**Technische aanpak:**
- Optie 1 (eenvoudig): Implementeer polling met `setInterval` die elke 15 seconden `GET /api/booking/seats/:showId` aanroept
- Optie 2 (geavanceerd): Gebruik Socket.io voor realtime updates wanneer stoelen worden geboekt
- Vergelijk de huidige selectie met de nieuwe data en toon een toast-melding als een geselecteerde stoel bezet is geraakt

**Impact:** Vermindert het aantal gefaalde boekingen door race conditions en verbetert de gebruikerservaring significant. Gebruikers zien direct wanneer stoelen niet meer beschikbaar zijn in plaats van pas bij het afrekenen.

---

## 5.2 Verbetervoorstellen op basis van oplevering

De volgende verbetervoorstellen zijn gebaseerd op de oplevering van het product en de vergelijking tussen de oorspronkelijke user stories en het uiteindelijk opgeleverde resultaat.

### Voorstel 1: Zoek- en filterfunctionaliteit voor films toevoegen

**Relatie met oplevering:** In de huidige oplevering kunnen gebruikers films bekijken in een overzicht (US-01), maar er is geen mogelijkheid om te zoeken of te filteren op genre, titel of datum. Bij een groeiend filmaanbod wordt het steeds lastiger om een specifieke film te vinden.

**Relatie met User Story:** US-01 (Films bekijken) - De acceptatiecriteria vermelden dat films genre tonen, maar er is geen filter op genre geimplementeerd.

**Probleem:** Het filmoverzicht toont alle beschikbare films in een grid. Naarmate er meer films worden toegevoegd door de admin, wordt het overzicht onoverzichtelijk. Gebruikers moeten handmatig door alle films scrollen om een specifieke film te vinden.

**Verbetervoorstel:** Voeg een zoekbalk en filteropties toe aan de `/movies` pagina:
- Een tekstzoekveld dat filtert op filmtitel
- Genre-filters (knoppen of dropdown) waarmee gebruikers films op genre kunnen filteren
- Sorteermogelijkheden (datum, beoordeling, nieuwste)

**Relatie met testresultaten:** In TS-01 werd getest dat het filmoverzicht correct laadt en films toont. Met een zoek- en filterfunctionaliteit wordt dit scenario uitgebreid en de bruikbaarheid vergroot.

**Impact op gebruikerservaring:** Gebruikers vinden sneller de film die ze zoeken, wat de conversie van bezoeker naar boeker verhoogt. Dit is vooral belangrijk bij een groter filmaanbod.

---

### Voorstel 2: E-mailbevestiging na succesvolle boeking

**Relatie met oplevering:** In het huidige systeem wordt een boeking bevestigd via de `/my-bookings` pagina, maar de gebruiker ontvangt geen e-mailbevestiging. Nodemailer is al geinstalleerd als dependency maar wordt niet actief gebruikt voor boekingsbevestigingen.

**Relatie met User Story:** US-10 (Boeking bevestigen) - De acceptatiecriteria vermelden een bevestigingspagina, maar geen e-mailbevestiging.

**Probleem:** Na een succesvolle betaling via Stripe wordt de gebruiker teruggestuurd naar de applicatie en kan de boeking zien op de boekingenpagina. Er is echter geen bevestiging buiten de applicatie. Als een gebruiker de browser sluit na de betaling maar voor het zien van de bevestiging, heeft deze geen bewijs van de boeking totdat hij weer inlogt.

**Verbetervoorstel:** Implementeer automatische e-mailbevestigingen na elke succesvolle boeking. De e-mail bevat: filmnaam, datum, tijd, geselecteerde stoelen, betaald bedrag en een QR-code of boekingsnummer. Gebruik het bestaande Nodemailer-pakket en trigger de e-mail vanuit het Inngest event-systeem na bevestiging van de Stripe-betaling.

**Technische aanpak:**
- Maak een e-mail template met de boekingsgegevens
- Voeg een Inngest-functie toe die na `checkout.session.completed` een e-mail verstuurt
- Gebruik het e-mailadres uit het Clerk-gebruikersprofiel
- Voeg een e-mail status veld toe aan het Booking model voor tracking

**Impact op gebruikerservaring:** Gebruikers hebben een tastbaar bewijs van hun boeking en kunnen de details altijd terugvinden in hun e-mail, ook zonder in te loggen in de applicatie.

---

### Voorstel 3: Prestatie-optimalisatie en lazy loading

**Relatie met oplevering:** US-22 (Snelle laadtijden) was gepland als "Could Have" maar is niet geimplementeerd in de uiteindelijke oplevering vanwege tijdsdruk. De applicatie functioneert, maar er zijn geen optimalisaties doorgevoerd voor laadtijden.

**Relatie met User Story:** US-22 (Snelle laadtijden) - Acceptatiecriteria: pagina's laden binnen 2 seconden, afbeeldingen zijn geoptimaliseerd.

**Probleem:** Alle filmposter-afbeeldingen worden direct geladen bij het openen van het filmoverzicht, ongeacht of de gebruiker ze te zien krijgt. Bij een groot filmaanbod kan dit leiden tot langere laadtijden, vooral op mobiele verbindingen. Daarnaast worden alle JavaScript-bundels bij de eerste paginalading opgehaald.

**Verbetervoorstel:** Implementeer de volgende optimalisaties:
1. **Lazy loading voor afbeeldingen:** Gebruik het `loading="lazy"` attribuut of een Intersection Observer om filmposter-afbeeldingen pas te laden wanneer ze in beeld komen
2. **Code splitting:** Gebruik React.lazy() en Suspense om admin-pagina's apart te bundelen, zodat normale gebruikers deze code niet hoeven te downloaden
3. **Image optimalisatie:** Gebruik WebP-formaat via Cloudinary transformaties voor kleinere bestandsgroottes

**Relatie met testresultaten:** In TS-01 werd getest dat het filmoverzicht correct laadt. Met lazy loading wordt de initiële laadtijd verbeterd zonder de functionaliteit aan te tasten.

**Impact op gebruikerservaring:** Snellere laadtijden, minder dataverbruik op mobiel, en een betere score op web performance metrics (Lighthouse). Dit draagt bij aan US-03 (Responsive gebruiken) en US-22 (Snelle laadtijden).

---

### Voorstel 4: Film bewerken en verwijderen functionaliteit

**Relatie met oplevering:** US-16 (Film bewerken/verwijderen) is geprioriteerd als "Should Have" maar is niet volledig geimplementeerd in de oplevering. De admin kan films toevoegen maar niet wijzigen of verwijderen.

**Relatie met User Story:** US-16 (Film bewerken/verwijderen) - Acceptatiecriteria: bewerkingen worden direct opgeslagen, bij verwijderen verschijnt een bevestigingsdialoog.

**Probleem:** Als een admin een fout maakt bij het toevoegen van een show (verkeerde datum, prijs of showtime), kan dit niet gecorrigeerd worden via de applicatie. De admin moet direct in de database wijzigingen aanbrengen, wat foutgevoelig is en technische kennis vereist.

**Verbetervoorstel:** Voeg bewerkings- en verwijderfunctionaliteit toe aan het admin panel:
- Een "Bewerken" knop op de list-shows pagina die een vooringevuld formulier opent
- Een "Verwijderen" knop met een bevestigingsdialoog
- Validatie dat shows met bestaande boekingen niet verwijderd kunnen worden

**Impact op gebruikerservaring:** De admin kan het filmaanbod volledig beheren zonder technische kennis. Dit voorkomt fouten in de database en maakt het beheer van de applicatie toegankelijker.

---

## 5.3 Reflectie op het proces

In dit onderdeel reflecteer ik op het doorlopen ontwikkelproces en mijn eigen rol daarin. De verbetervoorstellen richten zich op hoe ik het proces in toekomstige projecten beter kan aanpakken.

### Voorstel 1: Eerder beginnen met testen en testscenario's schrijven

**Situatieschets:** Tijdens het project heb ik de testscenario's en het testrapport pas in de laatste fase geschreven, nadat de applicatie al grotendeels af was. Hierdoor waren de testen gericht op het bevestigen dat alles werkte, in plaats van op het ontdekken van problemen tijdens de ontwikkeling.

**Wat ging er mis:** Door pas laat te testen, ontdekte ik het probleem met de lege-staat meldingen (DEF-01) en de Clerk API timeout (DEF-02) pas in de testfase. Als ik eerder testscenario's had geschreven, had ik deze edge cases al tijdens de ontwikkeling van Sprint 3 en 4 kunnen opvangen. De alternatieve scenario's in mijn testplan hadden mij geholpen om bewuster na te denken over foutafhandeling.

**Verbetervoorstel:** In toekomstige projecten wil ik na elke sprint de bijbehorende testscenario's schrijven en uitvoeren. Concreet betekent dit:
- Bij het afronden van een user story direct de testscenario's (hoofd + alternatieven) beschrijven
- De testen uitvoeren voordat ik aan de volgende sprint begin
- Gevonden problemen direct oppakken in dezelfde sprint

**Verwacht effect:** Eerder ontdekken van bugs en edge cases, minder druk in de laatste fase, en een hogere kwaliteit van het eindproduct.

---

### Voorstel 2: Betere tijdsplanning en prioritering van "Should Have" features

**Situatieschets:** In de sprint planning had ik 5 sprints gepland met in totaal ~104 uur werk. De "Must Have" features zijn allemaal geimplementeerd, maar enkele "Should Have" features zoals US-16 (Film bewerken/verwijderen) en US-22 (Snelle laadtijden) zijn niet volledig afgerond.

**Wat ging er mis:** Ik heb in Sprint 2 en 3 meer tijd besteed aan de Stripe-integratie en het Inngest event-systeem dan gepland. Dit waren complexe integraties waar ik geen ervaring mee had. Hierdoor is er in Sprint 5 onvoldoende tijd overgebleven voor de "Should Have" en "Could Have" features. Ik had de complexiteit van de externe service-integraties onderschat.

**Verbetervoorstel:** In toekomstige projecten wil ik:
- Bij de planning een risico-inschatting maken voor features die afhankelijk zijn van externe services
- Een tijdsbuffer van 20% inplannen per sprint voor onvoorziene complexiteit
- Wekelijks de voortgang bijhouden en de planning bijstellen als ik merk dat een sprint uitloopt
- Eerder de keuze maken om een feature te schrappen of te vereenvoudigen in plaats van kwaliteit in te leveren op andere features

**Verwacht effect:** Realistischere planning, minder stress in de laatste sprints, en de mogelijkheid om bewuste keuzes te maken over scope in plaats van achteraf te constateren dat features niet af zijn.

---

### Voorstel 3: Meer aandacht voor code-structuur en herbruikbaarheid vanaf het begin

**Situatieschets:** Tijdens het bouwen van de applicatie heb ik me vooral gefocust op het werkend krijgen van de functionaliteit. Dit resulteerde in werkende code, maar de structuur en herbruikbaarheid zijn niet altijd optimaal. Zo heb ik in meerdere controllers vergelijkbare error-handling patronen geschreven in plaats van een centraal error-handling middleware.

**Wat ging er mis:** In de eerste sprints heb ik snel code geschreven om features op te leveren. Toen ik later vergelijkbare patronen nodig had (zoals error-handling in de booking-, admin- en user-controllers), heb ik de code gekopieerd in plaats van een herbruikbare oplossing te maken. Dit maakte het lastiger om later verbeteringen door te voeren, omdat ik dezelfde wijziging op meerdere plekken moest aanbrengen.

**Verbetervoorstel:** In toekomstige projecten wil ik:
- Na elke sprint een korte code-review doen van mijn eigen werk en patronen identificeren die herbruikbaar gemaakt kunnen worden
- Bij het starten van een nieuwe feature eerst kijken of er bestaande code is die ik kan hergebruiken of generaliseren
- Centrale middleware en utility-functies opzetten voor veelvoorkomende patronen (error-handling, validatie, response-formatting)

**Verwacht effect:** Schonere codebase die makkelijker te onderhouden en uit te breiden is. Wijzigingen hoeven maar op een plek doorgevoerd te worden, wat de kans op inconsistenties en bugs verkleint.

---

### Voorstel 4: Documentatie bijhouden tijdens het ontwikkelen, niet achteraf

**Situatieschets:** De documentatie voor dit project (testplan, testscenario's, testrapport, verbetervoorstellen) heb ik grotendeels aan het einde van het project geschreven. Tijdens de ontwikkeling heb ik me gefocust op het bouwen van features en heb ik weinig tussentijds gedocumenteerd.

**Wat ging er mis:** Doordat ik de documentatie achteraf schreef, moest ik teruggaan in mijn eigen code en git-history om te achterhalen welke keuzes ik had gemaakt en waarom. Sommige beslissingen die ik tijdens Sprint 2 had genomen (zoals de keuze voor Inngest boven een cron-job) kon ik me niet meer volledig herinneren. Dit kostte extra tijd en de documentatie is minder gedetailleerd dan het had kunnen zijn.

**Verbetervoorstel:** In toekomstige projecten wil ik:
- Per sprint een kort dagboek bijhouden van genomen beslissingen en de redenen daarachter
- Na elke sprint de relevante documentatie bijwerken (testplan, architectuurdocument)
- Commit-berichten uitgebreider schrijven zodat ze als documentatie kunnen dienen
- Wekelijks 30 minuten reserveren voor het bijwerken van documentatie

**Verwacht effect:** Betere en completere documentatie die het ontwikkelproces nauwkeurig reflecteert. Minder tijdsdruk aan het einde van het project en een duidelijker beeld van de gemaakte keuzes.

---

## Planning

De verbetervoorstellen zijn geprioriteerd op basis van impact en urgentie. De planning is opgesteld als een mogelijke volgende sprint.

### Sprint: Verbeteringen (18 april — 2 mei 2026)

| Prio | Voorstel | Bron | Geschatte uren | Week |
|------|----------|------|---------------|------|
| 1 | Lege-staat meldingen toevoegen (5.1-V1) | Testen: DEF-01 | 3 | Week 1 |
| 2 | Error-handling dashboard verbeteren (5.1-V2) | Testen: DEF-02 | 4 | Week 1 |
| 3 | Film bewerken/verwijderen (5.2-V4) | Oplevering: US-16 | 8 | Week 1 |
| 4 | Correcte HTTP-statuscodes (5.1-V3) | Testen | 4 | Week 1 |
| 5 | Zoek- en filterfunctionaliteit (5.2-V1) | Oplevering: US-01 | 6 | Week 2 |
| 6 | E-mailbevestiging (5.2-V2) | Oplevering: US-10 | 6 | Week 2 |
| 7 | Prestatie-optimalisatie (5.2-V3) | Oplevering: US-22 | 6 | Week 2 |
| 8 | Realtime stoelstatus (5.1-V4) | Testen: TS-02 | 10 | Backlog |

**Totaal gepland:** 47 uur (exclusief V4 op backlog)

### Prioritering

1. **5.1-V1 en 5.1-V2** eerst: direct gekoppeld aan gefaalde/deels geslaagde testen, snel te fixen
2. **5.2-V4** vervolgens: niet-geïmplementeerde user story die de opdrachtgever verwacht
3. **5.1-V3** daarna: technische kwaliteitsverbetering met impact op alle API-endpoints
4. **5.2-V1, V2, V3** als functionele uitbreidingen die de gebruikerservaring verbeteren
5. **5.1-V4** op backlog: meest complex, niet direct noodzakelijk voor huidige schaal

### Procesverbeteringen (5.3)

De reflectie-voorstellen zijn procesverbeteringen die niet in een sprint passen, maar structureel worden toegepast:

| Voorstel | Wanneer toepassen |
|----------|-------------------|
| 5.3-V1: Eerder testen | Vanaf dag 1 van het volgende project |
| 5.3-V2: Betere tijdsplanning | Vanaf de planningsfase, wekelijks evalueren |
| 5.3-V3: Code-structuur en herbruikbaarheid | Bij elke sprint, code-review na elke feature |
| 5.3-V4: Documentatie bijhouden | Continu, 30 min per week reserveren |

---

## Overzicht

| Criterium | Aantal voorstellen |
|-----------|-------------------|
| 5.1 Testen | 4 voorstellen (lege-staat, error handling, HTTP codes, realtime stoelen) |
| 5.2 Oplevering | 4 voorstellen (zoeken/filteren, e-mail, performance, film CRUD) |
| 5.3 Reflectie | 4 voorstellen (testen, planning, code-structuur, documentatie) |
| **Totaal** | **12 verbetervoorstellen + planning** |
