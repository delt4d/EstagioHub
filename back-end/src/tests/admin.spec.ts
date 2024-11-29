import timekeeper from 'timekeeper';
import testing from '.';
import config from '../app/config';
import { DatabaseResolver } from '../app/database';

describe('admin', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
    });

    afterEach(() => {
        timekeeper.reset();
        DatabaseResolver.reset();
    });

    describe('POST /admin/login', () => {
        // should authenticate with name and password
        it('should authenticate with name and password', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                    message: config.messages.successfullLogin,
                },
            };

            await testing.expectPromiseNotToReject(
                testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
            );

            const res = await testing.requests.admin['login'](
                testing.models.defaultAdmin.name,
                testing.models.defaultAdmin.user.password
            ).expect(expectedResultValue.loginResponse);

            testing.expectAuthResponseCookies(res);
        });

        // should authenticate with email and password
        it('should authenticate with email and password', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                    message: config.messages.successfullLogin,
                },
            };
            await testing.expectPromiseNotToReject(
                testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
            );
            const res = await testing.requests.admin['login'](
                testing.models.defaultAdmin.user.email,
                testing.models.defaultAdmin.user.password
            ).expect(expectedResultValue.loginResponse);

            testing.expectAuthResponseCookies(res);
        });
    });

    // should not authenticate when name or email is not provided
    it('should not authenticate without nameOrEmail', async () => {
        const expectedResultValue = {
            loginResponse: {
                success: false,
                message: config.messages.emptyNameOrEmail,
            },
        };

        await testing.requests.admin['login'](
            '',
            testing.models.defaultAdmin.user.password
        ).expect(expectedResultValue.loginResponse);
    });

    // should not authenticate when password is not provided
    it('should not authenticate without password', async () => {
        const expectedResultValue = {
            loginResponse: {
                success: false,
                message: config.messages.emptyPassword,
            },
        };

        await testing.requests.admin['login'](
            testing.models.defaultAdmin.user.email,
            ''
        ).expect(expectedResultValue.loginResponse);
    });

    // should not authenticate when password is wrong
    it('should not authenticate with wrong password', async () => {
        const expectedResultValue = {
            loginResponse: {
                success: false,
                message: config.messages.wrongPassword,
            },
        };
        await testing.expectPromiseNotToReject(
            testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
        );
        await testing.requests.admin['login'](
            testing.models.defaultAdmin.user.email,
            'wrongPassword_1234*'
        ).expect(expectedResultValue.loginResponse);
    });

    // should not authenticate when password doesn't have minimum length
    it('should not authenticate when password length is too short', async () => {
        const expectedResultValue = {
            loginResponse: {
                success: false,
                message: config.messages.insuficientPasswordCharacters,
            },
        };
        await testing.expectPromiseNotToReject(
            testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
        );
        await testing.requests.admin['login'](
            testing.models.defaultAdmin.user.email,
            '1234567'
        ).expect(expectedResultValue.loginResponse);
    });

    // should not authenticate when admin is not found
    it('should not authenticate when admin is not found', async () => {
        const expectedResultValue = {
            loginResponse: {
                success: false,
                message: config.messages.adminNotFoundWithNameOrEmail,
            },
        };
        await testing.expectPromiseNotToReject(
            // adding just for testing purpose
            testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
        );
        await testing.requests.admin['login'](
            'inexistent_admin_email@email.com',
            testing.models.defaultAdmin.user.password
        ).expect(expectedResultValue.loginResponse);
    });
});
