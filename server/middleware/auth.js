import { clerkClient, getAuth } from "@clerk/express";

// Middleware that verifies the user is authenticated
export const requireAuth = (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated. Please log in." });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Authentication failed. Please log in." });
    }
};

// Middleware that verifies the user has an admin role in Clerk metadata
export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated. Please log in." })
        }

        const user = await clerkClient.users.getUser(userId);
        const isAdmin = user.publicMetadata?.role === 'admin' || user.privateMetadata?.role === 'admin';

        if (!isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." })
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Authentication failed. Please log in." });
    }
}
