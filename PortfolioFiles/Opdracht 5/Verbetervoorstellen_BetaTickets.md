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

Op basis van het testrapport (Opdracht 4) zijn er vier verbetervoorstellen opgesteld en doorgevoerd.

### Voorstel 1: Lege-staat meldingen toevoegen

**Bron:** TS-06 Alt 1 (DEELS GESLAAGD) — boekingenpagina toonde lege lijst zonder melding.
**User Story:** US-11 (Mijn boekingen bekijken)

**Probleem:** Gebruikers zonder boekingen zagen een lege pagina zonder uitleg of vervolgstap.

**Oplossing:** Een herbruikbaar `EmptyState` component toegevoegd met icoon, tekst en een knop naar het filmoverzicht. Toegepast op `MyBookings.jsx`, `Favorite.jsx` en admin-lijsten.

**Status:** Verbeterd.

---

### Voorstel 2: Robuustere error-handling admin dashboard

**Bron:** TS-07 Alt 2 (GEFAALD) — Clerk API timeout liet het hele dashboard falen.
**User Story:** US-17, US-19

**Probleem:** Één falende externe call crashte de volledige dashboard-response.

**Oplossing:** `Promise.allSettled()` gebruikt in de dashboard controller, per KPI een status meegegeven, en een retry-knop toegevoegd in de frontend zodat de admin individuele KPI's kan herladen.

**Status:** Verbeterd.

---

### Voorstel 3: Correcte HTTP-statuscodes

**Bron:** Observatie tijdens TS-02 Alt 2 en TS-04 Alt 2 — API retourneerde altijd status 200.
**User Story:** US-09, US-21

**Probleem:** Alle foutresponses gebruikten status 200, waardoor de frontend geen onderscheid kon maken tussen fouttypen.

**Oplossing:** Centrale error-handling middleware in Express toegevoegd met custom error-klassen (`ValidationError`, `ConflictError`, `AuthError`). Controllers retourneren nu 400, 401, 403, 409 en 500 waar passend.

**Status:** Verbeterd.

---

### Voorstel 4: Realtime stoelstatus-updates

**Bron:** TS-02 Alt 2 — race condition liet verouderde stoelenstatus zien.
**User Story:** US-08, US-09

**Probleem:** De stoelenstatus werd eenmalig opgehaald, waardoor gebruikers pas bij "Boek nu" zagen dat een stoel al bezet was.

**Oplossing:** Polling toegevoegd die elke 15 seconden `GET /api/booking/seats/:showId` aanroept. Bezette stoelen worden automatisch gedeselecteerd en de gebruiker krijgt een toast-melding.

**Status:** Verbeterd.

---

## 5.2 Verbetervoorstellen op basis van oplevering

Vier verbeteringen zijn doorgevoerd op basis van de vergelijking tussen de user stories en de oplevering.

### Voorstel 1: Zoek- en filterfunctionaliteit voor films

**Bron:** US-01 (Films bekijken) — geen filter op genre of titel in de oplevering.

**Probleem:** Bij een groeiend filmaanbod werd het overzicht onoverzichtelijk.

**Oplossing:** Op `/movies` zijn een zoekbalk (filter op titel), genre-filters en sorteermogelijkheden (datum, beoordeling, nieuwste) toegevoegd.

**Status:** Verbeterd.

---

### Voorstel 2: E-mailbevestiging na boeking

**Bron:** US-10 (Boeking bevestigen) — Nodemailer was geïnstalleerd maar niet gebruikt.

**Probleem:** Gebruikers hadden geen bevestiging buiten de applicatie om.

**Oplossing:** Een Inngest-functie verstuurt na `checkout.session.completed` een e-mail met filmnaam, datum, tijd, stoelen, bedrag en boekingsnummer. Het e-mailadres komt uit Clerk.

**Status:** Verbeterd.

---

### Voorstel 3: Prestatie-optimalisatie en lazy loading

**Bron:** US-22 (Snelle laadtijden) — niet geïmplementeerd in de eerste oplevering.

**Probleem:** Alle filmposters en bundels werden direct bij paginalading opgehaald.

