import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import stripe from "stripe";
import { inngest } from "../inngest/index.js";

// Check if all selected seats are still available for a given show
const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// Create a booking: validate seats, reserve them, create Stripe checkout session
export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.json({ success: false, message: "Selected seats are already occupied. Please choose different seats." })
        }

        const showData = await Show.findById(showId).populate('movie_id');

        // Create booking record
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookSeats: selectedSeats
        })

        // Mark seats as occupied
        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified('occupiedSeats');
        await showData.save();

        // Create Stripe checkout session
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data: {
                currency: 'eur',
                product_data: { name: showData.movie_id.title },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items,
            mode: 'payment',
            metadata: { bookingId: booking._id.toString() },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        })

        booking.paymentLink = session.url
        booking.stripeSessionId = session.id
        await booking.save()

        // Schedule payment check - releases seats if unpaid after 10 minutes
        await inngest.send({
            name: "app/checkpayment",
            data: { bookingId: booking._id.toString() }
        })

        res.json({ success: true, url: session.url })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get occupied seat IDs for a specific show
export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({ success: true, occupiedSeats })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}