# Sprint Planning - BetaTickets

## Projectgegevens

- **Startdatum:** 23 maart 2026
- **Sprintduur:** 2 weken
- **Beschikbare uren per sprint:** ~35 uur (gemiddeld 3,5 uur per werkdag)
- **Totaal geschatte uren:** ~104 uur
- **Aantal sprints:** 3

---

## Sprint 1: Basis en Authenticatie

**Periode:** 23 maart - 5 april 2026
**Sprint doel:** De basis van de applicatie opzetten inclusief authenticatie, filmpagina's en admin-toegang.

| # | User Story | MoSCoW | Schatting |
|---|-----------|--------|-----------|
| US-04 | Account aanmaken | Must Have | 4 uur |
| US-05 | Inloggen | Must Have | 2 uur |
| US-06 | Uitloggen | Must Have | 1 uur |
| US-21 | Protected routes | Must Have | 4 uur |
| US-14 | Admin login | Must Have | 4 uur |
| US-01 | Films bekijken | Must Have | 4 uur |
| US-02 | Film details bekijken | Must Have | 6 uur |
| US-15 | Film toevoegen | Must Have | 6 uur |
| US-23 | Duidelijke navigatie | Should Have | 4 uur |

**Totaal Sprint 1:** 35 uur

**Toelichting:** In de eerste sprint wordt de fundering gelegd. Authenticatie en autorisatie zijn de eerste prioriteit omdat bijna alle andere functionaliteiten hiervan afhankelijk zijn. Daarna worden de filmpagina's gebouwd zodat er content is om mee te werken. Navigatie wordt meegenomen omdat dit essentieel is voor de gebruikservaring vanaf dag 1.

---

## Sprint 2: Boekingssysteem

**Periode:** 6 april - 19 april 2026
**Sprint doel:** Het volledige ticket-boekingsproces implementeren inclusief stoelselectie en event-driven verwerking.

| # | User Story | MoSCoW | Schatting |
|---|-----------|--------|-----------|
| US-07 | Showtime selecteren | Must Have | 6 uur |
| US-08 | Stoelen selecteren | Must Have | 10 uur |
| US-09 | Dubbele boekingen voorkomen | Must Have | 6 uur |
| US-10 | Boeking bevestigen | Must Have | 4 uur |
| US-12 | Ticket verkoop registreren (Inngest) | Must Have | 6 uur |
| US-20 | Form validatie | Should Have | 4 uur |

**Totaal Sprint 2:** 36 uur

**Toelichting:** Deze sprint focust volledig op het boekingsproces - de core functionaliteit van de applicatie. US-08 (stoelselectie) is de grootste story en heeft de hoogste complexiteit vanwege de visuele weergave en realtime updates. US-09 en US-12 zijn technisch gekoppeld via Inngest. Formuliervalidatie wordt meegenomen om de kwaliteit van het boekingsproces te waarborgen.

---

## Sprint 3: Admin Dashboard, Should Haves en Afronding

**Periode:** 20 april - 3 mei 2026
**Sprint doel:** Admin-statistieken afronden, boekingsoverzicht toevoegen, responsive maken en optimaliseren.

| # | User Story | MoSCoW | Schatting |
|---|-----------|--------|-----------|
| US-11 | Mijn boekingen bekijken | Should Have | 6 uur |
| US-13 | Revenue automatisch updaten | Should Have | 4 uur |
| US-16 | Film bewerken/verwijderen | Should Have | 4 uur |
| US-17 | Totaal gebruikers bekijken | Should Have | 2 uur |
| US-18 | Totaal tickets bekijken | Should Have | 2 uur |
| US-19 | Totale omzet bekijken | Should Have | 2 uur |
| US-03 | Responsive gebruiken | Should Have | 8 uur |
| US-22 | Snelle laadtijden | Could Have | 6 uur |

**Totaal Sprint 3:** 34 uur (28 uur zonder US-22)

**Toelichting:** Alle Must Haves zijn afgerond in sprint 1 en 2. Deze sprint richt zich op de Should Haves die de applicatie compleet maken: het admin dashboard met statistieken, boekingsoverzicht voor gebruikers en responsive design. US-22 (snelle laadtijden) is een Could Have en wordt alleen opgepakt als er voldoende tijd over is.

---

## Visueel overzicht

```
Sprint 1 (23 mrt - 5 apr)    Sprint 2 (6 apr - 19 apr)    Sprint 3 (20 apr - 3 mei)
========================    =========================    ==========================
[Must Have] Auth setup       [Must Have] Booking flow      [Should Have] Admin stats
  - Account aanmaken           - Showtime selecteren         - Revenue updaten
  - Inloggen/Uitloggen         - Stoelen selecteren          - Gebruikers tellen
  - Protected routes           - Dubbele boekingen           - Tickets tellen
  - Admin login                - Boeking bevestigen          - Omzet bekijken

[Must Have] Film pagina's    [Must Have] Event handling    [Should Have] Gebruiker
  - Films bekijken             - Inngest integratie          - Mijn boekingen
  - Film details                                             - Film bewerken
  - Film toevoegen           [Should Have] Kwaliteit        
                               - Form validatie             [Should Have] UI/UX
[Should Have] Navigatie                                      - Responsive design
  - Duidelijke navigatie                                   
                                                           [Could Have] Performance
                                                             - Snelle laadtijden
```

---

## Onderbouwing prioritering

De planning is opgebouwd volgens het MoSCoW-principe:

1. **Must Haves eerst:** Sprint 1 en 2 bevatten alle 13 Must Have stories (63 uur). Dit garandeert dat de kernfunctionaliteit af is, zelfs als sprint 3 uitloopt.
2. **Afhankelijkheden:** Authenticatie (sprint 1) moet eerst werken voordat het boekingssysteem (sprint 2) gebouwd kan worden. Admin-statistieken (sprint 3) hebben het boekingssysteem nodig.
3. **Risicospreiding:** De meest complexe story (US-08, stoelselectie, 10 uur) zit in sprint 2 samen met gerelateerde stories, zodat er focus is op dit onderdeel.
4. **Buffer:** US-22 (Could Have) dient als buffer - wordt alleen opgepakt als er tijd over is.
