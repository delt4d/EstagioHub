import timekeeper from 'timekeeper';
import testing from '.';
import config from '../app/config';
import { DatabaseResolver } from '../app/database';

describe('supervisor', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
    });

    afterEach(() => {
        timekeeper.reset();
        DatabaseResolver.reset();
    });

    describe('POST /supervisor/register', () => {
        // should register a new supervisor
        it('should register a new supervisor', async () => {
            const expectedResultValue = {
                registerSupervisorResponse: {
                    success: true,
                    message: config.messages.successfullRegister,
                },
            };
            await testing.requests.supervisor['register']({
                email: testing.models.defaultSupervisor.user.email,
                name: testing.models.defaultSupervisor.name,
                password: testing.models.defaultSupervisor.user.password,
                repeatPassword: testing.models.defaultSupervisor.user.password,
            }).expect(expectedResultValue.registerSupervisorResponse);
        });

        // should not register when repeat-password does not match password
        it('should not register with wrong repeat-password', async () => {
            const expectedResultValue = {
                registerSupervisorResponse: {
                    success: false,
                    message: config.messages.wrongRepeatPassword,
                },
            };
            await testing.requests.supervisor['register']({
                email: testing.models.defaultSupervisor.user.email,
                name: testing.models.defaultSupervisor.name,
                password: testing.models.defaultSupervisor.user.password,
                repeatPassword: 'wrong_repeat_password',
            }).expect(expectedResultValue.registerSupervisorResponse);
        });
    });

    describe('POST /supervisor/login', () => {
        // should authenticate supervisor
        it('should authenticate supervisor', async () => {
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
                testing.services.supervisor.saveNewSupervisor(
                    testing.models.defaultSupervisor
                )
            );
            await testing.requests.supervisor['login'](
                testing.models.defaultSupervisor.user.email,
                testing.models.defaultSupervisor.user.password
            ).expect(expectedResultValue.loginResponse);
        });

        // should not authenticate with wrong email
        it('should not authenticate with wrong email', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: false,
                    message: config.messages.supervisorNotFoundWithEmail,
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.supervisor.saveNewSupervisor(
                    testing.models.defaultSupervisor
                )
            );
            await testing.requests.supervisor['login'](
                'wrong_email@email.com',
                testing.models.defaultSupervisor.user.password
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
                testing.services.supervisor.saveNewSupervisor(
                    testing.models.defaultSupervisor
                )
            );
            await testing.requests.supervisor['login'](
                testing.models.defaultSupervisor.user.email,
                'wrong_password'
            ).expect(expectedResultValue.loginResponse);
        });
    });
});
