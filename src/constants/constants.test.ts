import {
    PG_TITLE_PREFIX,
    pgRoutes,
    STORAGE_DEFAULT_LIMIT,
} from './';

describe('Constants', () => {
    const expectedRoutesForLoggedInUser = [
        ['page.header.navbar.trade', '/trading/', 'trade'],
        ['page.header.navbar.wallets', '/wallets', 'wallets'],
        ['page.header.navbar.openOrders', '/orders', 'orders'],
        ['page.header.navbar.history', '/history', 'history'],
        ['page.header.navbar.profile', '/profile', 'profile'],
        ['page.header.navbar.logout', '/logout', 'logout'],
    ];

    const expectedRoutesForNotLoggedInUser = [
        ['page.header.navbar.trade', '/trading/', 'trade'],
        ['page.header.navbar.signIn', '/login', 'login'],
        ['page.header.signUp', '/register', 'register'],
    ];

    it('Rendering correct title prefix', () => {
        expect(PG_TITLE_PREFIX).toBe('RunesX');
    });

    it('Rendering correct storage default limit', () => {
        expect(STORAGE_DEFAULT_LIMIT).toBe(50);
    });

    it('Rendering correct correct routes if user is not logged in', () => {
        expect(pgRoutes(false)).toEqual(expectedRoutesForNotLoggedInUser);
    });

    it('Rendering correct correct routes if user is not logged in', () => {
        expect(pgRoutes(true)).toEqual(expectedRoutesForLoggedInUser);
    });
});
