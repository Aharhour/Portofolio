# User Stories - BetaTickets

## Full Stack Movie Ticket Booking App

---

## MoSCoW Prioritering

| Label | Betekenis |
|-------|-----------|
| Must Have | Zonder dit werkt de app niet |
| Should Have | Belangrijk, maar niet blokkerend |
| Could Have | Nice-to-have als er tijd over is |
| Won't Have | Buiten scope van dit project |

---

## Bezoeker

### US-01 - Films bekijken
> **Must Have** | Schatting: **4 uur**

Als **bezoeker** wil ik een overzicht van beschikbare films zien,
zodat ik kan kiezen welke film ik wil bekijken.

**Acceptatiecriteria:**
- [ ] Filmoverzicht is zichtbaar zonder in te loggen
- [ ] Elke film toont minimaal: titel, poster en genre
- [ ] Pagina laadt binnen 2 seconden

---

### US-02 - Film details bekijken
> **Must Have** | Schatting: **6 uur**

Als **bezoeker** wil ik op een film kunnen klikken,
zodat ik meer informatie zie zoals beschrijving, duur, genre en showtimes.

**Acceptatiecriteria:**
- [ ] Detailpagina toont: beschrijving, duur, genre en beschikbare showtimes
- [ ] Terug-navigatie naar het filmoverzicht werkt correct

---

### US-03 - Responsive gebruiken
> **Should Have** | Schatting: **8 uur**

Als **gebruiker** wil ik de website zowel op mobiel als desktop kunnen gebruiken,
zodat ik overal tickets kan boeken.

**Acceptatiecriteria:**
- [ ] Layout past zich aan op schermbreedtes van 375px tot 1440px
- [ ] Knoppen en invoervelden zijn op mobiel makkelijk bedienbaar

---

## Geregistreerde Gebruiker

### US-04 - Account aanmaken
> **Must Have** | Schatting: **4 uur**

Als **gebruiker** wil ik een account kunnen registreren via Clerk,
zodat ik tickets kan boeken en mijn reserveringen kan beheren.

**Acceptatiecriteria:**
- [ ] Registratie verloopt via Clerk (e-mail + wachtwoord)
- [ ] Na registratie wordt de gebruiker doorgestuurd naar de homepagina
- [ ] Foutmelding verschijnt bij ongeldig e-mailadres of te kort wachtwoord

---

### US-05 - Inloggen
> **Must Have** | Schatting: **2 uur**

Als **gebruiker** wil ik kunnen inloggen,
zodat ik toegang krijg tot mijn persoonlijke boekingen.

**Acceptatiecriteria:**
- [ ] Inloggen werkt via Clerk met e-mail en wachtwoord
- [ ] Na inloggen wordt de gebruiker doorgestuurd naar de homepagina
- [ ] Foutmelding verschijnt bij verkeerde inloggegevens

---

### US-06 - Uitloggen
> **Must Have** | Schatting: **1 uur**

Als **gebruiker** wil ik veilig kunnen uitloggen,
zodat mijn account beschermd blijft.

**Acceptatiecriteria:**
- [ ] Uitlogknop is altijd zichtbaar voor ingelogde gebruikers
- [ ] Na uitloggen heeft de gebruiker geen toegang meer tot beveiligde pagina's

---

## Ticket Booking

### US-07 - Showtime selecteren
> **Must Have** | Schatting: **6 uur**

Als **ingelogde gebruiker** wil ik een beschikbare datum en tijd kunnen selecteren,
zodat ik een geschikte voorstelling kan kiezen.

**Acceptatiecriteria:**
- [ ] Alleen toekomstige showtimes zijn selecteerbaar
- [ ] Geselecteerde showtime wordt visueel bevestigd
- [ ] Niet-beschikbare tijden zijn uitgegrayd en niet klikbaar

---

### US-08 - Stoelen selecteren
> **Must Have** | Schatting: **10 uur**

Als **ingelogde gebruiker** wil ik beschikbare stoelen kunnen kiezen,
zodat ik zelf bepaal waar ik zit.

**Acceptatiecriteria:**
- [ ] Stoelenoverzicht toont visueel vrije en bezette stoelen
- [ ] Gebruiker kan een of meerdere stoelen selecteren
- [ ] Selectie wordt visueel bevestigd voor betaling

---

### US-09 - Dubbele boekingen voorkomen
> **Must Have** | Schatting: **6 uur**

