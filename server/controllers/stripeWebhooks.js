import stripe from "stripe";
import Booking from '../models/Booking.js';
import { inngest } from '../inngest/index.js';

// Mark a booking as paid and trigger confirmation email
const markBookingPaid = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.isPaid) return;

    booking.isPaid = true;
    booking.paymentLink = "";
    await booking.save();

    await inngest.send({
        name: "app/show.booked",
        data: { bookingId }
    });
}

// Handle Stripe webhook events (called with raw body)
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return response.status(400).send('Webhook signature verification failed.');
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                if (session.payment_status === 'paid' && session.metadata?.bookingId) {
                    await markBookingPaid(session.metadata.bookingId);
                }
                break;
            }

            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
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
        response.json({ received: true })
    } catch (err) {
        response.status(500).send("Internal Server Error");
    }
}
