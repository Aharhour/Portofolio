import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getUserBookings);

export default bookingRouter;