import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// Bevestigt dat de gebruiker admin is
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true })
}

// Verzamelt alle KPI's voor het admin dashboard: aantal boekingen, omzet, actieve voorstellingen en gebruikers.
export const getDashboardData = async (req, res) => {
    try {
        // Drie database queries parallel uitvoeren met allSettled (eentje die faalt breekt de andere niet)
        const [allBookings, activeShows, totalUser] = await Promise.allSettled([
            Booking.find({}),
            Show.find({ showDateTime: { $gt: new Date() } }).populate('movie_id'),
            User.countDocuments()
        ]);

        // Veilig de waardes ophalen - lege array als de query faalde
        const bookings = allBookings.status === 'fulfilled' ? allBookings.value : [];
        // Alleen betaalde boekingen tellen voor de echte omzet
        const paidBookings = bookings.filter(b => b.isPaid === true);

        // Dashboard object samenstellen met alle statistieken
        const dashboardData = {
            totalBookings: bookings.length,
            paidBookings: paidBookings.length,
            totalRevenue: paidBookings.reduce((acc, booking) => acc + (booking.amount || 0), 0), // Som van alle bedragen
            activeShows: activeShows.status === 'fulfilled' ? activeShows.value : [],
            totalUser: totalUser.status === 'fulfilled' ? totalUser.value : 0
        }

        res.json({ success: true, data: dashboardData })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load dashboard data." })
    }
}

// Alle toekomstige voorstellingen ophalen, gesorteerd op datum (oplopend = eerstvolgende eerst).
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gt: new Date() } }) // Alleen shows in de toekomst
            .populate('movie_id') // Film-info erbij joinen
            .sort({ showDateTime: 1 }); // Oplopend: eerstvolgende voorstelling bovenaan
        res.json({ success: true, shows })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load shows." })
    }
}

// Alle boekingen ophalen voor de admin, met user- en filmgegevens, nieuwste eerst.
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user') // Gebruikersgegevens erbij ophalen
            .populate({ path: 'show', populate: { path: "movie_id" } })
            .sort({ createdAt: -1 }) // Nieuwste boekingen bovenaan
        res.json({ success: true, bookings })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load bookings." })
    }
}
