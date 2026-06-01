import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import stripe from "stripe";
import { inngest } from "../inngest/index.js";
import theaters from "../configs/theaters.js";

// Toegestane domeinen voor de Stripe redirect URLs
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];

// controleert of alle geselecteerde stoelen nog vrij zijn voor de gegeven show.
// Geeft true terug als ALLE stoelen beschikbaar zijn, false als ook maar één bezet is.
const checkSeatAvailability = async (showId, selectedSeats) => {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;
    // Geen enkele geselecteerde stoel mag al in de occupiedSeats lijst staan
    return !selectedSeats.some(seat => occupiedSeats[seat]);
}

// Hoofdfunctie: maakt een nieuwe boeking aan.
// Stappen: input valideren → stoelen checken → Booking aanmaken → stoelen reserveren → Stripe checkout starten.
export const createBooking = async (req, res) => {
    try {
        // Ingelogde user uit Clerk + boekingsgegevens uit de request body
        const { userId } = req.auth();
        const { showId, selectedSeats, theater: theaterId } = req.body;

        // Validatie: show en stoelen zijn verplicht
        if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({ success: false, message: "Show ID and at least one seat are required." });
        }

        // Validatie: gekozen zaal moet bestaan in onze theaters config
        if (!theaterId || !theaters[theaterId]) {
            return res.status(400).json({ success: false, message: "Please select a valid zaal." });
        }

        // Maximaal 5 stoelen per boeking (anti-misbruik)
        if (selectedSeats.length > 5) {
            return res.status(400).json({ success: false, message: "You can select a maximum of 5 seats." });
        }

        // Show + bijbehorende film ophalen uit DB
        const showData = await Show.findById(showId).populate('movie_id');
        if (!showData || !showData.movie_id) {
            return res.status(404).json({ success: false, message: "Show not found." });
        }

        // Stoelen valideren tegen de layout van de gekozen zaal (rij + nummer moeten bestaan)
        const theater = theaters[theaterId];
        const validRows = theater.rows;
        const maxSeat = theater.seatsPerRow;

        // Elke stoel moet formaat "A1", "B5" etc. hebben en binnen de zaal-grenzen vallen
        if (!selectedSeats.every(seat => {
            if (typeof seat !== 'string') return false;
            const row = seat[0]; // Eerste karakter is de rij (A, B, C, ...)
            const num = parseInt(seat.slice(1)); // Rest is het stoelnummer
            if (isNaN(num)) return false;
            return validRows.includes(row) && num >= 1 && num <= maxSeat;
        })) {
            return res.status(400).json({ success: false, message: "Invalid seat for this zaal." });
        }

        // Race condition check: zijn de stoelen ondertussen al door iemand anders geboekt?
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.status(409).json({ success: false, message: "Selected seats are already occupied. Please choose different seats." });
        }

        // Totaalprijs berekenen: basis-ticketprijs + zaal-toeslag (bv. premium zaal kost meer), keer aantal stoelen
        const pricePerSeat = showData.showPrice + theater.upcharge;
        const totalAmount = pricePerSeat * selectedSeats.length;

        // Boeking-record aanmaken in MongoDB (status nog onbetaald)
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: totalAmount,
            bookSeats: selectedSeats,
            theater: theaterId
        })

        // Stoelen markeren als bezet (object met seat → userId)
        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        // Mongoose detecteert wijzigingen in een Object niet automatisch → expliciet markeren
        showData.markModified('occupiedSeats');
        await showData.save();

        // Origin van de request valideren tegen onze whitelist (voorkomt redirect naar kwaadaardige sites)
        const { origin } = req.headers;
        const safeOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

        // Stripe checkout session opzetten voor de betaling
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Line item beschrijft wat de klant betaalt (Stripe verwacht bedrag in centen vandaar * 100)
        const line_items = [{
            price_data: {
                currency: 'eur',
                product_data: { name: `${showData.movie_id.title} — ${theater.name}` },
                unit_amount: Math.round(totalAmount * 100)
            },
            quantity: 1
        }]

        // Daadwerkelijke checkout sessie aanmaken bij Stripe
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${safeOrigin}/loading/my-bookings`, // Na succesvolle betaling
            cancel_url: `${safeOrigin}/my-bookings`,           // Als gebruiker afbreekt
            line_items,
            mode: 'payment',
            metadata: { bookingId: booking._id.toString() }, // Voor de webhook om de boeking te identificeren
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Sessie verloopt na 30 minuten
        })

        // Stripe payment link en sessie-ID opslaan in de boeking voor latere verificatie
        booking.paymentLink = session.url;
        booking.stripeSessionId = session.id;
        await booking.save();

        // Inngest job inplannen: als na 10 minuten niet betaald is, worden de stoelen weer vrijgegeven
        await inngest.send({
            name: "app/checkpayment",
            data: { bookingId: booking._id.toString() }
        })

        // Stripe URL terugsturen naar frontend zodat de gebruiker doorgestuurd kan worden
        res.json({ success: true, url: session.url })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create booking." });
    }
}

// Lijst met bezette stoelen voor een specifieke voorstelling.
// De seat-layout pagina gebruikt dit om bezette stoelen grijs te maken.
export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);

        if (!showData) {
            return res.status(404).json({ success: false, message: "Show not found." });
        }

        // De keys van het object zijn de seat-codes (A1, B5, etc.)
        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({ success: true, occupiedSeats })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve seat data." });
    }
}
