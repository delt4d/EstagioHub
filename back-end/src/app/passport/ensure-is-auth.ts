import { Handler } from 'express';
import passport from 'passport';
import { UserRole } from '../../models/user-role';
import { ForbiddenError } from '../errors';

export const ensureIsAuthenticated: Handler = passport.authenticate(
    ['bearer', 'cookie'],
    {
        session: false,
        scope: 'all',
    }
);

export const ensureIsAuthorized = (...authorizedRoles: UserRole[]): Handler => {
    return (req, res, next) => {
        const user = req.user;

        if (!user || !authorizedRoles.includes(user.role!)) {
            throw new ForbiddenError();
        }

        next();
    };
};
