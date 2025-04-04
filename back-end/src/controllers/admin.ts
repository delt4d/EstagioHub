import { Request, Response } from 'express';
import config from '../app/config';
import { DatabaseError, NotFoundError, UnhandledError } from '../app/errors';
import { validateSchema } from '../app/helpers';
import { toResult } from '../app/utils';
import { Admin } from '../models/admin';
import { AdminLoginSchema } from '../schemas/admin';
import adminService from '../services/admin';
import authService from '../services/auth';
import userService from '../services/user';

export default class AdminController {
    async login(req: Request, res: Response) {
        const data = validateSchema(AdminLoginSchema, req.body);
        const admin = await toResult(
            adminService.findAdminByNameOrEmail(data.nameOrEmail)
        )
            .validateAsync<Admin>(
                (admin) => !!admin,
                new NotFoundError(config.messages.adminNotFoundWithNameOrEmail)
            )
            .orElseThrowAsync();

        await userService.ensurePasswordsMatchAsync(admin.user, data.password);

        const accessToken = await toResult(
            authService.saveNewAccessToken(admin.user.id!)
        ).orElseThrowAsync((err) => {
            const friendlyMessage =
                'Não foi possível realizar o login. Tente novamente mais tarde.';

            if (err instanceof DatabaseError) {
                err.changeFriendlyMessage(friendlyMessage);
                return err;
            }

            return new UnhandledError(err.message, friendlyMessage);
        });

        return res
            .status(200)
            .cookie('token', accessToken.token, config.project.cookieOptions)
            .send({
                success: true,
                token: accessToken.token,
                expiresAt: accessToken.expiresAt,
                message: config.messages.successfullLogin,
            });
    }
}
