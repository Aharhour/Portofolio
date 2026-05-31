import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getComments, addComment } from '../controllers/commentController.js';

const commentRouter = express.Router();

// Publiek: iedereen mag reacties van een film bekijken
commentRouter.get('/:movieId', getComments)

// Alleen ingelogde gebruikers mogen een reactie plaatsen
commentRouter.post('/add', requireAuth, addComment)

export default commentRouter;
