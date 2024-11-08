import timekeeper from 'timekeeper';
import testing from '.';
import { DatabaseResolver } from '../app/database';
import adminService from '../services/admin';

describe('logout', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
    });

    afterEach(() => {
        timekeeper.reset();
        DatabaseResolver.reset();
    });

    describe('POST /logout', () => {
        // should log-out admin
        it('should log-out admin', async () => {
            const expectedResultValue = {
                loginResponse: { success: true },
            };

            await testing.expectPromiseNotToReject(
                adminService.saveNewAdmin(testing.models.defaultAdmin)
            );

            const loginRes = await testing.requests.admin['login'](
                testing.models.defaultAdmin.name,
                testing.models.defaultAdmin.user.password
            );

            const logoutRes = await testing.requests['logout'](
                testing.accessToken
            );

            expect(loginRes.body).toMatchObject(
                expectedResultValue.loginResponse
            );
            expect(logoutRes.status).toEqual(204);
        });

        // should not log-out when no active session
        it('should not log-out when not authenticated', async () => {
            const logoutRes = await testing.requests['logout'](
                testing.accessToken
            );
            expect(logoutRes.status).toBe(401);
        });

        // should not log-out when an invalid access token is provided
        it('should not log-out with invalid access token', async () => {
            const logoutRes = await testing.requests['logout'](
                'invalidAccessToken_123'
            );
            expect(logoutRes.status).toBe(401);
        });

        // should not log-out when access token was invalidated
        it('should not log-out when logged out', async () => {
            const expectedResultValue = {
                loginResponse: { success: true },
            };

            await testing.expectPromiseNotToReject(
                adminService.saveNewAdmin(testing.models.defaultAdmin)
            );

            const loginRes = await testing.requests.admin['login'](
                testing.models.defaultAdmin.name,
                testing.models.defaultAdmin.user.password
            );

            const logoutRes = await testing.requests['logout'](
                testing.accessToken
            );

            const secondLogoutRes = await testing.requests['logout'](
                testing.accessToken
            );

            expect(loginRes.body).toMatchObject(
                expectedResultValue.loginResponse
            );
            expect(logoutRes.status).toEqual(204);
            expect(secondLogoutRes.status).toEqual(401);
        });
    });
});
