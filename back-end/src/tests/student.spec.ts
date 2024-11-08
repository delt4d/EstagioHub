import timekeeper from 'timekeeper';
import testing from '.';
import config from '../app/config';
import { DatabaseResolver } from '../app/database';

describe('student', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
    });

    afterEach(() => {
        timekeeper.reset();
        DatabaseResolver.reset();
    });

    describe('POST /student/register', () => {
        // should register a new student
        it('should register a new student', async () => {
            const expectedResultValue = {
                registerStudentResponse: {
                    success: true,
                    message: config.messages.successfullRegister,
                },
            };
            await testing.requests.student['register']({
                email: testing.models.defaultStudent.user.email,
                fullName: testing.models.defaultStudent.fullName,
                password: testing.models.defaultStudent.user.password,
                repeatPassword: testing.models.defaultStudent.user.password,
            }).expect(expectedResultValue.registerStudentResponse);
        });

        // should not register when repeat-password does not match password
        it('should not register with wrong repeat-password', async () => {
            const expectedResultValue = {
                registerStudentResponse: {
                    success: false,
                    message: config.messages.wrongRepeatPassword,
                },
            };
            await testing.requests.student['register']({
                email: testing.models.defaultStudent.user.email,
                fullName: testing.models.defaultStudent.fullName,
                password: testing.models.defaultStudent.user.password,
                repeatPassword: 'wrong_repeat_password',
            }).expect(expectedResultValue.registerStudentResponse);
        });
    });

    describe('POST /student/login', () => {
        // should authenticate student
        it('should authenticate student', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    message: config.messages.successfullLogin,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                testing.models.defaultStudent.user.email,
                testing.models.defaultStudent.user.password
            ).expect(expectedResultValue.loginResponse);
        });

        // should not authenticate with wrong email
        it('should not authenticate with wrong email', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: false,
                    message: config.messages.studentNotFoundWithEmail,
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                'wrong_email@email.com',
                testing.models.defaultStudent.user.password
            ).expect(expectedResultValue.loginResponse);
        });

        // should not not authenticate with wrong password
        it('should not authenticate with wrong password', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: false,
                    message: config.messages.wrongPassword,
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                testing.models.defaultStudent.user.email,
                'wrong_password'
            ).expect(expectedResultValue.loginResponse);
        });
    });
});
