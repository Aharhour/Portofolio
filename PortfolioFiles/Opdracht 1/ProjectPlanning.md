### criterium 1.3

# 🗓️ Project Planning (6 Weken)

---

## 🔵 Week 1 ( 2-8 Maart ) – Concept & Design ✅

### 1️⃣ Projectidee ✅

Ik bouw een online bioscoopplatform waar gebruikers eenvoudig tickets kunnen reserveren via een moderne en gebruiksvriendelijke interface.

De applicatie werkt op zowel **mobiel als desktop** en bevat minimaal 5 verschillende pagina’s.

---

### 2️⃣ Headless Backend Kiezen ✅            

Ik gebruik een headless backend voor:

- Films
- Showtimes
- Seats
- Users
- Bookings
- Revenue data

De frontend communiceert via API-calls met deze backend.

---

### 3️⃣ Design in Figma maken/afmaken ✅

Ik ontwerp:

- 📱 Mobile design
- 💻 Desktop design

### Ontworpen Pagina’s: ✅

1. Home
2. Movies overzicht
3. Movie detail
4. Seat selection
5. Booking confirmation
6. Login / Register
7. User Profile
8. Admin Dashboard

Design richtlijnen:
- Consistente spacing
- Responsive grid
- Toegankelijke UI
- Component hergebruik
- Duidelijke call-to-actions

---

## 🟡 Week 2 ( 9-15 Maart ) – Setup & Basis Bouw

### 4️⃣ Frontend Setup ✅

- React project initialiseren
- Routing configureren
- Component structuur opzetten
- Layout systeem bouwen
- Protected routes instellen (Clerk)

### 🔐 Authenticatie (Clerk) ✅

- Registratie
- Login
- Session management
- Protected routes
- Rol-gebaseerde toegang (Admin / User)

### Basis Pagina’s Bouwen 🟠 (delayed)

- Home
- Movies
- Login
- Register
- Admin Layout

---

## 🟠 Week 3 ( 16-22 Maart ) – Functionaliteiten & Integraties
---

### 🎟 Ticket Booking Flow 🔴

- Film selecteren
- Showtime kiezen
- Stoelen selecteren
- Validatie (geen dubbele boekingen)
- Boeking opslaan
- Bevestiging tonen

---

### ⚙️ Inngest Integratie 🔴

Inngest wordt gebruikt voor:

- Automatische revenue updates
- Ticket sales event logging
- Background verwerking van boekingen
- Event-driven updates voor Admin dashboard

---

### 👨‍💼 Admin Panel Functionaliteiten 🔴

Het Admin Dashboard bevat:

- Overzicht totaal aantal gebruikers
- Overzicht totaal aantal verkochte tickets
- Totale omzet berekening
- Nieuwe films toevoegen
- Filmbeheer (bewerken/verwijderen)

Alle admin routes zijn beveiligd via rol-based authentication.

---

## 🔴 Week 4 ( 23-29 Maart ) – Optimalisatie & Afronding
 
### 📱 Responsive Optimalisatie 🔴

- Mobile-first verbeteringen
- Media queries
- Layout fine-tuning

---

### ✅ Code Validatie 🔴

- Form validatie
- Error handling
- Loading states
- Geen console errors
- Schone en gestructureerde code

---

### 🧪 Testen 🔴

- Cross-browser testing
- Mobile testing
- Functional testing
- Admin panel testen

---

### 📦 Build & Deployment 🔴

- Production build maken
- Environment variables configureren
- Applicatie deployen
- CMS live zetten

---

# 🧩 Functionele Eisen 🔴

✔ Ontworpen in Figma  
✔ Werkend login systeem (Clerk)  
✔ Minimaal 5 verschillende pagina’s  
✔ Responsive design  
✔ Werkend Admin Panel  
✔ Headless CMS integratie  
✔ Event-driven logica met Inngest  
✔ Valide en gestructureerde code  
✔ README.md documentatie  

## 🔴 Week 5 ( 6-12 April ) – 