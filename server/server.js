import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRouters.js';
import userRouter from './routes/userRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

// Express app aanmaken en poort bepalen (gebruikt env-variabele of 3000 als fallback)
const app = express();
const port = process.env.PORT || 3000;

// Lijst met toegestane frontend-domeinen voor CORS (productie + lokaal)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'https://betatickets.vercel.app'];

// CORS moet de allereerste middleware zijn (voor alle andere middleware)
app.use(cors({ origin: allowedOrigins, credentials: true }))

// Preflight (OPTIONS) requests expliciet afhandelen voor alle routes
app.options('/{*splat}', cors({ origin: allowedOrigins, credentials: true }))

// Verbinden met de MongoDB database
await connectDB()

// Stripe webhook heeft de raw body nodig (moet vóór express.json staan, anders mislukt de signature check)
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Globale middleware: JSON parsing met limiet, en Clerk voor authenticatie
app.use(express.json({ limit: '1mb' }))
app.use(clerkMiddleware())

// Health check endpoint om te testen of de server draait
app.get('/', (req, res) => res.send('Server is Live!'))

// API routes - elke route heeft zijn eigen router-bestand
app.use('/api/inngest', serve({ client: inngest, functions })) // Inngest voor achtergrondtaken (e-mails, payment checks)
app.use('/api/show', showRouter)        // Films en voorstellingen
app.use('/api/booking', bookingRouter)  // Boekingen aanmaken en stoel-info
app.use('/api/admin', adminRouter)      // Admin dashboard endpoints
app.use('/api/user', userRouter)        // Gebruiker: favorieten en eigen boekingen
app.use('/api/comment', commentRouter)  // Reacties onder films lezen en plaatsen

// Globale error handler - vangt alle onafgehandelde errors op
app.use((err, req, res, _next) => {
    res.status(err.status || 500).json({
        success: false,
        // In productie geen error details lekken naar de gebruiker
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message
    });
});

// Server alleen lokaal starten - in productie (Vercel) wordt de app als handler gebruikt
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

export default app;