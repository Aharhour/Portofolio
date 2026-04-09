import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import stripe from "stripe";
import { inngest } from "../inngest/index.js";

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];

// Check if all selected seats are still available for a given show
const checkSeatAvailability = async (showId, selectedSeats) => {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;
    return !selectedSeats.some(seat => occupiedSeats[seat]);
}

// Create a booking: validate seats, reserve them, create Stripe checkout session
export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;

        if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({ success: false, message: "Show ID and at least one seat are required." });
        }

        if (selectedSeats.length > 5) {
            return res.status(400).json({ success: false, message: "You can select a maximum of 5 seats." });
        }

        const seatPattern = /^[A-J][1-9]$/;
        if (!selectedSeats.every(seat => typeof seat === 'string' && seatPattern.test(seat))) {
            return res.status(400).json({ success: false, message: "Invalid seat format." });
        }

        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.status(409).json({ success: false, message: "Selected seats are already occupied. Please choose different seats." });
        }

        const showData = await Show.findById(showId).populate('movie_id');
        if (!showData || !showData.movie_id) {
            return res.status(404).json({ success: false, message: "Show not found." });
        }

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

        // Validate origin against whitelist
        const { origin } = req.headers;
        const safeOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

        // Create Stripe checkout session
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data: {
                currency: 'eur',
                product_data: { name: showData.movie_id.title },
                unit_amount: Math.floor(booking.amount * 100)
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${safeOrigin}/loading/my-bookings`,
            cancel_url: `${safeOrigin}/my-bookings`,
            line_items,
            mode: 'payment',
            metadata: { bookingId: booking._id.toString() },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        })

        booking.paymentLink = session.url;
        booking.stripeSessionId = session.id;
        await booking.save();

        // Schedule payment check - releases seats if unpaid after 10 minutes
        await inngest.send({
            name: "app/checkpayment",
            data: { bookingId: booking._id.toString() }
        })

        res.json({ success: true, url: session.url })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create booking." });
    }
}

// Get occupied seat IDs for a specific show
export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);

        if (!showData) {
            return res.status(404).json({ success: false, message: "Show not found." });
        }

        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({ success: true, occupiedSeats })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve seat data." });
    }
}
