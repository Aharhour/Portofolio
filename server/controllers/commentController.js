import { clerkClient } from "@clerk/express";
import Comment from "../models/Comment.js";

// Alle reacties bij een specifieke film ophalen, nieuwste eerst.
// Publiek: ook niet-ingelogde bezoekers mogen reacties lezen.
export const getComments = async (req, res) => {
    try {
        const { movieId } = req.params;

        const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load comments." });
    }
}

// Nieuwe reactie plaatsen onder een film.
// Vereist login (requireAuth-middleware), zodat we de userId en naam kennen.
export const addComment = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { movieId, text } = req.body;

        // Basisvalidatie: film en tekst zijn verplicht
        if (!movieId || !text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Movie and text are required." });
        }

        // Naam van de gebruiker ophalen bij Clerk zodat we hem onder de reactie kunnen tonen
        const user = await clerkClient.users.getUser(userId);
        const userName = user.firstName
            ? `${user.firstName} ${user.lastName || ''}`.trim()
            : (user.username || 'Anoniem');

        // Reactie opslaan in de database
        const comment = await Comment.create({
            movieId,
            userId,
            userName,
            text: text.trim(),
        });

        res.json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to post comment." });
    }
}
