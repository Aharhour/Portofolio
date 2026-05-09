# Opdracht 2 — Technisch Ontwerp (UML)

## Overzicht

Dit onderdeel bevat het technische ontwerp van BetaTickets, uitgewerkt in UML-diagrammen. Elk diagram is gekozen om een specifiek aspect van het systeem te belichten en sluit aan bij de eisen en wensen uit Opdracht 1.

---

## Diagrammen

---

### 1. Sequence Diagram — Customer Side
**Bestand:** `customer-sequence-diagram.svg`

Toont de volledige customer-flow met 7 objecten:
1. Customer → React App → Clerk Auth → Express API → MongoDB → Stripe → Inngest

**Secties:** Registratie, Browse Movies, Film Details, Stoelselectie, Booking & Payment, Webhook Processing, My Bookings, Favorites, Cron Reminders

**UML-elementen:** `alt` (betaling succesvol/geannuleerd), `loop` (check onbetaalde boekingen), `opt` (toggle favoriet)

---

### 2. Sequence Diagram — Admin Side
**Bestand:** `admin-sequence-diagram.svg`

Toont de admin-workflows met 7 objecten:
1. Admin → React App → Clerk Auth → Express API → MongoDB → TMDB API → Inngest

**Secties:** Admin Authenticatie, Dashboard, Add Shows, List Shows, List Bookings, Stripe Webhook, Cron Jobs

**UML-elementen:** `alt` (role check), `background` (webhook processing), `cron` (scheduled reminders)

---

### 3. Use Case Diagram
**Bestand:** `use-case-diagram.svg`

Toont de systeemfunctionaliteit per actor:

| Actor | Aantal Use Cases |
|-------|-----------------|
| Bezoeker | 3 (films bekijken, details, registreren) |
| Geregistreerde Gebruiker | 7 (inloggen, showtime, stoelen, boeken, betalen, boekingen, favorieten) |
| Admin | 5 (films toevoegen/bewerken, shows beheren, dashboard, boekingen inzien) |

**Totaal:** 3 actoren, 1 systeem, 15 use cases (>10 vereist)
