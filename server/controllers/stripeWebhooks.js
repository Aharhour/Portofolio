import stripe from "stripe";
import Booking from '../models/Booking.js';
import { inngest } from '../inngest/index.js';

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
            case "payment_intent.succeeded": {
                // Look up the checkout session to get booking metadata
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];
                if (!session?.metadata?.bookingId) break;

                const { bookingId } = session.metadata;

                // Mark booking as paid
                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })

                // Trigger confirmation email via Inngest
                await inngest.send({
                    name: "app/show.booked",
                    data: { bookingId }
                })

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
