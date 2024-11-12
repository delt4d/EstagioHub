import { Request, Response } from 'express';
import config from '../app/config';
import { DatabaseError, NotFoundError, UnhandledError } from '../app/errors';
import { validateSchema } from '../app/helpers';
import { toResult } from '../app/utils';
import { Supervisor } from '../models/supervisor';
import {
    SupervisorLoginSchema,
    SupervisorRegisterSchema,
} from '../schemas/supervisor';
import authService from '../services/auth';
import emailService from '../services/email';
import supervisorService from '../services/supervisor';
import userService from '../services/user';
export default class SupervisorController {
    async login(req: Request, res: Response) {
        const data = validateSchema(SupervisorLoginSchema, req.body);
        const supervisor = await toResult(
            supervisorService.findSupervisorByEmail(data.email)
        )
            .validateAsync<Supervisor>(
                (student) => !!student,
                new NotFoundError(config.messages.supervisorNotFoundWithEmail)
            )
            .orElseThrowAsync();

        await userService.ensurePasswordsMatchAsync(
            supervisor.user,
            data.password
        );

        const accessToken = await toResult(
            authService.saveNewAccessToken(supervisor.user.id!)
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

    async register(req: Request, res: Response) {
        const data = validateSchema(SupervisorRegisterSchema, req.body);
        const supervisor = await toResult(
            supervisorService.saveNewSupervisor({
                name: data.name,
                user: {
                    email: data.email,
                    password: data.password,
                },
            })
        ).orElseThrowAsync(
            (error) =>
                new UnhandledError(
                    error.message,
                    'Os dados foram preenchidos corretamente, mas não foi possível completar o registro.'
                )
        );

        await toResult(
            emailService.sendNewUserEmail(supervisor.user)
        ).waitAsync();

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}
