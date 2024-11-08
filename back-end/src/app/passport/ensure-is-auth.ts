import passport from 'passport';

const ensureIsAuthenticated = passport.authenticate(['bearer', 'cookie'], {
    session: false,
    scope: 'all',
});

export default ensureIsAuthenticated;
