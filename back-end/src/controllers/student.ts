import { Request, Response } from 'express';
import config from '../app/config';
import { DatabaseError, NotFoundError, UnhandledError } from '../app/errors';
import { validateSchema } from '../app/helpers';
import { toResult } from '../app/utils';
import { mapStudentOut } from '../dtos/student';
import { Student } from '../models/student';
import {
    SearchStudentsSchema,
    StudentLoginSchema,
    StudentRegisterSchema,
} from '../schemas/student';
import authService from '../services/auth';
import emailService from '../services/email';
import studentService from '../services/student';
import userService from '../services/user';

export default class StudentController {
    async login(req: Request, res: Response) {
        const data = validateSchema(StudentLoginSchema, req.body);
        const student = await toResult(
            studentService.findStudentByEmail(data.email)
        )
            .validateAsync<Student>(
                (student) => !!student,
                new NotFoundError(config.messages.studentNotFoundWithEmail)
            )
            .orElseThrowAsync();

        await userService.ensurePasswordsMatchAsync(
            student.user,
            data.password
        );

        const accessToken = await toResult(
            authService.saveNewAccessToken(student.user.id!)
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
        const data = validateSchema(StudentRegisterSchema, req.body);
        const student = await toResult(
            studentService.saveNewStudent({
                fullName: data.fullName,
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

        await toResult(emailService.sendNewUserEmail(student.user)).waitAsync();

        return res.status(201).send({
            success: true,
            message: config.messages.successfullRegister,
        });
    }

    async searchStudents(req: Request, res: Response) {
        const data = validateSchema(SearchStudentsSchema, req.query);
        const students = await studentService.searchStudents(data);

        return res.send({
            ...data,
            success: true,
            students: students.map(mapStudentOut),
        });
    }
}
