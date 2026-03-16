# 🎬 Full Stack Movie Ticket Booking App

Een volledig werkende **Full Stack Movie Ticket Booking App** gebouwd met **React.js**.  
Gebruikers kunnen films bekijken, stoelen reserveren en tickets boeken.  
Daarnaast bevat de applicatie een beveiligd **Admin Dashboard** met realtime statistieken zoals totaal aantal gebruikers, verkochte tickets en totale omzet.

Dit project is ontwikkeld als **examen portfolio project** en demonstreert mijn vaardigheden in frontend development, authenticatie, headless CMS integratie en event-driven architectuur.

---

# 🚀 Live Functionaliteiten

## 👤 Gebruikersfunctionaliteiten

- 🔐 Registratie en login via Clerk
- 🎥 Overzicht van beschikbare films
- 📄 Detailpagina per film
- 🕒 Showtime selectie
- 💺 Stoelreservering met validatie (geen dubbele boekingen)
- 🎟 Ticket bevestiging
- 📋 Overzicht van mijn boekingen
- 📱 Volledig responsive design (mobiel & desktop)

---

## 👨‍💼 Admin Dashboard

Het Admin Panel bevat:

- ➕ Nieuwe films toevoegen
- ✏️ Films bewerken
- ❌ Films verwijderen
- 👥 Totaal aantal geregistreerde gebruikers bekijken
- 🎟 Totaal aantal verkochte tickets bekijken
- 💰 Totale omzet (revenue) bekijken
- 🔐 Rol-gebaseerde beveiliging (alleen admins hebben toegang)

---

## ⚙️ Event Driven Architectuur (Inngest)

Inngest wordt gebruikt voor:

- Automatische ticket booking events
- Realtime revenue updates
- Verwerking van background taken
- Synchronisatie van statistieken in het admin dashboard

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Axios / Fetch API
- TailwindCSS of CSS Modules
- Vite

## Authenticatie

- Clerk

## Backend / Headless CMS

- Strapi of custom backend API

## Event Handling

- Inngest

## Deployment

- Vercel / Netlify (Frontend)
- Backend hosting naar keuze

---

# 📦 Installatie & Setup

## 1️⃣ Repository Clonen

```bash
git clone (HIER DE CLONE TEKST)
cd client
```

## 2️⃣ Dependencies Installeren

```bash
npm install
```

---

# 🔑 Environment Variabelen

Maak een `.env` bestand aan in de root van het project en voeg de volgende variabelen toe:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bWlnaHR5LXBlYWNvY2stMzEuY2xlcmsuYWNjb3VudHMuZGV2JA
```

⚠️ Zorg ervoor dat deze gegevens niet publiek worden gedeeld.

---

# ▶️ Development Server Starten

```bash
npm run dev
```

De applicatie draait standaard op:

```
http://localhost:5173
```

---

# 🏗️ Production Build

Build maken voor productie:

```bash
npm run build
```

Preview van production build:

```bash
npm run preview
```

---

# 👨‍💻 Auteur

Naam: Adil Harhour 
Opleiding: Software Developer
Examen Portfolio Project  
Jaar: 2026  

---

# 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden als examenportfolio.
