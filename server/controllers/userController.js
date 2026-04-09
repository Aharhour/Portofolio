import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import stripe from "stripe";

// Get all bookings for the logged-in user, verifying payment status with Stripe
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.auth().userId;

        const bookings = await Booking.find({ user: userId })
            .populate({ path: "show", populate: { path: "movie_id" } })
            .sort({ createdAt: -1 })

        // Double-check unpaid bookings against Stripe in case webhook was missed
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        for (const booking of bookings) {
            if (!booking.isPaid && booking.stripeSessionId) {
                try {
                    const session = await stripeInstance.checkout.sessions.retrieve(booking.stripeSessionId);
                    if (session.payment_status === 'paid') {
                        booking.isPaid = true;
                        booking.paymentLink = "";
                        await booking.save();
                    }
                } catch {
                    // Session may have expired - skip silently
                }
            }
        }

        res.json({ success: true, bookings })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
    }
}

// Toggle a movie in the user's favorites (stored in Clerk private metadata)
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;

        if (!movieId) {
            return res.status(400).json({ success: false, message: "Movie ID is required." });
        }

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        // Toggle: add if not present, remove if already favorited
        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId)
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: user.privateMetadata
        })

        res.json({ success: true, message: "Favorites updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update favorites." });
    }
}

// Get all favorited movies for the logged-in user
export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites || [];

        const movies = await Movie.find({ _id: { $in: favorites } });

        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve favorites." });
    }
}
