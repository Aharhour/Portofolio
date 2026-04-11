import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getShows, getShow } from '../controllers/showsController.js';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

// Mock de Mongoose models
vi.mock('../models/Show.js', () => ({
    default: {
        find: vi.fn(),
        findById: vi.fn(),
    },
}));

vi.mock('../models/Movie.js', () => ({
    default: {
        findById: vi.fn(),
        create: vi.fn(),
    },
}));

// Helper: maak mock req/res objecten
const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

// =====================================================
// US-01: Films bekijken (GET /api/show/all)
// =====================================================

describe('GET /api/show/all — US-01: Films bekijken', () => {
    beforeEach(() => vi.clearAllMocks());

    it('Test 7: Retourneert unieke films uit beschikbare shows', async () => {
        const mockShows = [
            {
                movie_id: { _id: '1159311', title: 'Thunderbolts*', poster_path: '/poster1.jpg' },
                showDateTime: new Date('2026-04-15T10:00:00'),
            },
            {
                movie_id: { _id: '1159311', title: 'Thunderbolts*', poster_path: '/poster1.jpg' },
                showDateTime: new Date('2026-04-15T14:00:00'),
            },
            {
                movie_id: { _id: '9999', title: 'Andere Film', poster_path: '/poster2.jpg' },
                showDateTime: new Date('2026-04-16T20:00:00'),
            },
        ];

        Show.find.mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockShows),
        });

        const req = {};
        const res = mockRes();

        await getShows(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            shows: expect.any(Array),
        });

        const result = res.json.mock.calls[0][0];
        // Moet 2 unieke films retourneren, niet 3 shows
        expect(result.shows).toHaveLength(2);
        expect(result.shows[0].title).toBe('Thunderbolts*');
        expect(result.shows[1].title).toBe('Andere Film');
    });
});

// =====================================================
// US-02: Film details bekijken (GET /api/show/:movieId)
// =====================================================

describe('GET /api/show/:movieId — US-02: Film details bekijken', () => {
    beforeEach(() => vi.clearAllMocks());

    it('Test 8: Retourneert filmdetails met gegroepeerde showtimes per datum', async () => {
        const mockShows = [
            { showDateTime: new Date('2026-04-15T10:00:00Z'), _id: 'show1' },
            { showDateTime: new Date('2026-04-15T14:00:00Z'), _id: 'show2' },
            { showDateTime: new Date('2026-04-16T20:00:00Z'), _id: 'show3' },
        ];

        const mockMovie = {
            _id: '1159311',
            title: 'Thunderbolts*',
            overview: 'Een groep anti-helden...',
            genres: [{ id: 28, name: 'Action' }],
            runtime: 127,
        };

        Show.find.mockResolvedValue(mockShows);
        Movie.findById.mockResolvedValue(mockMovie);

        const req = { params: { movieId: '1159311' } };
        const res = mockRes();

        await getShow(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            movie: mockMovie,
            dateTime: expect.any(Object),
        });

        const result = res.json.mock.calls[0][0];
        const dates = Object.keys(result.dateTime);
        // Showtimes gegroepeerd: 2 op 15 april, 1 op 16 april
        expect(dates).toHaveLength(2);
        expect(result.dateTime['2026-04-15']).toHaveLength(2);
        expect(result.dateTime['2026-04-16']).toHaveLength(1);
    });

    it('Test 9: Retourneert 404 voor een niet-bestaande film', async () => {
        Show.find.mockResolvedValue([]);
        Movie.findById.mockResolvedValue(null);

        const req = { params: { movieId: '9999999' } };
        const res = mockRes();

        await getShow(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Movie not found.',
        });
    });
});
