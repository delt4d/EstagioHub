import passport from 'passport';
import {
    Strategy as BearerStrategy,
    VerifyFunctionWithRequest,
} from 'passport-http-bearer';
import authService from '../../../services/auth';

export default function () {
    passport.use(
        'bearer',
        new BearerStrategy<VerifyFunctionWithRequest>(
            {
                passReqToCallback: true,
            },
            async function (req, token, done) {
                req.token = token;

                try {
                    const user =
                        await authService.findUserByValidAccessToken(token);
                    return done(null, user ?? false);
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );
}
