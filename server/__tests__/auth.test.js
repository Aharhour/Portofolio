import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuth, protectAdmin } from '../middleware/auth.js';
import { getAuth, clerkClient } from '@clerk/express';

// =====================================================
// US-21: Protected routes
// US-14: Admin login (beveiligd dashboard)
// =====================================================

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe('requireAuth middleware — US-21: Protected routes', () => {
    beforeEach(() => vi.clearAllMocks());

    it('Test 13: Blokkeert niet-ingelogde gebruikers met 401', () => {
        getAuth.mockReturnValue({ userId: null });

        const req = {};
        const res = mockRes();
        const next = vi.fn();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Not authenticated. Please log in.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('Test 14: Laat ingelogde gebruikers door naar next()', () => {
        getAuth.mockReturnValue({ userId: 'user_authenticated_123' });

        const req = {};
        const res = mockRes();
        const next = vi.fn();

        requireAuth(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});

describe('protectAdmin middleware — US-14: Admin login', () => {
    beforeEach(() => vi.clearAllMocks());

    it('Test 15: Blokkeert niet-admin gebruiker met 403', async () => {
        getAuth.mockReturnValue({ userId: 'user_regular_456' });
        clerkClient.users.getUser.mockResolvedValue({
            publicMetadata: { role: 'user' },
            privateMetadata: {},
        });

        const req = {};
        const res = mockRes();
        const next = vi.fn();

        await protectAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Access denied. Admins only.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('Test 16: Laat admin gebruiker door naar next()', async () => {
        getAuth.mockReturnValue({ userId: 'user_admin_789' });
        clerkClient.users.getUser.mockResolvedValue({
            publicMetadata: { role: 'admin' },
            privateMetadata: {},
        });

        const req = {};
        const res = mockRes();
        const next = vi.fn();

        await protectAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
