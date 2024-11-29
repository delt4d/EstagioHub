import { Request, Response } from 'express';
import config from '../app/config';
import { NotFoundError, UnhandledError } from '../app/errors';
import { validateSchema } from '../app/helpers';
import { toResult } from '../app/utils';
import { mapUserOut } from '../dtos/user';
import { Admin } from '../models/admin';
import { ResetPasswordToken } from '../models/reset-password-token';
import { Student } from '../models/student';
import { Supervisor } from '../models/supervisor';
import { User } from '../models/user';
import { ForgotPasswordSchema, ResetPasswordSchema } from '../schemas/user';
import authService from '../services/auth';
import emailService from '../services/email';
import userService from '../services/user';
export default class UserController {
    async me(req: Request, res: Response) {
        const currentUser = req.user!;
        const { user, ...data } = await toResult(
            userService.findUserAndAssocById(currentUser.id!, currentUser.role!)
        )
            .validateAsync<Student | Supervisor | Admin>(
                (data) => !!data,
                new NotFoundError('Usuário não encontrado.')
            )
            .orElseThrowAsync();

        return res.send({
            ...data,
            success: true,
            user: mapUserOut(currentUser),
        });
    }

    async requestResetPassword(req: Request, res: Response) {
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
                    `Parece que não foi possível enviar o código de uso único para ${user.email}.`
                )
        );

        const successMessage =
            config.messages.getSuccessfullRequestResetPassword(user.email);

        return res.send({
            success: true,
            message: successMessage,
            expiresAt,
        });
    }

    async resetPassword(req: Request, res: Response) {
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
