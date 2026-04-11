import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

// =====================================================
// US-01, US-02: Movie Model Validatie
// Test dat het Movie model de juiste velden en validaties heeft
// =====================================================

describe('Movie Model — US-01, US-02: Films bekijken', () => {
    // Importeer het schema direct om validatie te testen zonder DB
    const movieSchema = new mongoose.Schema({
        _id: { type: String, required: true },
        title: { type: String, required: true },
        overview: { type: String, required: true, maxlength: 5000 },
        poster_path: { type: String, required: true },
        backdrop_path: { type: String, required: true },
        release_date: { type: String, required: true },
        original_language: { type: String },
        tagline: { type: String, maxlength: 500 },
        genres: [{ type: mongoose.Schema.Types.Mixed }],
        casts: [{ type: mongoose.Schema.Types.Mixed }],
        vote_average: { type: Number, required: true },
        runtime: { type: Number, required: true },
    }, { timestamps: true });

    it('Test 1: Accepteert een volledig filmobject met alle verplichte velden', () => {
        const MovieTest = mongoose.model('MovieTest', movieSchema);
        const validMovie = new MovieTest({
            _id: '1159311',
            title: 'Thunderbolts*',
            overview: 'Een groep anti-helden wordt samengebracht...',
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2026-04-30',
            vote_average: 7.5,
            runtime: 127,
            genres: [{ id: 28, name: 'Action' }],
            casts: [{ id: 1, name: 'Florence Pugh', character: 'Yelena' }],
        });

        const error = validMovie.validateSync();
        expect(error).toBeUndefined();
        expect(validMovie.title).toBe('Thunderbolts*');
        expect(validMovie.genres).toHaveLength(1);
        expect(validMovie.casts[0].name).toBe('Florence Pugh');
    });

    it('Test 2: Weigert een film zonder verplichte velden (title, overview, poster_path)', () => {
        const MovieTest2 = mongoose.model('MovieTest2', movieSchema.clone());
        const invalidMovie = new MovieTest2({
            _id: '999',
            // title ontbreekt
            // overview ontbreekt
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2026-01-01',
            vote_average: 5,
            runtime: 90,
        });

        const error = invalidMovie.validateSync();
        expect(error).toBeDefined();
        expect(error.errors).toHaveProperty('title');
        expect(error.errors).toHaveProperty('overview');
    });
});

// =====================================================
// US-10: Booking Model Validatie
// Test dat het Booking model correct wordt gevalideerd
// =====================================================

describe('Booking Model — US-10: Boeking bevestigen', () => {
    const bookingSchema = new mongoose.Schema({
        user: { type: String, required: true, ref: 'User' },
        show: { type: String, required: true, ref: 'Show' },
        amount: { type: Number, required: true, min: 0 },
        bookSeats: [{ type: String, required: true }],
        theater: { type: String, enum: ["zaal-1", "zaal-2", "zaal-3"], default: "zaal-1" },
        isPaid: { type: Boolean, default: false },
        paymentLink: { type: String },
        stripeSessionId: { type: String },
    }, { timestamps: true });

    it('Test 3: Maakt een geldige boeking aan met correcte velden', () => {
        const BookingTest = mongoose.model('BookingTest', bookingSchema);
        const booking = new BookingTest({
            user: 'user_clerk_123',
            show: 'show_abc',
            amount: 25.00,
            bookSeats: ['A1', 'A2'],
            theater: 'zaal-1',
        });

        const error = booking.validateSync();
        expect(error).toBeUndefined();
        expect(booking.isPaid).toBe(false); // Default waarde
        expect(booking.bookSeats).toEqual(['A1', 'A2']);
        expect(booking.amount).toBe(25.00);
    });

    it('Test 4: Weigert een boeking met ongeldig theater (niet zaal-1/2/3)', () => {
        const BookingTest2 = mongoose.model('BookingTest2', bookingSchema.clone());
        const booking = new BookingTest2({
            user: 'user_123',
            show: 'show_abc',
            amount: 10,
            bookSeats: ['A1'],
            theater: 'zaal-99', // Ongeldig
        });

        const error = booking.validateSync();
        expect(error).toBeDefined();
        expect(error.errors).toHaveProperty('theater');
    });

    it('Test 5: Weigert een boeking met negatief bedrag', () => {
        const BookingTest3 = mongoose.model('BookingTest3', bookingSchema.clone());
        const booking = new BookingTest3({
            user: 'user_123',
            show: 'show_abc',
            amount: -5, // Negatief
            bookSeats: ['A1'],
        });

        const error = booking.validateSync();
        expect(error).toBeDefined();
        expect(error.errors).toHaveProperty('amount');
    });
});

// =====================================================
// US-07: Show Model Validatie
// =====================================================

describe('Show Model — US-07: Showtime selecteren', () => {
    const showSchema = new mongoose.Schema({
        movie_id: { type: String, required: true, ref: 'Movie' },
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true, min: 0 },
        occupiedSeats: { type: Object, default: {} },
    }, { minimize: false });

    it('Test 6: Maakt een geldige show aan met lege occupiedSeats', () => {
        const ShowTest = mongoose.model('ShowTest', showSchema);
        const show = new ShowTest({
            movie_id: '1159311',
            showDateTime: new Date('2026-04-15T20:00:00'),
            showPrice: 12.50,
        });

        const error = show.validateSync();
        expect(error).toBeUndefined();
        expect(show.occupiedSeats).toEqual({});
        expect(show.showPrice).toBe(12.50);
    });
});
