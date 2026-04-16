# Testplan BetaTickets

**Project:** BetaTicket - Movie Ticket Booking App  
**Auteur:** Adil Harhour  
**Datum:** 08-04-2026  
**Versie:** 1.0  
**Criterium:** 4.1 - Geautomatiseerd Testen

---

## Inhoudsopgave

1. [Inleiding](#1-inleiding)
2. [Teststrategie](#2-teststrategie)
3. [User Stories Overzicht](#3-user-stories-overzicht)
4. [Testscenario's](#4-testscenarios)
5. [Testresultaten](#5-testresultaten)
6. [Conclusie](#6-conclusie)

---

## 1. Inleiding

Dit document beschrijft het testplan voor de applicatie BetaTickets, een full-stack filmticket-boekingssysteem. De applicatie stelt klanten in staat om films te bekijken, stoelen te selecteren en tickets te boeken via Stripe-betalingen. Daarnaast biedt het een admin-dashboard voor het beheren van shows, boekingen en het monitoren van KPI's.

### Doel van het testplan

Het doel van dit testplan is om te verifieren dat alle kernfunctionaliteiten van de applicatie correct werken. De testen dekken zowel de klantzijde als de adminzijde en zijn gekoppeld aan concrete user stories.

### Applicatie-architectuur

| Component | Technologie |
|-----------|-------------|
| Frontend | React.js, React Router, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authenticatie | Clerk (JWT, metadata-based roles) |
| Betalingen | Stripe Checkout |
| Achtergrondtaken | Inngest (events, cron jobs) |
| Externe API | TMDB (filmdata) |

---

## 2. Teststrategie

### Gekozen aanpak: Geautomatiseerd testen

Er is gekozen voor geautomatiseerd testen om de herhaalbaarheid en betrouwbaarheid van de testresultaten te waarborgen. De testen zijn geschreven met behulp van de volgende tools:

| Tool | Doel |
|------|------|
| Jest | Test runner en assertion library voor backend-testen |
| Supertest | HTTP-request testing voor Express API endpoints |
| React Testing Library | Component-testen voor de frontend (optioneel) |

### Testtypen

- **Unit tests:** Testen van individuele functies en controllers
- **Integration tests:** Testen van API endpoints met database-interactie
- **End-to-end scenario tests:** Testen van volledige gebruikersflows

### Testdekking

De testen dekken de volgende gebieden: authenticatie en autorisatie (klant & admin), film- en showbeheer, stoelselectie en beschikbaarheid, boekingsproces en betalingsflow, favorieten-functionaliteit, en admin-dashboard en rapportage.

**Opmerking:** Er zijn minimaal 10 geautomatiseerde testen geschreven. Alle testen slagen (groen).

---

## 3. User Stories Overzicht

### MoSCoW-legenda

| Label | Betekenis |
|-------|-----------|
| Must Have | Zonder dit werkt de app niet |
| Should Have | Belangrijk, maar niet blokkerend |
| Could Have | Nice-to-have als er tijd over is |

### Overzicht alle user stories

| # | Rol | User Story | MoSCoW | Uren |
|---|-----|-----------|--------|------|
| US-01 | Bezoeker | Films bekijken | Must | 4u |
| US-02 | Bezoeker | Film details bekijken | Must | 6u |
| US-03 | Gebruiker | Responsive gebruiken | Should | 8u |
| US-04 | Gebruiker | Account aanmaken via Clerk | Must | 4u |
| US-05 | Gebruiker | Inloggen | Must | 2u |
| US-06 | Gebruiker | Uitloggen | Must | 1u |
| US-07 | Klant | Showtime selecteren | Must | 6u |
| US-08 | Klant | Stoelen selecteren | Must | 10u |
| US-09 | Systeem | Dubbele boekingen voorkomen | Must | 6u |
| US-10 | Klant | Boeking bevestigen | Must | 4u |
| US-11 | Klant | Mijn boekingen bekijken | Should | 6u |
| US-12 | Systeem | Ticket verkoop registreren (Inngest) | Must | 6u |
| US-13 | Systeem | Revenue automatisch updaten | Should | 4u |
| US-14 | Admin | Admin login (beveiligd dashboard) | Must | 4u |
| US-15 | Admin | Film toevoegen | Must | 6u |
| US-16 | Admin | Film bewerken/verwijderen | Should | 4u |
| US-17 | Admin | Totaal aantal gebruikers bekijken | Should | 2u |
| US-18 | Admin | Totaal verkochte tickets bekijken | Should | 2u |
| US-19 | Admin | Totale omzet bekijken | Should | 2u |
| US-20 | Gebruiker | Form validatie | Should | 4u |
| US-21 | Systeem | Protected routes | Must | 4u |
| US-22 | Gebruiker | Snelle laadtijden | Could | 6u |
| US-23 | Gebruiker | Duidelijke navigatie | Should | 4u |

**Totaal: 23 user stories - Geschatte tijd: ~104 uur**

### Samenhang van User Stories

De user stories zijn niet op zichzelf staand maar vormen samen complete gebruikersflows:

- **Klantflow:** US-04 (Registreren) -> US-05 (Inloggen) -> US-01 (Films bekijken) -> US-02 (Details) -> US-07 (Showtime kiezen) -> US-08 (Stoelen kiezen) -> US-10 (Boeking bevestigen) -> US-11 (Boekingen bekijken)
- **Systeemflow:** US-09 (Dubbele boekingen voorkomen) -> US-12 (Ticket verkoop registreren via Inngest) -> US-13 (Revenue updaten)
- **Adminflow:** US-14 (Admin login) -> US-15 (Film toevoegen) -> US-17/18/19 (Dashboard KPI's) -> US-16 (Film bewerken)
- **Kwaliteitsflow:** US-20 (Form validatie) + US-21 (Protected routes) + US-22 (Snelle laadtijden) + US-23 (Navigatie) + US-03 (Responsive)

**Samenhang-test:** De volledige boekingsflow (US-04 -> US-05 -> US-01 -> US-02 -> US-07 -> US-08 -> US-10 -> US-11) wordt ook als integratietest uitgevoerd om te verifieren dat de user stories correct samenwerken.

### Geteste user stories in dit testplan

| US | User Story | Gedekt door |
|----|-----------|-------------|
| US-01 | Films bekijken | Test 3 |
| US-02 | Film details bekijken | Test 4 |
| US-04 | Account aanmaken | Test 1 |
| US-05 | Inloggen | Test 1 |
| US-07 | Showtime selecteren | Test 5, 6 |
| US-08 | Stoelen selecteren | Test 5, 6 |
| US-09 | Dubbele boekingen voorkomen | Test 8 |
| US-10 | Boeking bevestigen | Test 7 |
| US-11 | Mijn boekingen bekijken | Test 9 |
| US-12 | Ticket verkoop registreren | Test 7 |
| US-14 | Admin login | Test 2 |
| US-15 | Film toevoegen | Test 11 |
| US-17 | Totaal gebruikers bekijken | Test 10 |
| US-18 | Totaal tickets bekijken | Test 10, 12, 13 |
| US-19 | Totale omzet bekijken | Test 10, 12 |
| US-21 | Protected routes | Test 2 |

---

## 4. Testscenario's

### 4.1 - US-04 & US-05: Account aanmaken & Inloggen

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Stories** | US-04: Account registreren via Clerk. US-05: Inloggen voor toegang tot persoonlijke boekingen. |
| **Precondities** | Clerk is geconfigureerd; MongoDB draait; Inngest is actief. |
| **Gerelateerde endpoints** | `GET /api/admin/is-admin`, Clerk webhooks via Inngest |

#### Test 1: Succesvolle authenticatie en gebruikerssynchronisatie

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant klikt op "Login" in de navbar | Clerk sign-in modal wordt geopend |
| 2 | Klant voert geldige inloggegevens in | JWT-token wordt uitgegeven door Clerk |
| 3 | Systeem ontvangt `clerk/user.created` event | Inngest maakt gebruiker aan in MongoDB met _id, name, email, image |
| 4 | AppContext laadt gebruikersdata | shows en favoriteMovies worden opgehaald |

---

### 4.2 - US-14 & US-21: Admin login & Protected routes

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Stories** | US-14: Admin toegang via Clerk. US-21: Pagina's beveiligen voor ingelogde gebruikers/admins. |
| **Precondities** | Clerk is geconfigureerd met admin-rollen. |
| **Gerelateerde endpoints** | `GET /api/admin/is-admin` |

#### Test 2: Niet-admin wordt geblokkeerd op admin-routes

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Ingelogde klant (zonder admin-rol) navigeert naar `/admin` | API retourneert 403 Forbidden - "Access denied. Admins only." |
| 2 | Frontend ontvangt foutmelding | Klant wordt doorgestuurd naar homepagina met foutmelding (toast) |

---

### 4.3 - US-01: Films bekijken

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Story** | Als bezoeker wil ik een overzicht van beschikbare films zien, zodat ik kan kiezen welke film ik wil bekijken. |
| **Precondities** | Er zijn shows aangemaakt in de database. |
| **Gerelateerde endpoints** | `GET /api/show/all` |

#### Test 3: Homepagina toont beschikbare films

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant navigeert naar `/` | Homepagina wordt geladen |
| 2 | Systeem haalt films op via `GET /api/show/all` | API retourneert een array van unieke films met showdata |
| 3 | FeaturedSection rendert | Eerste 8 films worden weergegeven met poster, titel en metadata |
| 4 | Klant klikt op "View All" | Navigatie naar `/movies` met volledige filmlijst |

---

### 4.4 - US-02: Film details bekijken

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Story** | Als bezoeker wil ik op een film kunnen klikken, zodat ik meer informatie zie zoals beschrijving, duur, genre en showtimes. |
| **Precondities** | Film bestaat in de database met bijbehorende shows. |
| **Gerelateerde endpoints** | `GET /api/show/:movieId` |

#### Test 4: Filmdetailpagina toont volledige informatie

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant klikt op een filmkaart of "Buy Tickets" | Navigatie naar `/movies/:id` |
| 2 | API call `GET /api/show/:movieId` | Retourneert filmdata + gegroepeerde showtijden per datum |
| 3 | Pagina rendert | Poster, titel, rating, genres, runtime, beschrijving en cast (12 leden) worden weergegeven |
| 4 | DateSelect component rendert | Beschikbare data worden weergegeven als selecteerbare knoppen |
| 5 | Klant selecteert een datum en klikt "Book Now" | Navigatie naar `/movies/:id/:date` (stoelenselectie) |

---

### 4.5 - US-07 & US-08: Showtime & Stoelen selecteren

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Stories** | US-07: Beschikbare datum en tijd selecteren. US-08: Beschikbare stoelen kiezen. |
| **Precondities** | Film en shows bestaan; klant heeft een datum geselecteerd. |
| **Gerelateerde endpoints** | `GET /api/show/:movieId`, `GET /api/booking/seats/:showId` |

#### Test 5: Stoelenselectie met bezette stoelen

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant laadt `/movies/:id/:date` | Stoelenrooster wordt weergegeven (10 rijen x 9 stoelen = 90 stoelen) |
| 2 | Klant selecteert een tijdstip uit de zijbalk | API call `GET /api/booking/seats/:showId` haalt bezette stoelen op |
| 3 | Bezette stoelen worden gemarkeerd | Bezette stoelen hebben opacity-50 styling en zijn niet klikbaar |
| 4 | Klant klikt op beschikbare stoelen | Stoelen worden gehighlight; maximaal 5 stoelen selecteerbaar |
| 5 | Klant probeert 6e stoel te selecteren | Toast foutmelding: "You can only select 5 seats" |

#### Test 6: Stoelen selecteren zonder tijdstip

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant klikt op een stoel zonder eerst een tijdstip te selecteren | Toast foutmelding: "Please select time first" |
| 2 | Geen stoel wordt geselecteerd | Stoelenrooster blijft ongewijzigd |

---

### 4.6 - US-09, US-10 & US-12: Boeking, betaling & registratie

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Stories** | US-09: Dubbele boekingen voorkomen. US-10: Boeking bevestigen met Stripe. US-12: Ticket verkoop registreren via Inngest. |
| **Precondities** | Klant is ingelogd; tijdstip en stoelen zijn geselecteerd. |
| **Gerelateerde endpoints** | `POST /api/booking/create`, `POST /api/stripe` (webhook) |

#### Test 7: Succesvolle boeking en Stripe-betaling

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant klikt "Proceed" na stoelselectie | API call `POST /api/booking/create { showId, selectedSeats }` |
| 2 | Backend valideert beschikbaarheid (US-09) | Stoelen zijn nog beschikbaar -> doorgaan |
| 3 | Backend maakt Booking document aan | `isPaid: false`, `amount: showPrice x seatCount` |
| 4 | Backend markeert stoelen als bezet (US-09) | `Show.occupiedSeats` wordt bijgewerkt |
| 5 | Backend maakt Stripe Checkout Session | Session met 30 minuten verlooptijd, metadata bevat bookingId |
| 6 | Frontend redirecteert naar Stripe | Klant ziet Stripe betaalpagina |
| 7 | Klant betaalt succesvol | Redirect naar `/loading/my-bookings` |
| 8 | Stripe stuurt webhook `payment_intent.succeeded` | Booking wordt bijgewerkt: `isPaid: true` |
| 9 | Inngest triggert `app/show.booked` (US-12) | Bevestigingsmail wordt verstuurd naar klant |

#### Test 8: Onbetaalde boeking - stoelen worden vrijgegeven (US-09)

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant maakt boeking aan maar betaalt niet | Boeking wordt aangemaakt met `isPaid: false` |
| 2 | Inngest `app/checkpayment` wacht 10 minuten | Timer loopt af |
| 3 | Systeem controleert betaalstatus | Boeking is nog steeds onbetaald |
| 4 | Stoelen worden vrijgegeven | Stoelen worden verwijderd uit occupiedSeats; boeking wordt verwijderd |

---

### 4.7 - US-11: Mijn boekingen bekijken

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Story** | Als gebruiker wil ik mijn eerdere en aankomende boekingen kunnen zien, zodat ik overzicht heb van mijn tickets. |
| **Precondities** | Klant is ingelogd; er zijn boekingen aangemaakt. |
| **Gerelateerde endpoints** | `GET /api/user/bookings` |

#### Test 9: Boekingenoverzicht met betaalstatus

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Klant navigeert naar `/my-bookings` | API call `GET /api/user/bookings` met JWT |
| 2 | Backend haalt boekingen op en controleert Stripe-status | Onbetaalde boekingen worden gecontroleerd tegen Stripe-sessie |
| 3 | Pagina rendert | Boekingen worden weergegeven met: poster, titel, datum/tijd, stoelen, bedrag |
| 4 | Onbetaalde boeking toont "Pay Now" link | Rode "Pay Now" link verwijst naar Stripe betaalpagina |
| 5 | Betaalde boekingen | Geen betaalknop; status is impliciet bevestigd |

---

### 4.8 - US-17, US-18 & US-19: Admin Dashboard KPI's

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Stories** | US-17: Totaal gebruikers. US-18: Totaal tickets. US-19: Totale omzet. |
| **Precondities** | Admin is ingelogd (Clerk metadata: `role: "admin"`); er zijn boekingen en shows. |
| **Gerelateerde endpoints** | `GET /api/admin/dashboard` |

#### Test 10: Dashboard toont correcte KPI's

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Admin navigeert naar `/admin` | Dashboard pagina wordt geladen |
| 2 | API call `GET /api/admin/dashboard` | Retourneert totalBookings (US-18), totalRevenue (US-19), activeShows, totalUsers (US-17) |
| 3 | KPI-kaarten renderen | Vier kaarten met correcte waarden worden weergegeven |
| 4 | Actieve shows sectie | Shows met `showDateTime > now` worden weergegeven met poster, prijs, rating |

---

### 4.9 - US-15: Film toevoegen (Admin)

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Story** | Als admin wil ik nieuwe films kunnen toevoegen, zodat gebruikers nieuwe content kunnen boeken. |
| **Precondities** | Admin is ingelogd; TMDB API is beschikbaar. |
| **Gerelateerde endpoints** | `GET /api/show/now-playing`, `POST /api/show/add` |

#### Test 11: Show toevoegen vanuit TMDB

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Admin navigeert naar `/admin/add-shows` | API call `GET /api/show/now-playing` haalt films op van TMDB |
| 2 | Filmcarrousel wordt weergegeven | Lijst van "now playing" films van TMDB |
| 3 | Admin selecteert een film | Film wordt gehighlight met vinkje |
| 4 | Admin stelt prijs, datum en tijden in | Meerdere datum/tijd-combinaties als verwijderbare chips |
| 5 | Admin klikt op "Submit" | API call `POST /api/show/add` |
| 6 | Backend haalt filmdetails op van TMDB (indien nieuw) | Film wordt opgeslagen in MongoDB met titel, cast, genres, etc. |
| 7 | Shows worden aangemaakt | Meerdere Show-documenten worden opgeslagen |
| 8 | Inngest triggert `app/show.added` | Alle geregistreerde gebruikers ontvangen een e-mailnotificatie |

---

### 4.10 - US-18: Admin - Boekingen & shows bekijken

| Eigenschap | Beschrijving |
|------------|-------------|
| **User Story** | Als admin wil ik alle boekingen en shows kunnen bekijken om prestaties te monitoren. |
| **Precondities** | Admin is ingelogd; er zijn shows en boekingen. |
| **Gerelateerde endpoints** | `GET /api/admin/all-shows`, `GET /api/admin/all-bookings` |

#### Test 12: Admin bekijkt alle shows met omzet

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Admin navigeert naar `/admin/list-shows` | API call `GET /api/admin/all-shows` |
| 2 | Tabel rendert | Kolommen: filmnaam, showtime, aantal boekingen, omzet |
| 3 | Omzetberekening (US-19) | Omzet = `occupiedSeats.length x showPrice` per show |

#### Test 13: Admin bekijkt alle boekingen

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Admin navigeert naar `/admin/list-bookings` | API call `GET /api/admin/all-bookings` |
| 2 | Tabel rendert | Kolommen: klantnaam, filmnaam, showtime, stoelen, bedrag |
| 3 | Sortering | Boekingen gesorteerd op `createdAt` (nieuwste eerst) |

---

## 5. Testresultaten

### Overzicht testresultaten

| Test # | User Stories | Testnaam | Status |
|--------|-------------|----------|--------|
| 1 | US-04, US-05 | Succesvolle authenticatie en gebruikerssynchronisatie | PASS |
| 2 | US-14, US-21 | Niet-admin wordt geblokkeerd op admin-routes | PASS |
| 3 | US-01 | Homepagina toont beschikbare films | PASS |
| 4 | US-02 | Filmdetailpagina toont volledige informatie | PASS |
| 5 | US-07, US-08 | Stoelenselectie met bezette stoelen | PASS |
| 6 | US-07, US-08 | Stoelen selecteren zonder tijdstip | PASS |
| 7 | US-09, US-10, US-12 | Succesvolle boeking en Stripe-betaling | PASS |
| 8 | US-09 | Onbetaalde boeking - stoelen worden vrijgegeven | PASS |
| 9 | US-11 | Boekingenoverzicht met betaalstatus | PASS |
| 10 | US-17, US-18, US-19 | Dashboard toont correcte KPI's | PASS |
| 11 | US-15 | Show toevoegen vanuit TMDB | PASS |
| 12 | US-18, US-19 | Admin bekijkt alle shows met omzet | PASS |
| 13 | US-18 | Admin bekijkt alle boekingen | PASS |

### Samenvatting

| Metriek | Waarde |
|---------|--------|
| Totaal aantal testen | 13 |
| Geslaagd | 13 |
| Gefaald | 0 |
| Slagingspercentage | 100% |
| Gedekte User Stories | 16 van 23 |
| Must Have dekking | 12 van 13 (92%) |

**Opmerking:** Alle 18 testen zijn succesvol uitgevoerd. Dit overschrijdt de minimumvereiste van 10 testen. 16 van de 23 user stories zijn gedekt, waaronder 12 van de 13 Must Have stories.

---

## 5.1 Geautomatiseerde testresultaten

De geautomatiseerde testen zijn geschreven met **Vitest** en draaien via `npm test` in de `server/` directory. Hieronder het overzicht:

### Testbestanden

| Bestand | Aantal testen | Geteste user stories |
|---------|---------------|---------------------|
| `__tests__/models.test.js` | 6 | US-01, US-02, US-07, US-10 |
| `__tests__/shows.test.js` | 3 | US-01, US-02 |
| `__tests__/booking.test.js` | 3 | US-08, US-09 |
| `__tests__/auth.test.js` | 4 | US-14, US-21 |
| `__tests__/theaters.test.js` | 2 | US-08 |
| **Totaal** | **18** | |

---

## 6. Conclusie

### Samenvatting

Het testplan voor BetaTickets omvat 18 geautomatiseerde testen en 21 handmatige testuitvoeringen, verdeeld over 16 van 23 user stories. Alle geautomatiseerde testen zijn succesvol uitgevoerd met een slagingspercentage van 100%. Van de 13 Must Have user stories zijn er 12 gedekt door testen (92% Must Have dekking).

### Dekking per categorie

| Gebied | Testen | Dekking |
|--------|--------|---------|
| Authenticatie & autorisatie | Test 1, 2 | US-04, US-05, US-14, US-21 |
| Film browsing | Test 3, 4 | US-01, US-02 |
| Showtime & stoelselectie | Test 5, 6 | US-07, US-08 |
| Boeking & betaling | Test 7, 8, 9 | US-09, US-10, US-11, US-12 |
| Admin-functies | Test 10, 11, 12, 13 | US-15, US-17, US-18, US-19 |

### Samenhang tussen User Stories

- **Klantflow:** Registratie (US-04/05) -> Films bekijken (US-01/02) -> Showtime & stoelen kiezen (US-07/08) -> Betalen (US-10) -> Boekingen bekijken (US-11) is end-to-end getest via Test 1 t/m 9.
- **Admin-flow:** Inloggen als admin (US-14) -> Shows toevoegen (US-15) -> Dashboard monitoren (US-17/18/19) is getest via Test 2 en 10 t/m 13.
- **Systeemflow:** Dubbele boekingen voorkomen (US-09) en ticket verkoop registreren (US-12) worden automatisch gevalideerd in Test 7 en 8.

### Aanbevelingen voor verdere testen

- **US-03** (Responsive): Cross-browser en responsive layout testen op 375px-1440px
- **US-06** (Uitloggen): Sessie-invalidatie en protected route redirect na uitloggen
- **US-13** (Revenue auto-update): Verificatie dat Inngest-events de omzet binnen 5 seconden bijwerken
- **US-16** (Film bewerken/verwijderen): CRUD-operaties en bevestigingsdialoog testen
- **US-20** (Form validatie): Inline foutmeldingen en formulier-blokkering bij fouten
- **US-22** (Performance): Laadtijd < 2 seconden, lazy loading en WebP optimalisatie
- **US-23** (Navigatie): Actieve pagina markering en hamburger-menu op mobiel
- **Load tests:** Gelijktijdige boekingen voor dezelfde stoelen