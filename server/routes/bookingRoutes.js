import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// Boeken vereist een ingelogde user; de seat-info is publiek zodat ook bezoekers de zaal kunnen bekijken.
bookingRouter.post('/create', requireAuth, createBooking);  // Nieuwe boeking + Stripe checkout starten
bookingRouter.get('/seats/:showId', getOccupiedSeats);      // Welke stoelen zijn al bezet voor deze show

export default bookingRouter;
