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
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({ showDateTime: { $gt: new Date() } }).populate('movie_id');
        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        }

        res.json({ success: true, data: dashboardData })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
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
        console.error(error);
        res.json({ success: false, message: error.message })
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
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}