Als **gebruiker** wil ik geen stoel kunnen reserveren die al bezet is,
zodat er geen dubbele boekingen ontstaan.

**Acceptatiecriteria:**
- [ ] Bezette stoelen zijn niet selecteerbaar
- [ ] Bij gelijktijdige boeking krijgt de eerste gebruiker bevestiging, de tweede een foutmelding
- [ ] Stoelstatus wordt direct bijgewerkt na een boeking via Inngest

---

### US-10 - Boeking bevestigen
> **Must Have** | Schatting: **4 uur**

Als **gebruiker** wil ik een duidelijke bevestiging krijgen na mijn boeking,
zodat ik weet dat mijn ticket succesvol is gereserveerd.

**Acceptatiecriteria:**
- [ ] Na boeking verschijnt een bevestigingspagina met film, datum, tijd en stoelnummer(s)
- [ ] Boeking is zichtbaar in de persoonlijke boekingsgeschiedenis

---

### US-11 - Mijn boekingen bekijken
> **Should Have** | Schatting: **6 uur**

Als **gebruiker** wil ik mijn eerdere en aankomende boekingen kunnen zien,
zodat ik overzicht heb van mijn tickets.

**Acceptatiecriteria:**
- [ ] Boekingspagina is alleen toegankelijk voor ingelogde gebruikers
- [ ] Elke boeking toont: filmnaam, datum, tijd en geselecteerde stoelen

---

## Event Handling (Inngest)

### US-12 - Ticket verkoop registreren
> **Must Have** | Schatting: **6 uur**

Als **systeem** wil ik bij elke ticketboeking automatisch een event triggeren via Inngest,
zodat de verkoop correct wordt verwerkt op de achtergrond zonder de gebruiker te vertragen.

**Acceptatiecriteria:**
- [ ] Inngest-event wordt getriggerd direct na een succesvolle boeking
- [ ] Event verwerking mislukt niet als de gebruiker de pagina verlaat
- [ ] Fouten worden gelogd en opnieuw geprobeerd (retry-mechanisme)

---

### US-13 - Revenue automatisch updaten
> **Should Have** | Schatting: **4 uur**

Als **systeem** wil ik bij elke succesvolle boeking de totale omzet automatisch laten bijwerken,
zodat het admin dashboard realtime statistieken toont zonder handmatige acties.

**Acceptatiecriteria:**
- [ ] Revenue wordt bijgewerkt binnen 5 seconden na een boeking
- [ ] Admin dashboard toont de bijgewerkte omzet zonder pagina te herladen

---

## Admin Panel

### US-14 - Admin login
> **Must Have** | Schatting: **4 uur**

Als **admin** wil ik via Clerk toegang krijgen tot een beveiligd admin dashboard,
zodat alleen bevoegde gebruikers beheerrechten hebben.

**Acceptatiecriteria:**
- [ ] Admin-pagina's zijn beveiligd via een Clerk-rol (bijv. `role: admin`)
- [ ] Niet-admins die de URL direct bezoeken worden doorgestuurd naar de homepagina

---

### US-15 - Film toevoegen
> **Must Have** | Schatting: **6 uur**

Als **admin** wil ik nieuwe films kunnen toevoegen,
zodat gebruikers nieuwe content kunnen boeken.

**Acceptatiecriteria:**
- [ ] Formulier bevat velden voor: titel, beschrijving, genre, duur, poster en showtimes
- [ ] Film is direct zichtbaar in het filmoverzicht na opslaan
- [ ] Foutmelding verschijnt als verplichte velden ontbreken

---

### US-16 - Film bewerken/verwijderen
> **Should Have** | Schatting: **4 uur**

Als **admin** wil ik bestaande films kunnen aanpassen of verwijderen,
zodat de informatie actueel blijft.

**Acceptatiecriteria:**
- [ ] Bewerkingen worden direct opgeslagen in het CMS
- [ ] Bij verwijderen verschijnt een bevestigingsdialoog
- [ ] Verwijderde films zijn niet meer zichtbaar voor gebruikers

---

### US-17 - Totaal aantal gebruikers bekijken
> **Should Have** | Schatting: **2 uur**

Als **admin** wil ik het totaal aantal geregistreerde gebruikers kunnen zien,
zodat ik inzicht heb in de platformgroei.

**Acceptatiecriteria:**
- [ ] Dashboard toont het actuele aantal gebruikers via de Clerk API
- [ ] Getal wordt automatisch bijgewerkt bij nieuwe registraties

---

