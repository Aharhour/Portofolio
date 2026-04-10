# Testscenario's BetaTickets

**Project:** BetaTicket - Movie Ticket Booking App  
**Auteur:** Adil Harhour  
**Datum:** 09-04-2026  
**Versie:** 1.0

---

## Inhoudsopgave

1. [TS-01 - Film bekijken en details openen](#ts-01---film-bekijken-en-details-openen)
2. [TS-02 - Stoelen selecteren en ticket boeken](#ts-02---stoelen-selecteren-en-ticket-boeken)
3. [TS-03 - Betaalproces via Stripe](#ts-03---betaalproces-via-stripe)
4. [TS-04 - Admin: Film toevoegen](#ts-04---admin-film-toevoegen)
5. [TS-05 - Authenticatie en autorisatie](#ts-05---authenticatie-en-autorisatie)
6. [TS-06 - Mijn boekingen bekijken](#ts-06---mijn-boekingen-bekijken)
7. [TS-07 - Admin Dashboard KPI's](#ts-07---admin-dashboard-kpis)

---

## TS-01 - Film bekijken en details openen

**Gerelateerde User Stories:** US-01, US-02  
**Voorwaarden:** De applicatie draait en er zijn films beschikbaar in de database.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Film in database | "Thunderbolts*" (ID: 1159311) |
| Genre | Action, Science Fiction |
| Aantal showtimes | 3 (10:00, 14:00, 20:00 op 15-04-2026) |
| Film zonder showtimes | "Test Film Zonder Shows" |
| Niet-bestaand film ID | 9999999 |

### Hoofdscenario: Gebruiker bekijkt filmoverzicht en opent details

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar `/movies` | Filmoverzicht wordt geladen met alle beschikbare films |
| 2 | Controleer filmkaarten | Elke film toont: titel, poster en genre |
| 3 | Klik op de film "Thunderbolts*" | Detailpagina opent op `/movies/1159311` |
| 4 | Controleer filmdetails | Pagina toont: beschrijving, duur, genre, cast en beschikbare showtimes |
| 5 | Controleer showtimes | 3 showtimes zijn zichtbaar voor 15-04-2026 |

**Verwacht eindresultaat:** Gebruiker ziet volledige filminformatie inclusief beschikbare showtimes.

### Alternatief scenario 1: Film zonder beschikbare showtimes

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar `/movies` | Filmoverzicht wordt geladen |
| 2 | Klik op "Test Film Zonder Shows" | Detailpagina opent |
| 3 | Controleer showtimes sectie | Melding "Geen beschikbare showtimes" wordt getoond |
| 4 | Controleer dat er geen datum/tijd selectie mogelijk is | Geen klikbare showtime-knoppen aanwezig |

**Verwacht eindresultaat:** Gebruiker krijgt duidelijke feedback dat er geen showtimes beschikbaar zijn.

### Alternatief scenario 2: Niet-bestaande film openen via URL

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer direct naar `/movies/9999999` | Pagina laadt |
| 2 | Controleer weergave | Foutmelding of "Film niet gevonden" wordt getoond |
| 3 | Controleer navigatie | Gebruiker kan terug navigeren naar het filmoverzicht |

**Verwacht eindresultaat:** Applicatie handelt niet-bestaande films graceful af zonder crash.

---

## TS-02 - Stoelen selecteren en ticket boeken

**Gerelateerde User Stories:** US-07, US-08, US-09, US-10  
**Voorwaarden:** Gebruiker is ingelogd via Clerk. Er is een show beschikbaar met vrije stoelen.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Ingelogde gebruiker | testuser@example.com |
| Film | "Thunderbolts*" |
| Showtime | 15-04-2026 om 20:00 |
| Showprijs per stoel | 12.50 EUR |
| Te selecteren stoelen | A1, A2 |
| Reeds bezette stoel | B5 |
| Totaalprijs | 25.00 EUR |

### Hoofdscenario: Gebruiker selecteert stoelen en boekt succesvol

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar filmdetails van "Thunderbolts*" | Detailpagina wordt geladen |
| 2 | Selecteer datum 15-04-2026 | Beschikbare showtimes voor die datum verschijnen |
| 3 | Klik op showtime 20:00 | Seat layout pagina opent (`/movies/1159311/2026-04-15`) |
| 4 | Bekijk stoelenoverzicht | Vrije stoelen zijn groen, bezette stoelen (B5) zijn rood/grijs en niet klikbaar |
| 5 | Klik op stoel A1 | Stoel A1 wordt blauw gemarkeerd als geselecteerd |
| 6 | Klik op stoel A2 | Stoel A2 wordt blauw gemarkeerd, totaalprijs toont 25.00 EUR |
| 7 | Klik op "Boek nu" / "Betaal" | Stripe checkout sessie wordt aangemaakt, redirect naar Stripe |
| 8 | Vul testbetaling in op Stripe | Betaling wordt verwerkt |
| 9 | Controleer bevestiging | Boeking verschijnt op de bevestigingspagina met film, datum, tijd en stoelnummers A1, A2 |

**Verwacht eindresultaat:** Boeking is succesvol aangemaakt, stoelen zijn bezet gemarkeerd, betaling is verwerkt.

### Alternatief scenario 1: Gebruiker probeert bezette stoel te selecteren

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar seat layout voor de show van 20:00 | Stoelenoverzicht wordt geladen |
| 2 | Probeer te klikken op bezette stoel B5 | Stoel is niet klikbaar (disabled/grijs) |
| 3 | Controleer dat B5 niet in de selectie staat | Totaalprijs blijft 0.00 EUR, geen stoelen geselecteerd |

**Verwacht eindresultaat:** Bezette stoelen zijn visueel onderscheidbaar en niet selecteerbaar.

### Alternatief scenario 2: Twee gebruikers boeken tegelijkertijd dezelfde stoel (race condition)

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Gebruiker A opent seat layout en selecteert stoel C3 | Stoel C3 is geselecteerd voor Gebruiker A |
| 2 | Gebruiker B opent dezelfde seat layout en selecteert stoel C3 | Stoel C3 is (nog) zichtbaar als vrij voor Gebruiker B |
| 3 | Gebruiker A klikt op "Boek nu" en betaalt | Boeking wordt aangemaakt, stoel C3 wordt bezet in database |
| 4 | Gebruiker B klikt op "Boek nu" | Server controleert beschikbaarheid: stoel C3 is al bezet |
| 5 | Controleer response voor Gebruiker B | Foutmelding: "Stoel C3 is niet meer beschikbaar" |

**Verwacht eindresultaat:** Het systeem voorkomt dubbele boekingen; de tweede gebruiker krijgt een duidelijke foutmelding.

---

## TS-03 - Betaalproces via Stripe

**Gerelateerde User Stories:** US-10, US-12  
**Voorwaarden:** Gebruiker is ingelogd, heeft stoelen geselecteerd, Stripe is geconfigureerd.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Ingelogde gebruiker | testuser@example.com |
| Geselecteerde stoelen | D1, D2, D3 |
| Prijs per stoel | 12.50 EUR |
| Totaalprijs | 37.50 EUR |
| Stripe test card (succes) | 4242 4242 4242 4242 |
| Stripe test card (geweigerd) | 4000 0000 0000 0002 |
| Stripe sessie timeout | 30 minuten |

### Hoofdscenario: Succesvolle betaling via Stripe

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Selecteer stoelen D1, D2, D3 en klik op "Boek nu" | Stripe checkout sessie wordt aangemaakt |
| 2 | Controleer redirect | Gebruiker wordt doorgestuurd naar Stripe checkout pagina |
| 3 | Controleer bedrag op Stripe | Totaalbedrag toont 37.50 EUR |
| 4 | Vul kaartgegevens in: 4242 4242 4242 4242, exp: 12/27, CVC: 123 | Betaling wordt verwerkt |
| 5 | Controleer redirect na betaling | Gebruiker wordt teruggestuurd naar de applicatie |
| 6 | Controleer boeking in database | Boeking heeft `isPaid: true`, stoelen D1-D3 zijn bezet |
| 7 | Controleer Stripe webhook | `checkout.session.completed` event is ontvangen en verwerkt |

**Verwacht eindresultaat:** Betaling is succesvol, boeking is bevestigd, stoelen zijn definitief bezet.

### Alternatief scenario 1: Betaling wordt geweigerd

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Selecteer stoelen en klik op "Boek nu" | Stripe checkout sessie wordt aangemaakt |
| 2 | Vul geweigerde kaartgegevens in: 4000 0000 0000 0002 | Stripe toont foutmelding "Kaart geweigerd" |
| 3 | Controleer boeking in database | Boeking heeft `isPaid: false` |
| 4 | Controleer stoelen na 10 minuten (Inngest check) | Inngest event `app/checkpayment` controleert betaalstatus |
| 5 | Wacht tot Inngest de check uitvoert | Stoelen D1-D3 worden vrijgegeven (verwijderd uit occupiedSeats) |

**Verwacht eindresultaat:** Bij een geweigerde betaling worden de stoelen na verloop van tijd automatisch vrijgegeven.

### Alternatief scenario 2: Gebruiker sluit Stripe checkout zonder te betalen (sessie verloopt)

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Selecteer stoelen en klik op "Boek nu" | Stripe checkout sessie wordt aangemaakt (30 min geldig) |
| 2 | Sluit de Stripe checkout pagina (browser tab sluiten) | Gebruiker keert terug naar de applicatie |
| 3 | Controleer boeking in database | Boeking bestaat met `isPaid: false` |
| 4 | Wacht 10 minuten (Inngest timeout) | Inngest event controleert of betaling is voltooid |
| 5 | Controleer na Inngest check | Boeking is niet betaald, stoelen worden vrijgegeven |
| 6 | Andere gebruiker opent dezelfde show | Stoelen D1-D3 zijn weer beschikbaar |

**Verwacht eindresultaat:** Niet-betaalde boekingen worden automatisch opgeruimd, stoelen komen weer vrij.

---

## TS-04 - Admin: Film toevoegen

**Gerelateerde User Stories:** US-14, US-15  
**Voorwaarden:** Admin-gebruiker is ingelogd via Clerk met de rol `admin`.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Admin gebruiker | admin@betatickets.com (Clerk rol: admin) |
| Normale gebruiker | testuser@example.com (geen admin rol) |
| TMDB film om toe te voegen | "Mission Impossible 8" (TMDB now-playing) |
| Showdatum | 20-04-2026 |
| Showtijd | 19:30 |
| Showprijs | 15.00 EUR |
| Lege verplichte velden test | Titel: leeg, Prijs: leeg |

### Hoofdscenario: Admin voegt een nieuwe film toe met showtimes

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als admin@betatickets.com | Admin dashboard is toegankelijk |
| 2 | Navigeer naar `/admin/add-shows` | "Film toevoegen" formulier wordt geladen |
| 3 | Selecteer "Mission Impossible 8" uit de TMDB now-playing lijst | Filmgegevens (titel, poster, beschrijving) worden automatisch ingevuld |
| 4 | Vul showdatum in: 20-04-2026 | Datum wordt geaccepteerd (is in de toekomst) |
| 5 | Vul showtijd in: 19:30 | Tijd wordt geaccepteerd |
| 6 | Vul showprijs in: 15.00 EUR | Prijs wordt geaccepteerd |
| 7 | Klik op "Opslaan" / "Toevoegen" | Succesmelding verschijnt |
| 8 | Navigeer naar `/admin/list-shows` | De nieuwe show is zichtbaar in de lijst |
| 9 | Navigeer naar `/movies` (publiek) | "Mission Impossible 8" is zichtbaar in het filmoverzicht |
| 10 | Klik op de film en controleer showtime | Showtime 20-04-2026 om 19:30 is beschikbaar |

**Verwacht eindresultaat:** Film is succesvol toegevoegd en direct zichtbaar voor gebruikers.

### Alternatief scenario 1: Admin probeert film toe te voegen met lege verplichte velden

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar `/admin/add-shows` | Formulier wordt geladen |
| 2 | Laat alle velden leeg | Formulier bevat lege velden |
| 3 | Klik op "Opslaan" | Validatiefoutmeldingen verschijnen bij verplichte velden |
| 4 | Controleer dat er geen film is aangemaakt | Database bevat geen nieuwe film zonder gegevens |

**Verwacht eindresultaat:** Formuliervalidatie voorkomt het aanmaken van incomplete films.

### Alternatief scenario 2: Niet-admin gebruiker probeert admin pagina te openen

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als testuser@example.com (geen admin) | Gebruiker is ingelogd als normale gebruiker |
| 2 | Navigeer direct naar `/admin/add-shows` via de URL | Toegang wordt geweigerd |
| 3 | Controleer redirect | Gebruiker wordt doorgestuurd naar de homepagina |
| 4 | Probeer API call: `POST /api/show/add` met filmdata | Server retourneert 401/403 Unauthorized |

**Verwacht eindresultaat:** Niet-admin gebruikers hebben geen toegang tot admin functionaliteit, zowel via de UI als de API.

---

## TS-05 - Authenticatie en autorisatie

**Gerelateerde User Stories:** US-04, US-05, US-06, US-21  
**Voorwaarden:** Clerk is geconfigureerd, applicatie draait.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Nieuw e-mailadres | nieuw@example.com |
| Wachtwoord (geldig) | Test1234! |
| Wachtwoord (te kort) | abc |
| Ongeldig e-mailadres | geenemail |
| Bestaand account | testuser@example.com / Test1234! |
| Verkeerd wachtwoord | FoutWachtwoord123! |
| Beveiligde pagina | `/my-bookings` |
| Admin pagina | `/admin` |

### Hoofdscenario: Nieuwe gebruiker registreert zich en logt in

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar de registratiepagina (Clerk) | Registratieformulier wordt getoond |
| 2 | Vul in: nieuw@example.com en wachtwoord Test1234! | Gegevens worden geaccepteerd |
| 3 | Klik op "Registreren" | Account wordt aangemaakt via Clerk |
| 4 | Controleer redirect | Gebruiker wordt doorgestuurd naar de homepagina |
| 5 | Controleer navbar | Gebruikersnaam/avatar is zichtbaar, login-knop is verdwenen |
| 6 | Navigeer naar `/my-bookings` | Pagina is toegankelijk (lege boekingslijst) |

**Verwacht eindresultaat:** Registratie verloopt succesvol, gebruiker is ingelogd en heeft toegang tot beveiligde pagina's.

### Alternatief scenario 1: Registratie met ongeldige gegevens

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Navigeer naar de registratiepagina | Registratieformulier wordt getoond |
| 2 | Vul in: e-mail "geenemail", wachtwoord "abc" | Gegevens worden ingevoerd |
| 3 | Klik op "Registreren" | Validatiefouten verschijnen |
| 4 | Controleer foutmeldingen | "Ongeldig e-mailadres" en "Wachtwoord te kort" worden getoond |
| 5 | Controleer dat er geen account is aangemaakt | Geen redirect, formulier blijft zichtbaar |

**Verwacht eindresultaat:** Clerk valideert invoer en toont duidelijke foutmeldingen bij ongeldige gegevens.

### Alternatief scenario 2: Niet-ingelogde gebruiker probeert beveiligde pagina te openen

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Zorg dat je NIET bent ingelogd (log uit als nodig) | Gebruiker is uitgelogd |
| 2 | Navigeer direct naar `/my-bookings` | Toegang wordt geweigerd |
| 3 | Controleer redirect | Gebruiker wordt doorgestuurd naar de loginpagina |
| 4 | Navigeer direct naar `/admin` | Toegang wordt geweigerd |
| 5 | Controleer redirect | Gebruiker wordt doorgestuurd naar de loginpagina of homepagina |
| 6 | Probeer API call: `GET /api/user/bookings` zonder auth token | Server retourneert 401 Unauthorized |

**Verwacht eindresultaat:** Alle beveiligde routes zijn ontoegankelijk zonder geldige authenticatie.

---

## TS-06 - Mijn boekingen bekijken

**Gerelateerde User Stories:** US-11  
**Voorwaarden:** Gebruiker is ingelogd en heeft minimaal 1 betaalde boeking.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Ingelogde gebruiker | testuser@example.com |
| Boeking 1 | "Thunderbolts*", 15-04-2026, 20:00, stoelen A1+A2, betaald |
| Boeking 2 | "Mission Impossible 8", 20-04-2026, 19:30, stoel D1, betaald |
| Niet-betaalde boeking | "Test Film", stoel X1, NIET betaald |
| Gebruiker zonder boekingen | nieuw@example.com |

### Hoofdscenario: Gebruiker bekijkt eigen boekingen

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als testuser@example.com | Gebruiker is ingelogd |
| 2 | Navigeer naar `/my-bookings` | Boekingenpagina wordt geladen |
| 3 | Controleer boekingslijst | 2 betaalde boekingen zijn zichtbaar |
| 4 | Controleer Boeking 1 | Toont: "Thunderbolts*", 15-04-2026, 20:00, stoelen A1, A2 |
| 5 | Controleer Boeking 2 | Toont: "Mission Impossible 8", 20-04-2026, 19:30, stoel D1 |
| 6 | Controleer niet-betaalde boeking | Niet-betaalde boeking (stoel X1) is NIET zichtbaar in de lijst |

**Verwacht eindresultaat:** Alleen betaalde boekingen worden getoond met correcte details.

### Alternatief scenario 1: Gebruiker zonder boekingen

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als nieuw@example.com (geen boekingen) | Gebruiker is ingelogd |
| 2 | Navigeer naar `/my-bookings` | Boekingenpagina wordt geladen |
| 3 | Controleer weergave | Melding "Je hebt nog geen boekingen" of lege lijst wordt getoond |
| 4 | Controleer dat de pagina niet crasht | Pagina functioneert normaal zonder errors |

**Verwacht eindresultaat:** Lege staat wordt correct afgehandeld met gebruikersvriendelijke melding.

### Alternatief scenario 2: Gebruiker probeert boekingen van een andere gebruiker te bekijken

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als testuser@example.com | Gebruiker is ingelogd |
| 2 | Navigeer naar `/my-bookings` | Eigen boekingen worden getoond |
| 3 | Probeer API call: `GET /api/user/bookings` met eigen auth token | Alleen eigen boekingen worden geretourneerd |
| 4 | Controleer dat boekingen van andere gebruikers niet zichtbaar zijn | Response bevat alleen boekingen gekoppeld aan eigen Clerk ID |

**Verwacht eindresultaat:** Gebruikers kunnen uitsluitend hun eigen boekingen bekijken, niet die van anderen.

---

## TS-07 - Admin Dashboard KPI's

**Gerelateerde User Stories:** US-17, US-18, US-19  
**Voorwaarden:** Admin is ingelogd, er zijn boekingen en gebruikers in het systeem.

### Testdata

| Gegeven | Waarde |
|---------|--------|
| Admin gebruiker | admin@betatickets.com |
| Totaal betaalde boekingen | 15 |
| Totale omzet | 187.50 EUR (15 x 12.50) |
| Actieve shows (toekomst) | 5 |
| Totaal gebruikers (Clerk) | 25 |
| Niet-betaalde boekingen | 3 (moeten NIET meetellen in KPI's) |

### Hoofdscenario: Admin bekijkt dashboard met correcte KPI's

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als admin@betatickets.com | Admin dashboard is toegankelijk |
| 2 | Navigeer naar `/admin` | Dashboard pagina wordt geladen |
| 3 | Controleer "Totaal Boekingen" KPI | Toont 15 (alleen betaalde boekingen) |
| 4 | Controleer "Totale Omzet" KPI | Toont 187.50 EUR |
| 5 | Controleer "Actieve Shows" KPI | Toont 5 (alleen toekomstige shows) |
| 6 | Controleer "Totaal Gebruikers" KPI | Toont 25 |
| 7 | Controleer dat niet-betaalde boekingen niet meetellen | 3 niet-betaalde boekingen zijn uitgesloten van totalen |

**Verwacht eindresultaat:** Dashboard toont accurate, realtime KPI's gebaseerd op alleen betaalde boekingen.

### Alternatief scenario 1: Dashboard na een nieuwe boeking

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Noteer huidige KPI waarden (Boekingen: 15, Omzet: 187.50 EUR) | Beginwaarden genoteerd |
| 2 | Maak een nieuwe boeking als testuser (1 stoel, 12.50 EUR) | Boeking wordt succesvol betaald |
| 3 | Ververs het admin dashboard | Dashboard herlaadt |
| 4 | Controleer "Totaal Boekingen" | Toont 16 (+1) |
| 5 | Controleer "Totale Omzet" | Toont 200.00 EUR (+12.50) |

**Verwacht eindresultaat:** KPI's worden direct bijgewerkt na een nieuwe betaalde boeking.

### Alternatief scenario 2: Dashboard met geen data (leeg systeem)

| Stap | Actie | Verwacht resultaat |
|------|-------|--------------------|
| 1 | Log in als admin in een schone omgeving (geen boekingen/shows) | Admin dashboard is toegankelijk |
| 2 | Navigeer naar `/admin` | Dashboard pagina wordt geladen |
| 3 | Controleer "Totaal Boekingen" KPI | Toont 0 |
| 4 | Controleer "Totale Omzet" KPI | Toont 0.00 EUR |
| 5 | Controleer "Actieve Shows" KPI | Toont 0 |
| 6 | Controleer dat de pagina niet crasht | Pagina functioneert normaal zonder errors |

**Verwacht eindresultaat:** Dashboard handelt een leeg systeem correct af en toont 0-waarden zonder fouten.

---

## Overzicht testscenario's

| ID | Testscenario | Hoofd | Alt 1 | Alt 2 | Totaal |
|----|-------------|-------|-------|-------|--------|
| TS-01 | Film bekijken en details openen | 1 | 1 | 1 | 3 |
| TS-02 | Stoelen selecteren en ticket boeken | 1 | 1 | 1 | 3 |
| TS-03 | Betaalproces via Stripe | 1 | 1 | 1 | 3 |
| TS-04 | Admin: Film toevoegen | 1 | 1 | 1 | 3 |
| TS-05 | Authenticatie en autorisatie | 1 | 1 | 1 | 3 |
| TS-06 | Mijn boekingen bekijken | 1 | 1 | 1 | 3 |
| TS-07 | Admin Dashboard KPI's | 1 | 1 | 1 | 3 |
| **Totaal** | | **7** | **7** | **7** | **21** |
