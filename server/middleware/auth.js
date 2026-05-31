import { clerkClient, getAuth } from "@clerk/express";

// Middleware: controleert of de gebruiker is ingelogd via Clerk.
// Wordt gebruikt op alle routes die alleen voor ingelogde gebruikers zijn (boekingen, favorieten).
export const requireAuth = (req, res, next) => {
    try {
        // Haal het userId op uit het Clerk-token in de request headers
        const { userId } = getAuth(req);

        // Geen userId betekent: niet ingelogd → 401 terugsturen
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated. Please log in." });
        }

        // Gebruiker is ingelogd, doorgaan naar de volgende middleware/controller
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Authentication failed. Please log in." });
    }
};

// Middleware: controleert of de gebruiker admin-rechten heeft in Clerk.
// Bovenop ingelogd zijn moet de rol 'admin' staan in Clerk's public- of privateMetadata.
export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        // Eerst checken of de gebruiker überhaupt is ingelogd
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated. Please log in." })
        }

        // Volledige user data ophalen bij Clerk om de rol te controleren
        const user = await clerkClient.users.getUser(userId);
        const isAdmin = user.publicMetadata?.role === 'admin' || user.privateMetadata?.role === 'admin';

        // Geen admin-rol → 403 (verboden, geen toegang)
        if (!isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." })
        }

        // Admin bevestigd, doorgaan naar admin-controller
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Authentication failed. Please log in." });
    }
}
