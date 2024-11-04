import { AccessToken } from '../models/access-token';
import { ResetPasswordToken } from '../models/reset-password-token';
import { User } from '../models/user';
import config from '../modules/config';
import { BadRequestError, NotFoundError } from '../modules/config/errors';
import { DatabaseResolver } from '../modules/database';
import tokenService from './token';

export class AuthService {
    async findValidResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const resetPassToken = await conn.findValidResetPasswordToken(
            email,
            token
        );

        conn.throwIfHasError();

        if (!resetPassToken) {
            throw new NotFoundError(config.messages.invalidToken);
        }

        if (resetPassToken.expiredAt) {
            throw new BadRequestError(config.messages.invalidToken);
        }

        return resetPassToken;
    }

    async findUserByValidAccessToken(
        accessToken: string
    ): Promise<User | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserByValidAccessToken(accessToken);

        conn.throwIfHasError();

        return user;
    }

    async saveNewResetPasswordToken(
        email: string
    ): Promise<ResetPasswordToken> {
        const conn = await DatabaseResolver.getConnection();
        const resetPasswordToken = await conn.saveNewResetPasswordToken(
            email,
            tokenService.generateResetPasswordToken()
        );

        conn.throwIfHasError();

        return resetPasswordToken!;
    }

    async saveNewAccessToken(userId: number): Promise<AccessToken> {
        const conn = await DatabaseResolver.getConnection();
        const accessToken = await conn.saveNewAccessToken(
            tokenService.generateAccessToken(),
            userId
        );

        conn.throwIfHasError();

        return accessToken!;
    }

    async invalidateAccessToken(token: string): Promise<AccessToken> {
        const conn = await DatabaseResolver.getConnection();
        const accessToken = await conn.invalidateAccessToken(token);

        conn.throwIfHasError();

        if (!accessToken) {
            throw new NotFoundError(config.messages.invalidAccessToken);
        }

        return accessToken;
    }

    async invalidateResetPasswordToken(
        token: string
    ): Promise<ResetPasswordToken> {
        const conn = await DatabaseResolver.getConnection();
        const resetPassToken = await conn.invalidateResetPasswordToken(token);

        conn.throwIfHasError();

        if (!resetPassToken) {
            throw new NotFoundError(config.messages.invalidToken);
        }

        return resetPassToken;
    }
}

const authService = new AuthService();

export default authService;
