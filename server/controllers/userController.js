import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import stripe from "stripe";

// Alle boekingen van de ingelogde gebruiker ophalen voor de "Mijn Boekingen" pagina.
// Voor onbetaalde boekingen checken we extra bij Stripe of de webhook misschien gemist is.
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.auth().userId;

        // Boekingen van deze user, inclusief show + filmgegevens, nieuwste eerst
        const bookings = await Booking.find({ user: userId })
            .populate({ path: "show", populate: { path: "movie_id" } })
            .sort({ createdAt: -1 })

        // Voor onbetaalde boekingen: dubbel-check via Stripe.
        // Reden: webhooks kunnen falen, dus hier verifiëren we de daadwerkelijke betaalstatus.
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        for (const booking of bookings) {
            if (!booking.isPaid && booking.stripeSessionId) {
                try {
                    const session = await stripeInstance.checkout.sessions.retrieve(booking.stripeSessionId);
                    // Stripe zegt betaald → status alsnog updaten in onze DB
                    if (session.payment_status === 'paid') {
                        booking.isPaid = true;
                        booking.paymentLink = "";
                        await booking.save();
                    }
                } catch {
                    // Sessie kan verlopen zijn (na 30 min) - stilletjes overslaan
                }
            }
        }

        res.json({ success: true, bookings })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
    }
}

// Film toevoegen aan of verwijderen uit de favorieten van de ingelogde gebruiker.
// We slaan de favorietenlijst op in Clerk's privateMetadata (geen aparte DB-collectie nodig).
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;

        if (!movieId) {
            return res.status(400).json({ success: false, message: "Movie ID is required." });
        }

        // Huidige user data ophalen bij Clerk
        const user = await clerkClient.users.getUser(userId);

        // Favorieten array initialiseren als die nog niet bestaat
        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        // Toggle-logica: zit hij er nog niet in → toevoegen, zit hij er al in → eruit halen
        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId)
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }

        // Bijgewerkte favorieten opslaan bij Clerk
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: user.privateMetadata
        })

        res.json({ success: true, message: "Favorites updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update favorites." });
    }
}

// Alle favoriete films van de ingelogde gebruiker ophalen voor de Favorieten-pagina.
export const getFavorites = async (req, res) => {
    try {
        // Lijst met movie-IDs uit Clerk metadata
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites || [];

        // Bijbehorende film-documenten ophalen uit MongoDB met $in operator
        const movies = await Movie.find({ _id: { $in: favorites } });

        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve favorites." });
    }
}
