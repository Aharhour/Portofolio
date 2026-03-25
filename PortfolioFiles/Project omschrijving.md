 🎬 Examen Portfolio Project  
### criterium 1.1

# Algemene informatie over het project 

**Naam opdrachtgever:** AlphaTicket Corp

**Project manager:** Adil Harhour 

**Teamlead developer:** Adil Harhour

**Naam Project:** BetaTicket

---

# 📌 Project Omschrijving — Full Stack Movie Ticket Booking App

## Wat bouw ik?

Voor mijn examenportfolio ontwikkel ik een **Full Stack Movie Ticket Booking App** een volledige webapplicatie met een werkende frontend én een gekoppeld headless backend/CMS.

De applicatie stelt gebruikers in staat om:

- 🎥 Films te bekijken met details zoals poster, beschrijving en genre
- 🕒 Beschikbare showtimes te selecteren per film
- 💺 Stoelen te kiezen in een interactief stoelenoverzicht
- 🎟 Tickets te boeken en een bevestiging te ontvangen
- 🔐 In te loggen en hun eigen boekingsgeschiedenis te beheren

Daarnaast bevat de applicatie een **werkend Admin Panel** waarmee de beheerder:

- ➕ Nieuwe films kan toevoegen en bestaande films kan bewerken
- 👥 Het totaal aantal geregistreerde gebruikers kan bekijken
- 🎟 Het totaal aantal verkochte tickets kan inzien
- 💰 De totale omzet (revenue) real-time kan monitoren

---

## 👤 User Stories

### Als bezoeker wil ik...
- het filmaanbod kunnen bekijken, zodat ik een film kan kiezen die ik wil zien.
- beschikbare showtimes kunnen zien per film, zodat ik een tijdstip kan kiezen dat uitkomt.
- een stoel kunnen selecteren, zodat ik weet waar ik zit.
- een ticket kunnen boeken en een bevestiging krijgen, zodat ik zeker weet dat mijn reservering is gelukt.

### Als ingelogde gebruiker wil ik...
- kunnen inloggen met mijn account, zodat mijn boekingen aan mij gekoppeld zijn.
- mijn eerdere boekingen kunnen terugzien, zodat ik altijd weet wat ik heb geboekt.

### Als admin wil ik...
- nieuwe films kunnen toevoegen aan het systeem, zodat het aanbod altijd up-to-date is.
- een overzicht hebben van gebruikers, tickets en omzet, zodat ik de prestaties van de applicatie kan monitoren.

---

## 🛠️ Gebruikte Technologieën & Waarom

### ⚛️ React.js
Ik gebruik React als frontend framework omdat het component-gebaseerd werkt. Dit maakt het eenvoudig om herbruikbare UI-componenten te bouwen, zoals filmkaarten, stoelenselectie en boekingsformulieren. React zorgt ook voor een snelle, dynamische gebruikerservaring zonder dat de hele pagina herladen hoeft te worden.

### 🔀 React Router
React Router gebruik ik voor de navigatie tussen pagina's (bijv. home → filmpagina → checkout). Hiermee bouw ik een **Single Page Application (SPA)** waarbij de URL verandert zonder een volledige pagina-reload, wat de app sneller en gebruiksvriendelijker maakt.

### ⚡ Vite
Vite gebruik ik als build tool en development server. Vergeleken met oudere tools zoals Create React App is Vite **aanzienlijk sneller** bij het opstarten en het vernieuwen van de pagina tijdens development. Dit verhoogt mijn productiviteit.

### 🔗 Axios / Fetch API
Voor communicatie met de backend (het ophalen van films, het versturen van boekingen) gebruik ik Axios of de ingebouwde Fetch API. Axios heeft als voordeel dat het automatisch JSON parseert en foutafhandeling eenvoudiger maakt.

### 🎨 TailwindCSS
Voor de styling gebruik ik TailwindCSS. TailwindCSS biedt utility-classes waarmee ik snel en consistent een moderne UI kan bouwen, zonder dat ik aparte CSS-bestanden hoef te schrijven voor elk component.

### 🔐 Clerk (Authenticatie)
In plaats van zelf een authenticatiesysteem te bouwen (wat complex en foutgevoelig is), gebruik ik **Clerk**. Clerk biedt kant-en-klare login/registratie-componenten en beheert sessies en gebruikersdata veilig. Dit bespaart tijd en zorgt voor een professionele, veilige gebruikerservaring.

### 🗄️ Headless CMS 
Als backend gebruik ik een headless CMS **Strapi**. Een headless CMS scheidt de data (films, boekingen, gebruikers) van de presentatielaag. Via een REST of GraphQL API kan mijn frontend de data ophalen. Dit maakt de architectuur flexibel: de frontend en backend zijn onafhankelijk van elkaar te ontwikkelen en te deployen.

### ⚙️ Inngest (Event Handling & Background Jobs)
Inngest gebruik ik voor het afhandelen van achtergrondtaken en events, zoals:
- Het bijwerken van de omzet na een boeking
- Het versturen van een bevestigingsmelding
- Het verwerken van stoelbeschikbaarheid na een reservering

Door deze taken asynchroon af te handelen, blijft de applicatie snel en responsief voor de gebruiker.

### 🚀 VNetlify (Deployment)
Voor de deployment van de frontend gebruik ik**Netlify**. Netlify is speciaal gebouwd voor moderne frontend frameworks zoals React en bied automatische deployments via Git, gratis SSL en een globaal CDN voor snelle laadtijden.

---

## 🗂️ Eisen vs. Wensen

| Type | Omschrijving |
|------|-------------|
| **Eis** | Gebruikers kunnen films bekijken en tickets boeken |
| **Eis** | Gebruikers kunnen inloggen en boekingen terugzien |
| **Eis** | Admin kan films toevoegen en statistieken inzien |
| **Eis** | De app communiceert met een backend via een API |
| **Wens** | Real-time stoelbeschikbaarheid (live updates) |
| **Wens** | E-mailbevestiging na een boeking |
| **Wens** | Mobiele optimalisatie / responsive design |
| **Wens** | Betalingsintegratie (bijv. Stripe) |