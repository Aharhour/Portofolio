import stripe from "stripe";
import Booking from '../models/Booking.js';

// Hulp-functie: markeert een boeking als betaald.
// Idempotent: als de boeking al betaald is doen we niets.
const markBookingPaid = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.isPaid) return;

    // Status bijwerken en payment link verwijderen (niet meer nodig)
    booking.isPaid = true;
    booking.paymentLink = "";
    await booking.save();
}

// Webhook endpoint waar Stripe naartoe POST't bij betaalevents.
// Wordt aangeroepen met de raw body (geen JSON parsing) omdat de signature anders niet klopt.
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];

    let event;

    // Stripe-signature verifiëren om er zeker van te zijn dat de request echt van Stripe komt
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return response.status(400).send('Webhook signature verification failed.');
    }

    try {
        // Verschillende event-types afhandelen
        switch (event.type) {
            // Klant heeft het betaalproces succesvol afgerond
            case "checkout.session.completed": {
                const session = event.data.object;
                if (session.payment_status === 'paid' && session.metadata?.bookingId) {
                    await markBookingPaid(session.metadata.bookingId);
                }
                break;
            }

            // Backup-event voor het geval checkout.session.completed niet binnenkomt
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                // Sessie achterhalen via het payment intent → boeking achterhalen via metadata
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                const session = sessionList.data[0];
                if (session?.metadata?.bookingId) {
                    await markBookingPaid(session.metadata.bookingId);
                }
                break;
            }

            default:
                break;
        }
        // Stripe verwacht een 2xx response, anders gaat het de webhook opnieuw versturen
        response.json({ received: true })
    } catch (err) {
        response.status(500).send("Internal Server Error");
    }
}
