import timekeeper from 'timekeeper';
import testing from '.';
import config from '../app/config';
import { DatabaseResolver } from '../app/database';

describe('users', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
    });

    afterEach(() => {
        timekeeper.reset();
        DatabaseResolver.reset();
    });

    describe('GET /user/me', () => {
        // should return logged admin user data
        it('should return admin user data', async () => {
            const expectedResultValue = {
                loginResponse: {
                    message: config.messages.successfullLogin,
                    success: true,
                },
                meResponse: {
                    status: 200,
                    body: {
                        success: true,
                        user: testing.models.getAdminWithoutPassword(
                            testing.models.defaultAdmin
                        ).user,
                    },
                },
            };
            await testing.expectPromiseNotToReject(
                testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
            );
            const loginRes = await testing.requests.admin['login'](
                testing.models.defaultAdmin.name,
                testing.models.defaultAdmin.user.password
            );
            const meRes = await testing.requests.user['me'](
                testing.accessToken
            );
            expect(loginRes.body).toMatchObject(
                expectedResultValue.loginResponse
            );
            expect(meRes).toMatchObject(expectedResultValue.meResponse);
        });

        // should get unauthorized if not logged in
        it('should get unauthorized if not logged in', async () => {
            const res = await testing.requests.user['me']();
            expect(res.status).toEqual(401);
        });
    });

    describe('POST /api/v1/user/reset-password', () => {
        // should reset student password
        it('should reset student password', async () => {
            const expectedResultValue = {
                forgotPasswordResponse: {
                    success: true,
                    message: config.messages.getSuccessfullRequestResetPassword(
                        testing.models.defaultStudent.user.email
                    ),
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
                resetPasswordResponse: {
                    success: true,
                    message: config.messages.successfullPasswordReset,
                },
            };
            await testing.expectPromiseNotToReject(
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            const forgotPasswordRes =
                await testing.requests.user.forgotPassword(
                    testing.models.defaultStudent.user.email
                );
            const resetPasswordRes =
                await testing.requests.user.resetPasswordToken({
                    email: testing.models.defaultStudent.user.email,
                    token: testing.resetPasswordToken,
                    newPassword:
                        testing.models.alternativeStudent.user.password,
                });
            expect(forgotPasswordRes.body).toMatchObject(
                expectedResultValue.forgotPasswordResponse
            );
            expect(resetPasswordRes.body).toMatchObject(
                expectedResultValue.resetPasswordResponse
            );
        });

        // should not reset student password with invalid token
        it('should not reset student password with invalid token', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.invalidEmailOrResetPasswordToken,
            };
            await testing.expectPromiseNotToReject(
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            const resetPasswordRes =
                await testing.requests.user.resetPasswordToken({
                    email: testing.models.defaultStudent.user.email,
                    token: testing.resetPasswordToken,
                    newPassword:
                        testing.models.alternativeStudent.user.password,
                });
            expect(resetPasswordRes.body).toMatchObject(expectedResultValue);
        });

        // should not reset student password with invalid email
        it('should not reset student password with invalid email', async () => {
            const expectedResultValue = {
                success: false,
                message: config.messages.invalidEmailOrResetPasswordToken,
            };
            await testing.expectPromiseNotToReject(
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            const resetPasswordRes =
                await testing.requests.user.resetPasswordToken({
                    email: testing.models.alternativeStudent.user.email,
                    token: testing.resetPasswordToken,
                    newPassword:
                        testing.models.alternativeStudent.user.password,
                });
            expect(resetPasswordRes.body).toMatchObject(expectedResultValue);
        });

        // should not reset student password with used token
        it('should not reset student password with used token', async () => {
            const expectedResultValue = {
                forgotPasswordResponse: {
                    success: true,
                    message: config.messages.getSuccessfullRequestResetPassword(
                        testing.models.defaultStudent.user.email
                    ),
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
                firstResetPasswordResponse: {
                    success: true,
                    message: config.messages.successfullPasswordReset,
                },
                secondResetPasswordResponse: {
                    success: false,
                    message: config.messages.invalidEmailOrResetPasswordToken,
                },
            };
            await testing.expectPromiseNotToReject(
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            const forgotPasswordRes =
                await testing.requests.user.forgotPassword(
                    testing.models.defaultStudent.user.email
                );
            const firstResetPasswordRes =
                await testing.requests.user.resetPasswordToken({
                    email: testing.models.defaultStudent.user.email,
                    token: testing.resetPasswordToken,
                    newPassword:
                        testing.models.alternativeStudent.user.password,
                });
            const secondResetPasswordResponse =
                await testing.requests.user.resetPasswordToken({
                    email: testing.models.defaultStudent.user.email,
                    token: testing.resetPasswordToken,
                    newPassword: testing.models.defaultStudent.user.password,
                });
            expect(forgotPasswordRes.body).toMatchObject(
                expectedResultValue.forgotPasswordResponse
            );
            expect(firstResetPasswordRes.body).toMatchObject(
                expectedResultValue.firstResetPasswordResponse
            );
            expect(secondResetPasswordResponse.body).toMatchObject(
                expectedResultValue.secondResetPasswordResponse
            );
        });
    });
});
