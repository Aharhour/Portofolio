# Projectomschrijving - BetaTickets

## Overzicht

BetaTickets is een full-stack webapplicatie waarmee gebruikers filmtickets kunnen boeken. De applicatie biedt een compleet platform voor zowel bioscoopbezoekers als beheerders.

## Doel

Het doel van dit project is het ontwikkelen van een gebruiksvriendelijke filmticket-boekingsapplicatie waarbij bezoekers films kunnen bekijken, showtimes kunnen selecteren, stoelen kunnen kiezen en tickets kunnen boeken. Daarnaast is er een admin-panel waarmee beheerders films kunnen toevoegen/bewerken en statistieken kunnen inzien.

## Eisen en wensen van de opdrachtgever

### Functionele eisen

1. **Filmaanbod tonen** - Bezoekers moeten een overzicht van beschikbare films kunnen zien met details zoals titel, poster, genre, beschrijving en duur.
2. **Gebruikersregistratie en authenticatie** - Gebruikers moeten een account kunnen aanmaken, inloggen en uitloggen via Clerk.
3. **Ticket boeken** - Ingelogde gebruikers moeten een showtime kunnen selecteren, stoelen kunnen kiezen en een boeking kunnen bevestigen.
4. **Dubbele boekingen voorkomen** - Het systeem moet voorkomen dat dezelfde stoel meerdere keren geboekt wordt.
5. **Boekingsoverzicht** - Gebruikers moeten hun eerdere en aankomende boekingen kunnen inzien.
6. **Admin-panel** - Admins moeten films kunnen toevoegen, bewerken en verwijderen, en statistieken kunnen bekijken (gebruikers, tickets, omzet).
7. **Event-driven verwerking** - Ticketverkopen moeten op de achtergrond verwerkt worden via Inngest.

### Niet-functionele eisen

1. **Responsive design** - De applicatie moet zowel op mobiel als desktop goed bruikbaar zijn.
2. **Performance** - Pagina's moeten binnen 2 seconden laden.
3. **Beveiliging** - Beveiligde routes voor ingelogde gebruikers en admins via Clerk.
4. **Formuliervalidatie** - Duidelijke foutmeldingen bij incorrect ingevulde formulieren.

### Technische stack

- **Frontend**: Next.js (React)
- **Authenticatie**: Clerk
- **Database**: MongoDB
- **Event handling**: Inngest
- **Styling**: Tailwind CSS

## Doelgroepen

1. **Bezoekers** - Mensen die films willen bekijken en tickets willen boeken
2. **Geregistreerde gebruikers** - Bezoekers met een account die tickets boeken en beheren
3. **Admins** - Beheerders die het filmaanbod en platform beheren
