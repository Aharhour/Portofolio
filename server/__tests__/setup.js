import { vi } from 'vitest';

// Mock mongoose - voorkomt daadwerkelijke databaseverbindingen
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

// Mock voor Clerk
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

// Mock voor Inngest
vi.mock('../inngest/index.js', () => ({
    inngest: {
        send: vi.fn().mockResolvedValue(true),
        createFunction: vi.fn(),
    },
    functions: [],
}));

// Mock voor Stripe
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

// Mock voor dotenv
vi.mock('dotenv/config', () => ({}));
