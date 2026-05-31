import express from 'express';
import { addShow, getNowPlayingMovies, getShow, getShows, getTheaters, getUpcomingMovies } from '../controllers/showsController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

// Admin-only routes: alleen admins mogen films van TMDB ophalen en nieuwe shows toevoegen
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies) // Nu draaiende films van TMDB (voor admin om te kiezen)
showRouter.post('/add', protectAdmin, addShow)                    // Nieuwe show(s) toevoegen aan het programma

// Publieke routes: iedereen mag films, zalen en showtijden zien (geen login nodig)
showRouter.get('/upcoming', getUpcomingMovies)  // Aankomende releases voor de Releases pagina
showRouter.get('/theaters', getTheaters)        // Zaal-configuraties (rijen, prijzen, faciliteiten)
showRouter.get("/all", getShows)                // Alle films met geplande shows
showRouter.get("/:movieId", getShow)            // Eén film + alle showtijden gegroepeerd per datum

export default showRouter;
