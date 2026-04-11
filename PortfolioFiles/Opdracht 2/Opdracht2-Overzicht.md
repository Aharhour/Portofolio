# Opdracht 2 — Technisch Ontwerp (UML)

## Overzicht

Dit onderdeel bevat het technische ontwerp van BetaTickets, uitgewerkt in UML-diagrammen. Elk diagram is gekozen om een specifiek aspect van het systeem te belichten en sluit aan bij de eisen en wensen uit Opdracht 1.

---

## Diagrammen

### 1. ERD (Entity Relationship Diagram)
**Bestand:** `erd-diagram.svg`

Toont de datastructuur van het systeem met 6 entiteiten en hun relaties:

| Entiteit | Beschrijving |
|----------|-------------|
| User | Geregistreerde gebruiker (via Clerk) |
| Movie | Film uit TMDB API |
| Genre | Filmgenre (N:N relatie met Movie) |
| Show | Voorstelling (datum/tijd/prijs) |
| Booking | Ticket-boeking door gebruiker |
| Payment | Betaling via Stripe |

**Relaties:**
- 1:1 — Booking ↔ Payment
- 1:N — User → Booking, Movie → Show, Show → Booking
- N:N — Movie ↔ Genre

---

### 2. Sequence Diagram — Customer Side
**Bestand:** `customer-sequence-diagram.svg`

Toont de volledige customer-flow met 7 objecten:
1. Customer → React App → Clerk Auth → Express API → MongoDB → Stripe → Inngest

**Secties:** Registratie, Browse Movies, Film Details, Stoelselectie, Booking & Payment, Webhook Processing, My Bookings, Favorites, Cron Reminders

**UML-elementen:** `alt` (betaling succesvol/geannuleerd), `loop` (check onbetaalde boekingen), `opt` (toggle favoriet)

---

### 3. Sequence Diagram — Admin Side
**Bestand:** `admin-sequence-diagram.svg`

Toont de admin-workflows met 7 objecten:
1. Admin → React App → Clerk Auth → Express API → MongoDB → TMDB API → Inngest

**Secties:** Admin Authenticatie, Dashboard, Add Shows, List Shows, List Bookings, Stripe Webhook, Cron Jobs

**UML-elementen:** `alt` (role check), `background` (webhook processing), `cron` (scheduled reminders)

---

### 4. Use Case Diagram
**Bestand:** `use-case-diagram.svg`

Toont de systeemfunctionaliteit per actor:

| Actor | Aantal Use Cases |
|-------|-----------------|
| Bezoeker | 3 (films bekijken, details, registreren) |
| Geregistreerde Gebruiker | 7 (inloggen, showtime, stoelen, boeken, betalen, boekingen, favorieten) |
| Admin | 5 (films toevoegen/bewerken, shows beheren, dashboard, boekingen inzien) |

**Totaal:** 3 actoren, 1 systeem, 15 use cases (>10 vereist)

---

### 5. Activity Diagram
**Bestand:** `activity-diagram.svg`

Modelleert het kernproces: **ticket boeken** — van filmselectie tot bevestiging.

**Kenmerken:**
- 4 swimlanes (Klant, React Frontend, Express API, Externe Services)
- Beslismomenten: ingelogd?, stoelen beschikbaar?, betaling succesvol?
- Integratie met Stripe en Inngest
- Foutafhandeling (bezette stoelen, geannuleerde betaling)

---

## Onderbouwing

**Bestand:** `Onderbouwing.md`

Beschrijft de keuzes achter het ontwerp, met aandacht voor:
- **Ethiek**: Eerlijke prijzen, toegankelijkheid, first-come-first-served
- **Privacy**: Scheiding van data (Clerk/Stripe/MongoDB), dataminimalisatie, GDPR
- **Security**: JWT-authenticatie, webhook verificatie, dubbele boekingspreventie, input validatie
- **Design Patterns**: MVC, Event-Driven Architecture

---

## Criteria Checklist

| Criterium | Vereiste | Status |
|-----------|---------|--------|
| 2.1 ERD | 6 entiteiten, 1×1:1, 2×1:N, 1×N:N | ✅ 6 entiteiten, 1×1:1, 3×1:N, 1×N:N |
| 2.1 Sequence | 6 objecten, 1× Loop of Alt | ✅ 7 objecten, loop + alt + opt |
| 2.1 Use Case | 3 actoren, 1 systeem, 10 goals | ✅ 3 actoren, 1 systeem, 15 goals |
| 2.2 Schematechnieken | Activity, ERD, Class diagram, design pattern | ✅ Alle aanwezig |
| 2.3 Onderbouwing | Ethiek, privacy, security | ✅ Alle drie uitgewerkt |
