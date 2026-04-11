import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOccupiedSeats } from '../controllers/bookingController.js';
import Show from '../models/Show.js';

vi.mock('../models/Show.js', () => ({
    default: {
        findById: vi.fn(),
    },
}));

vi.mock('../models/Booking.js', () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
    },
}));

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

// =====================================================
// US-08, US-09: Stoelen selecteren & Dubbele boekingen voorkomen
// =====================================================

describe('GET /api/booking/seats/:showId — US-08: Stoelen selecteren', () => {
    beforeEach(() => vi.clearAllMocks());

    it('Test 10: Retourneert bezette stoelen voor een show', async () => {
        Show.findById.mockResolvedValue({
            _id: 'show_123',
            occupiedSeats: { 'A1': 'user_1', 'B5': 'user_2', 'C3': 'user_3' },
        });

        const req = { params: { showId: 'show_123' } };
        const res = mockRes();

        await getOccupiedSeats(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            occupiedSeats: ['A1', 'B5', 'C3'],
        });
    });

    it('Test 11: Retourneert 404 voor een niet-bestaande show', async () => {
        Show.findById.mockResolvedValue(null);

        const req = { params: { showId: 'nonexistent' } };
        const res = mockRes();

        await getOccupiedSeats(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Show not found.',
        });
    });

    it('Test 12: Retourneert lege array als er geen bezette stoelen zijn', async () => {
        Show.findById.mockResolvedValue({
            _id: 'show_new',
            occupiedSeats: {},
        });

        const req = { params: { showId: 'show_new' } };
        const res = mockRes();

        await getOccupiedSeats(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            occupiedSeats: [],
        });
    });
});