**Oplossing:** `loading="lazy"` op afbeeldingen, `React.lazy()` + `Suspense` voor code splitting van admin-pagina's, en WebP-transformaties via Cloudinary.

**Status:** Verbeterd.

---

### Voorstel 4: Film bewerken en verwijderen

**Bron:** US-16 (Film bewerken/verwijderen) — "Should Have" die niet af was.

**Probleem:** De admin kon films toevoegen maar niet wijzigen of verwijderen zonder database-toegang.

**Oplossing:** Bewerk- en verwijderknoppen toegevoegd op de list-shows pagina, met een vooringevuld formulier en een bevestigingsdialoog. Shows met bestaande boekingen kunnen niet verwijderd worden.

**Status:** Verbeterd.

---

## 5.3 Reflectie op het proces

### Voorstel 1: Eerder beginnen met testen

**Situatie:** Testscenario's werden pas in de laatste fase geschreven, waardoor DEF-01 en DEF-02 laat aan het licht kwamen.

**Verbetering:** In toekomstige projecten direct na elke user story de testscenario's schrijven en uitvoeren vóór de volgende sprint start.

---

### Voorstel 2: Betere tijdsplanning

**Situatie:** Stripe- en Inngest-integraties kostten meer tijd dan gepland, waardoor "Should Have" features niet afkwamen.

**Verbetering:** 20% buffer per sprint, risico-inschatting voor externe services en wekelijkse bijsturing van de planning.

---

### Voorstel 3: Code-structuur en herbruikbaarheid

**Situatie:** Vergelijkbare error-handling is in meerdere controllers gekopieerd in plaats van centraal opgezet.

**Verbetering:** Na elke sprint een korte zelf-review, en centrale middleware/utilities opzetten voor veelvoorkomende patronen.

---

### Voorstel 4: Documentatie tijdens het ontwikkelen

**Situatie:** Documentatie is grotendeels achteraf geschreven, waardoor beslissingen moeilijk te reconstrueren waren.

**Verbetering:** Per sprint een kort beslissingsdagboek bijhouden en wekelijks 30 minuten reserveren voor documentatie.

---

## Planning

Alle verbetervoorstellen uit 5.1 en 5.2 zijn in de verbeter-sprint (18 april — 2 mei 2026) uitgevoerd.

| Prio | Voorstel | Bron | Uren | Status |
|------|----------|------|------|--------|
| 1 | Lege-staat meldingen (5.1-V1) | DEF-01 | 3 | Verbeterd |
| 2 | Error-handling dashboard (5.1-V2) | DEF-02 | 4 | Verbeterd |
| 3 | Film bewerken/verwijderen (5.2-V4) | US-16 | 8 | Verbeterd |
| 4 | HTTP-statuscodes (5.1-V3) | Testen | 4 | Verbeterd |
| 5 | Zoek- en filterfunctionaliteit (5.2-V1) | US-01 | 6 | Verbeterd |
| 6 | E-mailbevestiging (5.2-V2) | US-10 | 6 | Verbeterd |
| 7 | Prestatie-optimalisatie (5.2-V3) | US-22 | 6 | Verbeterd |
| 8 | Realtime stoelstatus (5.1-V4) | TS-02 | 10 | Verbeterd |

**Totaal:** 47 uur — alle voorstellen doorgevoerd.

### Procesverbeteringen (5.3)

| Voorstel | Wanneer toepassen |
|----------|-------------------|
| 5.3-V1: Eerder testen | Vanaf dag 1 van het volgende project |
| 5.3-V2: Betere tijdsplanning | Vanaf planningsfase, wekelijks evalueren |
| 5.3-V3: Code-structuur | Bij elke sprint |
| 5.3-V4: Documentatie bijhouden | Continu, 30 min per week |

---

## Overzicht

| Criterium | Aantal voorstellen | Status |
|-----------|-------------------|--------|
| 5.1 Testen | 4 | Alle verbeterd |
| 5.2 Oplevering | 4 | Alle verbeterd |
| 5.3 Reflectie | 4 | Structureel toegepast |
| **Totaal** | **12 verbetervoorstellen** | **Alle doorgevoerd** |
