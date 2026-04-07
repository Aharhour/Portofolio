import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next)=>{
    try {
        const { userId } = getAuth(req);

        if(!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated. Please log in." })
        }

        const user = await clerkClient.users.getUser(userId);

        const isAdmin = user.publicMetadata?.role === 'admin' || user.privateMetadata?.role === 'admin';

        if(!isAdmin) {
            console.log("Admin check failed for user:", userId);
            console.log("Public metadata:", JSON.stringify(user.publicMetadata));
            console.log("Private metadata:", JSON.stringify(user.privateMetadata));
            return res.status(403).json({ success: false, message: "Access denied. Admins only." })
        }

        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(500).json({ success: false, message: "Authentication failed. Please log in." });
    }
 }
