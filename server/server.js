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
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'https://betatickets.vercel.app'];

// CORS must be the very first middleware (before anything else)
app.use(cors({ origin: allowedOrigins, credentials: true }))

// Explicitly handle preflight for all routes
app.options('*', cors({ origin: allowedOrigins, credentials: true }))

await connectDB()

// Stripe webhook must use raw body parsing (before express.json)
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Global middleware
app.use(express.json({ limit: '1mb' }))
app.use(clerkMiddleware())

// Health check
app.get('/', (req, res) => res.send('Server is Live!'))

// API routes
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

// Global error handler
app.use((err, req, res, _next) => {
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

export default app;