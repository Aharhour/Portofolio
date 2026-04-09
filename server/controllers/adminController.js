import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// Confirm that the authenticated user is an admin (middleware already checked)
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true })
}

// Aggregate dashboard KPIs: bookings, revenue, active shows, total users
export const getDashboardData = async (req, res) => {
    try {
        const [bookings, activeShows, totalUser] = await Promise.allSettled([
            Booking.find({ isPaid: true }),
            Show.find({ showDateTime: { $gt: new Date() } }).populate('movie_id'),
            User.countDocuments()
        ]);

        const paidBookings = bookings.status === 'fulfilled' ? bookings.value : [];

        const dashboardData = {
            totalBookings: paidBookings.length,
            totalRevenue: paidBookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows: activeShows.status === 'fulfilled' ? activeShows.value : [],
            totalUser: totalUser.status === 'fulfilled' ? totalUser.value : 0
        }

        res.json({ success: true, data: dashboardData })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load dashboard data." })
    }
}

// Get all upcoming shows sorted by date
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gt: new Date() } })
            .populate('movie_id')
            .sort({ showDateTime: 1 });
        res.json({ success: true, shows })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load shows." })
    }
}

// Get all bookings with user and show details, newest first
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user')
            .populate({ path: 'show', populate: { path: "movie_id" } })
            .sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load bookings." })
    }
}
