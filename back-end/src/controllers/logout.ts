import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../app/errors';
import authService from '../services/auth';

export default class LogoutController {
    async logout(req: Request, res: Response, next: NextFunction) {
        if (req.isUnauthenticated()) {
            throw new UnauthorizedError();
        }

        await authService.invalidateAccessToken(req.token!);

        req.logout((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid');
            res.clearCookie('token');
            req.session.destroy(() => res.status(204).send({ success: true }));
        });
    }
}
