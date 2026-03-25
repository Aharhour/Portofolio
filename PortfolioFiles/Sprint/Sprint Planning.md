# 📅 Sprint Planning
## Full Stack Movie Ticket Booking App

---

## 📌 Uitgangspunten

| Gegeven | Waarde |
|--------|--------|
| Totaal geschatte uren | 104 uur |
| Aantal sprints | 5 sprints |
| Sprint duur | 2 weken |
| Beschikbare uren per sprint | ~20 uur |
| Volgorde | Must Have → Should Have → Could Have |

> Elke sprint bevat bewust een mix van stories zodat het totaal
> per sprint dicht bij de **20 uur** ligt. Dit voorkomt grote
> verschillen in werkdruk tussen sprints.

---

## 🏃 Sprint 1 — Fundament & Authenticatie
**Periode:** Week 1 – Week 2
**Doel:** De basis van de applicatie staat: gebruikers kunnen de app openen, films zien en een account aanmaken.

| Story | Omschrijving | MoSCoW | Uren |
|-------|-------------|--------|------|
| US-01 | Films bekijken | 🔴 Must Have | 4 uur |
| US-04 | Account aanmaken | 🔴 Must Have | 4 uur |
| US-05 | Inloggen | 🔴 Must Have | 2 uur |
| US-06 | Uitloggen | 🔴 Must Have | 1 uur |
| US-21 | Protected routes | 🔴 Must Have | 4 uur |
| US-23 | Duidelijke navigatie | 🟠 Should Have | 4 uur |

**Sprint 1 totaal: 19 uur**

**Sprint 1 doel (Definition of Done):**
- [ ] Homepagina toont een filmoverzicht
- [ ] Gebruiker kan registreren, inloggen en uitloggen via Clerk
- [ ] Beveiligde routes redirecten niet-ingelogde gebruikers
- [ ] Navigatiebalk werkt op alle pagina's

---

## 🏃 Sprint 2 — Film Details & Booking Flow (deel 1)
**Periode:** Week 3 – Week 4
**Doel:** Gebruikers kunnen een film selecteren, details bekijken en een showtime kiezen.

| Story | Omschrijving | MoSCoW | Uren |
|-------|-------------|--------|------|
| US-02 | Film details bekijken | 🔴 Must Have | 6 uur |
| US-07 | Showtime selecteren | 🔴 Must Have | 6 uur |
| US-14 | Admin login & beveiligd dashboard | 🔴 Must Have | 4 uur |
| US-20 | Form validatie | 🟠 Should Have | 4 uur |

**Sprint 2 totaal: 20 uur**

**Sprint 2 doel (Definition of Done):**
- [ ] Filmpagina toont alle details en beschikbare showtimes
- [ ] Alleen toekomstige showtimes zijn selecteerbaar
- [ ] Admin kan inloggen op een beveiligd dashboard
- [ ] Formulieren geven duidelijke foutmeldingen bij foute invoer

---

## 🏃 Sprint 3 — Stoelenselectie & Boeking afronden
**Periode:** Week 5 – Week 6
**Doel:** De volledige boekingsflow is werkend: stoel kiezen, dubbele boekingen voorkomen en bevestiging tonen.

| Story | Omschrijving | MoSCoW | Uren |
|-------|-------------|--------|------|
| US-08 | Stoelen selecteren | 🔴 Must Have | 10 uur |
| US-09 | Dubbele boekingen voorkomen | 🔴 Must Have | 6 uur |
| US-10 | Boeking bevestigen | 🔴 Must Have | 4 uur |

**Sprint 3 totaal: 20 uur**

**Sprint 3 doel (Definition of Done):**
- [ ] Stoelenoverzicht toont vrije en bezette stoelen visueel
- [ ] Bezette stoelen zijn niet selecteerbaar
- [ ] Na boeking verschijnt een bevestigingspagina met alle boekingsdetails
- [ ] Dubbele boekingen zijn technisch onmogelijk

---

## 🏃 Sprint 4 — Events, Admin Panel & Boekingsoverzicht
**Periode:** Week 7 – Week 8
**Doel:** Inngest-events verwerken boekingen op de achtergrond en het admin dashboard toont live statistieken.

