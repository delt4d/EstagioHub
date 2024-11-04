import { Request, Response } from 'express';
import config from '../modules/config';
import { NotFoundError, UnhandledError } from '../modules/config/errors';
import { getValidationResult, toResult } from '../modules/config/utils';
import { StudentLoginSchema, StudentRegisterSchema } from '../schemas/student';
import authService from '../services/auth';
import emailService from '../services/email';
import studentService from '../services/student';
import userService from '../services/user';

export default class StudentController {
    async login(req: Request, res: Response) {
        const data = getValidationResult(StudentLoginSchema, req.body);
        const student = await studentService.findStudentByEmail(data.email);

        if (!student) {
            throw new NotFoundError(config.messages.studentNotFoundWithEmail);
        }

        await userService.ensurePasswordsMatchAsync(
            student.user,
            data.password
        );

        const accessToken = await toResult(
            authService.saveNewAccessToken(student.user.id!)
        ).orElseThrow(
            (err) =>
                new UnhandledError(
                    err.message,
                    'Não foi possível realizar o login, tente novamente mais tarde.'
                )
        );

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
        const data = getValidationResult(StudentRegisterSchema, req.body);
        const student = await toResult(
            studentService.saveNewStudent({
                fullName: data.fullName,
                user: {
                    email: data.email,
                    password: data.password,
                },
            })
        ).orElseThrow(
            (error) =>
                new UnhandledError(
                    error.message,
                    'Os dados foram preenchidos corretamente, mas não foi possível completar o registro.'
                )
        );

        await toResult(emailService.sendNewUserEmail(student.user)).getValue();

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }
}