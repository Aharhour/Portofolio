# Onderbouwing Technisch Ontwerp — BetaTickets

## Inleiding

Dit document beschrijft de onderbouwing van de gemaakte keuzes in het technisch ontwerp van BetaTickets, een filmticket-boekingsplatform. Per onderdeel wordt toegelicht waarom bepaalde diagrammen zijn gekozen en hoe er rekening is gehouden met ethiek, privacy en security.

---

## 1. Keuze van diagrammen

### ERD (Entity Relationship Diagram)
Het ERD is gekozen omdat BetaTickets een data-intensieve applicatie is met meerdere entiteiten die onderling gerelateerd zijn. Het ERD maakt direct inzichtelijk hoe Users, Movies, Shows, Bookings, Payments en Genres met elkaar verbonden zijn. Dit helpt bij:
- Het begrijpen van de datastructuur voordat er code geschreven wordt
- Het voorkomen van ontwerpfouten zoals ontbrekende relaties of redundante data
- Het communiceren van het datamodel naar teamleden

De keuze voor MongoDB (NoSQL) betekent dat sommige relaties gedenormaliseerd zijn (genres/casts als embedded arrays in Movie), maar het conceptuele ERD toont de logische structuur zodat de relaties helder blijven.

### Sequence Diagrammen (Customer + Admin)
Er zijn twee sequence diagrammen gemaakt — één voor de customer-flow en één voor de admin-flow — omdat de interactie tussen de verschillende systemen (React, Express API, Clerk, Stripe, MongoDB, Inngest, TMDB API) complex is. De sequence diagrammen laten precies zien:
- Welke component welk verzoek stuurt
- In welke volgorde communicatie plaatsvindt
- Waar achtergrondprocessen (webhooks, cron jobs) worden getriggerd
- Hoe foutscenario's worden afgehandeld (alt/loop fragmenten)

### Use Case Diagram
Het use case diagram is gekozen om de functionele eisen visueel te koppelen aan de drie typen gebruikers (Bezoeker, Geregistreerde Gebruiker, Admin). Het diagram toont in één oogopslag welke actor welke actie kan uitvoeren binnen het systeem, wat direct aansluit bij de user stories uit Opdracht 1.

### Activity Diagram
Het activity diagram modelleert het kernproces: het boeken van een ticket. Dit proces is het meest complexe pad in de applicatie met meerdere beslismomenten (ingelogd?, stoelen vrij?, betaling gelukt?) en interactie met externe services (Stripe, Inngest). De swimlanes tonen duidelijk welke verantwoordelijkheid bij welke laag hoort.

---

## 2. Ethiek

### Eerlijke prijzen en transparantie
In het ontwerp is ervoor gekozen dat ticketprijzen duidelijk worden getoond voordat een gebruiker een boeking start. Er worden geen verborgen kosten toegevoegd. De prijs die de admin instelt per show is exact wat de klant betaalt. Dit voorkomt misleidende prijsstrategieën en zorgt voor transparantie richting de consument.

### Toegankelijkheid
De applicatie is ontworpen om voor alle bezoekers bruikbaar te zijn. Films en details zijn zichtbaar zonder account — een bezoeker hoeft pas in te loggen wanneer er daadwerkelijk een ticket geboekt wordt. Dit voorkomt onnodige drempels voor informatietoegang.

### Eerlijk stoelenselectiesysteem
Het systeem werkt op basis van "first come, first served": wie het eerst een stoel boekt, krijgt die stoel. Er is geen voorkeursbehandeling of prioritering op basis van gebruikersprofielen. De 10-minuten timeout voor onbetaalde boekingen (via Inngest) zorgt ervoor dat stoelen niet onnodig geblokkeerd worden, waardoor andere gebruikers eerlijk de kans krijgen.

### Dataminimalisatie
Er worden alleen gegevens verzameld die strikt noodzakelijk zijn voor de dienstverlening (naam, e-mail, boekingsgegevens). Er worden geen tracking-cookies of advertentieprofielen aangemaakt.

---

## 3. Privacy

### Authenticatie via Clerk (externe service)
De keuze voor Clerk als authenticatieservice betekent dat wachtwoorden **niet** in de eigen database worden opgeslagen. Clerk handelt alle gevoelige authenticatiegegevens af op hun eigen beveiligde servers, wat voldoet aan moderne privacy-standaarden. In de MongoDB-database wordt alleen een verwijzing naar de Clerk-gebruiker opgeslagen (_id), samen met de minimaal benodigde profielgegevens (naam, e-mail, profielfoto).

