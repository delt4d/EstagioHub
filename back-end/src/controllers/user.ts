import { NextFunction, Request, Response } from 'express';
import { ResetPasswordToken } from '../models/reset-password-token';
import { mapUserToJson as mapUserToData, User } from '../models/user';
import config from '../modules/config';
import { NotFoundError, UnhandledError } from '../modules/errors';
import { validateSchema } from '../modules/helpers';
import { toResult } from '../modules/utils';
import { ForgotPasswordSchema, ResetPasswordSchema } from '../schemas/user';
import authService from '../services/auth';
import emailService from '../services/email';
import userService from '../services/user';
export default class UserController {
    async me(req: Request, res: Response, next: NextFunction) {
        return res.send({
            success: true,
            user: mapUserToData(req.user!),
        });
    }

    async requestResetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const data = validateSchema(ForgotPasswordSchema, req.body);
        const user = await toResult(userService.findUserByEmail(data.email))
            .validateAsync<User>(
                (user) => !!user,
                new NotFoundError(config.messages.userWithEmailNotFound)
            )
            .orElseThrowAsync();

        const { token, expiresAt } =
            await authService.saveNewResetPasswordToken(data.email);

        await toResult(
            emailService.sendResetPasswordEmail(user, token)
        ).orElseThrowAsync(
            (err) =>
                new UnhandledError(
                    err.message,
                    `Parece que não foi possível enviar o código de uso único para ${user.email}`
                )
        );

        return res.send({
            success: true,
            message: config.messages.getSuccessfullRequestResetPassword(
                user.email
            ),
            expiresAt,
        });
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        const data = validateSchema(ResetPasswordSchema, req.body);
        const resetPasswordToken = await toResult(
            authService.findValidResetPasswordToken(data.email, data.token)
        )
            .validateAsync<ResetPasswordToken>(
                (resetPasswordToken) => !!resetPasswordToken,
                new NotFoundError(
                    config.messages.invalidEmailOrResetPasswordToken
                )
            )
            .orElseThrowAsync();

        await authService.invalidateResetPasswordToken(
            resetPasswordToken.token
        );

        await toResult(
            userService.updatePasswordByEmail(
                resetPasswordToken.email,
                data.newPassword
            )
        ).orElseThrowAsync(
            (err) =>
                new UnhandledError(
                    err.message,
                    'Não foi possível resetar a senha. Tente novamente com um novo código.'
                )
        );

        return res.send({
            success: true,
            message: config.messages.successfullPasswordReset,
        });
    }
}
