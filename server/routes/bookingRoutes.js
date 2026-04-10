import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', requireAuth, createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;
