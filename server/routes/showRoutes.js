import express from 'express';
import { addShow, getNowPlayingMovies, getShow, getShows, getTheaters, getUpcomingMovies } from '../controllers/showsController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

// Admin-only routes
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addShow)

// Public routes
showRouter.get('/upcoming', getUpcomingMovies)
showRouter.get('/theaters', getTheaters)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShow)

export default showRouter;