### US-18 - Totaal verkochte tickets bekijken
> **Should Have** | Schatting: **2 uur**

Als **admin** wil ik het totaal aantal verkochte tickets kunnen zien,
zodat ik de prestaties van het platform kan monitoren.

**Acceptatiecriteria:**
- [ ] Dashboard toont het totale aantal boekingen uit de database
- [ ] Aantal wordt bijgewerkt via het Inngest-event systeem

---

### US-19 - Totale omzet bekijken
> **Should Have** | Schatting: **2 uur**

Als **admin** wil ik de totale revenue kunnen zien,
zodat ik inzicht heb in de financiele prestaties.

**Acceptatiecriteria:**
- [ ] Omzet wordt berekend op basis van alle succesvolle boekingen
- [ ] Weergave toont bedrag in euro's met twee decimalen

---

## Validatie en Kwaliteit

### US-20 - Form validatie
> **Should Have** | Schatting: **4 uur**

Als **gebruiker** wil ik duidelijke foutmeldingen krijgen bij incorrect ingevulde formulieren,
zodat ik weet wat ik moet corrigeren.

**Acceptatiecriteria:**
- [ ] Foutmeldingen verschijnen inline naast het betreffende veld
- [ ] Formulier kan niet worden verzonden zolang er fouten zijn

---

### US-21 - Protected routes
> **Must Have** | Schatting: **4 uur**

Als **systeem** wil ik bepaalde pagina's beveiligen,
zodat alleen ingelogde gebruikers of admins toegang krijgen.

**Acceptatiecriteria:**
- [ ] Niet-ingelogde gebruikers worden doorgestuurd naar de loginpagina
- [ ] Admin-routes zijn extra beveiligd via rollencheck in Clerk

---

## Gebruiksvriendelijkheid

### US-22 - Snelle laadtijden
> **Could Have** | Schatting: **6 uur**

Als **gebruiker** wil ik dat de applicatie snel laadt,
zodat mijn ervaring soepel verloopt.

**Acceptatiecriteria:**
- [ ] Pagina's laden binnen 2 seconden op een gemiddelde verbinding
- [ ] Afbeeldingen zijn geoptimaliseerd (WebP formaat, lazy loading)

---

### US-23 - Duidelijke navigatie
> **Should Have** | Schatting: **4 uur**

Als **gebruiker** wil ik een overzichtelijke navigatie,
zodat ik gemakkelijk door de website kan bewegen.

**Acceptatiecriteria:**
- [ ] Navigatiebalk is zichtbaar op alle pagina's
- [ ] Actieve pagina is visueel gemarkeerd in de navigatie
- [ ] Op mobiel is er een hamburger-menu beschikbaar

---

## Totaaloverzicht

| # | User Story | MoSCoW | Schatting |
|---|-----------|--------|-----------|
| US-01 | Films bekijken | Must Have | 4 uur |
| US-02 | Film details bekijken | Must Have | 6 uur |
| US-03 | Responsive gebruiken | Should Have | 8 uur |
| US-04 | Account aanmaken | Must Have | 4 uur |
| US-05 | Inloggen | Must Have | 2 uur |
| US-06 | Uitloggen | Must Have | 1 uur |
| US-07 | Showtime selecteren | Must Have | 6 uur |
| US-08 | Stoelen selecteren | Must Have | 10 uur |
| US-09 | Dubbele boekingen voorkomen | Must Have | 6 uur |
| US-10 | Boeking bevestigen | Must Have | 4 uur |
| US-11 | Mijn boekingen bekijken | Should Have | 6 uur |
| US-12 | Ticket verkoop registreren | Must Have | 6 uur |
| US-13 | Revenue automatisch updaten | Should Have | 4 uur |
| US-14 | Admin login | Must Have | 4 uur |
| US-15 | Film toevoegen | Must Have | 6 uur |
| US-16 | Film bewerken/verwijderen | Should Have | 4 uur |
| US-17 | Totaal gebruikers bekijken | Should Have | 2 uur |
| US-18 | Totaal tickets bekijken | Should Have | 2 uur |
| US-19 | Totale omzet bekijken | Should Have | 2 uur |
| US-20 | Form validatie | Should Have | 4 uur |
| US-21 | Protected routes | Must Have | 4 uur |
| US-22 | Snelle laadtijden | Could Have | 6 uur |
| US-23 | Duidelijke navigatie | Should Have | 4 uur |

**Totaal: 23 user stories**
**Geschatte tijd: ~104 uur**
