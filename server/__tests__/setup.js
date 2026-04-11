import { vi } from 'vitest';

// Mock mongoose - prevent actual database connections
vi.mock('mongoose', async () => {
    const actual = await vi.importActual('mongoose');
    return {
        ...actual,
        default: {
            ...actual.default,
            connect: vi.fn().mockResolvedValue(true),
            connection: { on: vi.fn() },
        },
    };
});

// Mock Clerk
vi.mock('@clerk/express', () => ({
    clerkMiddleware: () => (req, res, next) => next(),
    clerkClient: {
        users: {
            getUser: vi.fn(),
            updateUserMetadata: vi.fn(),
        },
    },
    getAuth: vi.fn(),
}));

// Mock Inngest
vi.mock('../inngest/index.js', () => ({
    inngest: {
        send: vi.fn().mockResolvedValue(true),
        createFunction: vi.fn(),
    },
    functions: [],
}));

// Mock Stripe
vi.mock('stripe', () => {
    return {
        default: vi.fn(() => ({
            checkout: {
                sessions: {
                    create: vi.fn().mockResolvedValue({
                        id: 'cs_test_123',
                        url: 'https://checkout.stripe.com/test',
                    }),
                    retrieve: vi.fn().mockResolvedValue({
                        payment_status: 'paid',
                        metadata: { bookingId: 'booking_123' },
                    }),
                },
            },
        })),
    };
});

// Mock dotenv
vi.mock('dotenv/config', () => ({}));
