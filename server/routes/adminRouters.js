import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

// Alle admin-routes lopen door protectAdmin: alleen accounts met admin-rol mogen erbij.
adminRouter.get('/is-admin', protectAdmin, isAdmin);              // Check of de huidige user admin is
adminRouter.get('/dashboard', protectAdmin, getDashboardData);    // Statistieken voor het dashboard
adminRouter.get('/all-shows', protectAdmin, getAllShows);         // Lijst alle (toekomstige) voorstellingen
adminRouter.get('/all-bookings', protectAdmin, getAllBookings);   // Lijst alle boekingen van alle gebruikers

export default adminRouter;
