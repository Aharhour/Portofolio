<div align="center">

# 🎬 QuickShow — Movie Ticket Booking Platform

### Een moderne full-stack webapplicatie voor het boeken van bioscoopkaartjes

*Ontwikkeld als examenportfolio voor Bit Academy — Jaar 3*

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 📖 Over het project

**QuickShow** is een volledig werkende **Movie Ticket Booking App** waarmee gebruikers films kunnen ontdekken, showtimes kunnen kiezen en stoelen kunnen reserveren — allemaal in een vloeiende en responsive interface.

Achter de schermen draait een beveiligd **admin dashboard** met realtime statistieken (gebruikers, tickets, omzet) en een **event-driven backend** op basis van Inngest voor het verwerken van boekingen en achtergrondtaken.

Dit project demonstreert vaardigheden in:

- 🧩 **Frontend development** — component-gebaseerde architectuur met React
- 🔐 **Authenticatie & autorisatie** — rol-gebaseerde toegang met Clerk
- 🗄️ **Backend & database** — REST API met Node.js en MongoDB
- ⚡ **Event-driven workflows** — asynchrone verwerking via Inngest
- 🎨 **UI/UX design** — responsive, toegankelijk en modern

---

## ✨ Features

### 👤 Voor gebruikers

| Feature | Beschrijving |
|---|---|
| 🔐 **Authenticatie** | Veilige registratie en login via Clerk |
| 🎥 **Filmoverzicht** | Bekijk alle actuele films in een moderne grid |
| 📄 **Detailpagina's** | Trailer, synopsis, cast en beoordelingen per film |
| 🕒 **Showtime selectie** | Kies datum en tijdstip van jouw voorstelling |
| 💺 **Stoelreservering** | Interactief seatplan met validatie tegen dubbele boekingen |
| 🎟️ **Ticketbevestiging** | Direct een digitaal ticket na betaling |
| 📋 **Mijn boekingen** | Overzicht van al jouw reserveringen |
| 📱 **Responsive design** | Werkt vlekkeloos op mobiel, tablet en desktop |

### 👨‍💼 Voor admins

- ➕ Films toevoegen, bewerken en verwijderen
- 👥 Realtime overzicht van geregistreerde gebruikers
- 🎟️ Totaal aantal verkochte tickets
- 💰 Live omzetstatistieken
- 🔒 Rol-gebaseerde beveiliging (alleen admins krijgen toegang)

### ⚙️ Event-driven architectuur

Inngest handelt achter de schermen de volgende processen af:

- Automatische verwerking van ticketboekingen
- Realtime updates van revenue en statistieken
- Background jobs voor synchronisatie
- Ontkoppeling van zware taken van de request-cyclus

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- TailwindCSS
- Axios

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- Inngest (event handling)

**Auth & Services**
- Clerk (authenticatie & user management)

**Deployment**
- Vercel (frontend)
- Render / Railway (backend)

---

## 📂 Projectstructuur

```
Portofolio/
├── client/              # React frontend (Vite)
│   ├── src/
│   └── package.json
├── server/              # Node.js backend API
│   ├── routes/
│   ├── models/
│   └── package.json
├── PortfolioFiles/      # Portfolio documentatie
└── README.md
```

---

## 🚀 Installatie & Setup

### 1. Repository clonen

```bash
git clone <repository-url>
cd Portofolio
```

### 2. Frontend installeren

```bash
cd client
npm install
```

### 3. Backend installeren

```bash
cd ../server
npm install
```

### 4. Environment variabelen

Maak een `.env` bestand aan in zowel `client/` als `server/`:

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
```

**`server/.env`**
```env
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
INNGEST_EVENT_KEY=your_inngest_key
```

> ⚠️ **Belangrijk:** Commit nooit je `.env` bestanden naar Git.

### 5. Development servers starten

**Frontend:**
```bash
cd client
npm run dev
```
Beschikbaar op `http://localhost:5173`

**Backend:**
```bash
cd server
npm run dev
```
Beschikbaar op `http://localhost:3000`

---

## 🏗️ Production Build

```bash
cd client
npm run build
npm run preview
```

---

## 📸 Screenshots

> *Screenshots worden binnenkort toegevoegd.*

---

## 👨‍💻 Auteur

<div align="center">

**Adil Harhour**
Software Developer — Bit Academy (Jaar 3)
Examen Portfolio Project · 2026

</div>

---

## 📄 Licentie

Dit project is ontwikkeld voor **educatieve doeleinden** als onderdeel van mijn examenportfolio bij Bit Academy. Gebruik voor commerciële doeleinden is niet toegestaan zonder toestemming.