| Story | Omschrijving | MoSCoW | Uren |
|-------|-------------|--------|------|
| US-12 | Ticket verkoop registreren (Inngest) | 🔴 Must Have | 6 uur |
| US-15 | Film toevoegen (admin) | 🔴 Must Have | 6 uur |
| US-11 | Mijn boekingen bekijken | 🟠 Should Have | 6 uur |

**Sprint 4 totaal: 18 uur**

**Sprint 4 doel (Definition of Done):**
- [ ] Inngest-event wordt getriggerd bij elke boeking
- [ ] Admin kan nieuwe films toevoegen via een formulier
- [ ] Gebruiker kan eigen boekingen terugzien op een persoonlijke pagina

---

## 🏃 Sprint 5 — Afwerking, Dashboard & Optimalisatie
**Periode:** Week 9 – Week 10
**Doel:** Admin dashboard is compleet, revenue wordt automatisch bijgewerkt en de app is responsive en snel.

| Story | Omschrijving | MoSCoW | Uren |
|-------|-------------|--------|------|
| US-13 | Revenue automatisch updaten (Inngest) | 🟠 Should Have | 4 uur |
| US-16 | Film bewerken/verwijderen | 🟠 Should Have | 4 uur |
| US-17 | Totaal gebruikers bekijken | 🟠 Should Have | 2 uur |
| US-18 | Totaal tickets bekijken | 🟠 Should Have | 2 uur |
| US-19 | Totale omzet bekijken | 🟠 Should Have | 2 uur |
| US-03 | Responsive gebruiken | 🟠 Should Have | 8 uur |

**Sprint 5 totaal: 22 uur**

**Sprint 5 doel (Definition of Done):**
- [ ] Admin dashboard toont live: gebruikers, tickets en omzet
- [ ] Revenue wordt automatisch bijgewerkt via Inngest na elke boeking
- [ ] Admin kan films bewerken en verwijderen
- [ ] App is volledig responsive op mobiel en desktop

---

## ⏭️ Backlog (buiten scope)

| Story | Omschrijving | MoSCoW | Uren |
|-------|-------------|--------|------|
| US-22 | Snelle laadtijden / performance optimalisatie | 🟡 Could Have | 6 uur |

> US-22 wordt opgepakt als er tijd over is na Sprint 5,
> maar valt buiten de verplichte scope van dit project.

---

## 📊 Sprint Overzicht

| Sprint | Periode | Uren | Stories |
|--------|---------|------|---------|
| Sprint 1 | Week 1–2 | 19 uur | US-01, 04, 05, 06, 21, 23 |
| Sprint 2 | Week 3–4 | 20 uur | US-02, 07, 14, 20 |
| Sprint 3 | Week 5–6 | 20 uur | US-08, 09, 10 |
| Sprint 4 | Week 7–8 | 18 uur | US-12, 15, 11 |
| Sprint 5 | Week 9–10 | 22 uur | US-13, 16, 17, 18, 19, 03 |
| Backlog | — | 6 uur | US-22 |
| **Totaal** | **10 weken** | **105 uur** | **23 stories** |

---

## 🗂️ Scrumboard Status (begin project)

### 🔄 Sprint 2 — To Do
> Periode: Week 3 – Week 4 | Doel: Film details & booking flow deel 1


- [ ] US-07 – Showtime selecteren *(6 uur)*
- [ ] US-14 – Admin login & beveiligd dashboard *(4 uur)*
- [ ] US-20 – Form validatie *(4 uur)*

**Sprint 2 capaciteit: 20 uur**

---

### 🚧 In Progress
- [ ] US-02 – Film details bekijken *(6 uur)*

---

### ✅ Done — 

## Sprint 1 (Week 1–2)

- [x] US-01 – Films bekijken ✅
- [x] US-04 – Account aanmaken ✅
- [x] US-05 – Inloggen ✅
- [x] US-06 – Uitloggen ✅
- [x] US-21 – Protected routes ✅
- [x] US-23 – Duidelijke navigatie ✅

**Sprint 1 afgerond: 19/19 uur — 6/6 stories ✅**

## Sprint 2 (Week 3–4)

- [ ] US-02 – Film details bekijken *(6 uur)*
- [ ] US-07 – Showtime selecteren *(6 uur)*
- [ ] US-14 – Admin login & beveiligd dashboard *(4 uur)*
- [ ] US-20 – Form validatie *(4 uur)*

**Sprint 2 afgerond: 0/20 uur —0/4 stories ✅**
