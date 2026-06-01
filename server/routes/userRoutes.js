import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getUserBookings, updateFavorite, getFavorites } from '../controllers/userController.js';

const userRouter = express.Router();

// Persoonlijke gegevens: alle endpoints vereisen een ingelogde gebruiker (requireAuth).
userRouter.get('/bookings', requireAuth, getUserBookings)         // Mijn boekingen tonen
userRouter.post('/update-favorite', requireAuth, updateFavorite)  // Favoriete film toevoegen/verwijderen
userRouter.get('/favorites', requireAuth, getFavorites)           // Mijn favorietenlijst ophalen

export default userRouter;
