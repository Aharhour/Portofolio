import { describe, it, expect } from 'vitest';
import theaters from '../configs/theaters.js';

// =====================================================
// US-08: Stoelen selecteren — Theater configuratie validatie
// Test dat de theater/zaal configuraties correct zijn
// =====================================================

describe('Theater Configuratie — US-08: Stoelen selecteren', () => {
    it('Test 17: Alle drie zalen bestaan met correcte structuur', () => {
        expect(theaters).toHaveProperty('zaal-1');
        expect(theaters).toHaveProperty('zaal-2');
        expect(theaters).toHaveProperty('zaal-3');

        for (const [id, theater] of Object.entries(theaters)) {
            expect(theater).toHaveProperty('id', id);
            expect(theater).toHaveProperty('name');
            expect(theater).toHaveProperty('rows');
            expect(theater).toHaveProperty('seatsPerRow');
            expect(theater).toHaveProperty('totalSeats');
            expect(theater).toHaveProperty('upcharge');
            expect(Array.isArray(theater.rows)).toBe(true);
            expect(theater.seatsPerRow).toBeGreaterThan(0);
            expect(theater.totalSeats).toBe(theater.rows.length * theater.seatsPerRow);
        }
    });

    it('Test 18: Zaal capaciteiten kloppen (168, 48, 140 stoelen)', () => {
        expect(theaters['zaal-1'].totalSeats).toBe(168);
        expect(theaters['zaal-1'].name).toBe('De Grote Zaal');
        expect(theaters['zaal-1'].upcharge).toBe(0);

        expect(theaters['zaal-2'].totalSeats).toBe(48);
        expect(theaters['zaal-2'].name).toBe('De Intieme Zaal');
        expect(theaters['zaal-2'].upcharge).toBe(7.99);

        expect(theaters['zaal-3'].totalSeats).toBe(140);
        expect(theaters['zaal-3'].name).toBe('IMAX Experience');
        expect(theaters['zaal-3'].upcharge).toBe(12.99);
    });
});