### Favorieten in Clerk privateMetadata
Gebruikersfavorieten worden opgeslagen in Clerk's `privateMetadata` in plaats van in MongoDB. Dit betekent dat deze persoonlijke voorkeuren extra beschermd zijn en alleen toegankelijk via de Clerk API met de juiste authenticatie, niet via directe database-queries.

### Betalingsgegevens bij Stripe
Creditcardgegevens en betaalinformatie worden **nooit** in de eigen database opgeslagen. Stripe handelt alle PCI-DSS compliance af. In de eigen database wordt alleen een `stripeSessionId` opgeslagen als referentie, waarmee de betaling geverifieerd kan worden zonder gevoelige financiële data te bewaren.

### Scheiding van data
Het ontwerp scheidt persoonlijke gegevens (Clerk), financiële gegevens (Stripe) en applicatiedata (MongoDB). Als één systeem gecompromitteerd wordt, heeft een aanvaller niet automatisch toegang tot alle gebruikersgegevens. Dit volgt het principe van "defense in depth".

### GDPR-overwegingen
- Gebruikers kunnen hun account verwijderen via Clerk
- Er worden geen gegevens langer bewaard dan noodzakelijk
- De applicatie verzamelt minimale persoonlijke data

---

## 4. Security

### JWT-authenticatie en rolgebaseerde autorisatie
Alle beveiligde routes worden beschermd door JWT-tokens die door Clerk worden uitgegeven. Het sequence diagram toont hoe bij elke admin-actie eerst het token wordt geverifieerd en vervolgens de rol wordt gecontroleerd via `publicMetadata.role`. Dit voorkomt:
- **Unauthorized access**: Niet-ingelogde gebruikers worden geblokkeerd
- **Privilege escalation**: Reguliere gebruikers kunnen geen admin-acties uitvoeren
- De `protectAdmin` middleware controleert bij elk admin-verzoek de rol

### Stripe Webhook verificatie
In het sequence diagram is zichtbaar dat Stripe webhooks worden verwerkt met `express.raw()` en dat het endpoint apart staat van de normale JSON-parsing. Dit is noodzakelijk voor de webhook signature verificatie van Stripe, waarmee wordt geverifieerd dat het verzoek daadwerkelijk van Stripe afkomstig is en niet van een kwaadwillende derde partij.

### Dubbele boekingspreventie
Het ERD en sequence diagram tonen hoe het systeem dubbele boekingen voorkomt:
1. Bij het aanmaken van een boeking worden de `occupiedSeats` van de Show gecontroleerd
2. Als stoelen al bezet zijn, wordt een 400-fout teruggegeven
3. Direct na een boeking worden de stoelen als bezet gemarkeerd in de database
4. Dit voorkomt race conditions en overboeking

### Onbetaalde boeking cleanup
Via Inngest wordt na 10 minuten gecontroleerd of een boeking betaald is. Als dat niet het geval is, worden de stoelen vrijgegeven en de boeking verwijderd. Dit voorkomt denial-of-service aanvallen waarbij iemand alle stoelen blokkeert zonder te betalen.

### Environment variabelen
Gevoelige configuratie (API-keys, database-URI, Stripe secret) wordt opgeslagen in environment variabelen (.env) en niet in de broncode. De server staat alleen CORS-verzoeken toe van gespecificeerde origins, wat Cross-Site Request Forgery (CSRF) helpt voorkomen.

### Input validatie
Het ontwerp bevat formuliervalidatie aan zowel de frontend (React) als backend (Express) kant. Dit voorkomt:
- **SQL/NoSQL Injection**: Door inputvalidatie en het gebruik van Mongoose ORM
- **XSS**: Door React's standaard escaping van gebruikersinvoer
- **Ongewenste data**: Door schema-validatie op Mongoose-modellen (required, maxlength, enum, min)

---

## 5. Design Pattern

### MVC (Model-View-Controller)
Het project volgt het MVC-patroon:
- **Model**: Mongoose schemas (User, Movie, Show, Booking) definiëren de datastructuur
- **View**: React componenten renderen de gebruikersinterface
- **Controller**: Express route-handlers verwerken de businesslogica

### Event-Driven Architecture
Via Inngest wordt een event-driven architectuur toegepast voor achtergrondprocessen:
- `app/show.added` → Stuurt notificatie bij nieuwe show
- `app/show.booked` → Stuurt bevestigingsmail na betaling
- `app/checkpayment` → Controleert betaling na 10 minuten
- Cron job → Stuurt show-reminders elke 8 uur

Dit zorgt ervoor dat tijdintensieve taken de gebruikerservaring niet vertragen.
