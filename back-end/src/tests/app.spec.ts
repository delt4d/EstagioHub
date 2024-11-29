import { requestWithSupertest } from '.';
import config from '../app/config';

it('GET /healthcheck should return 200 status code', async () => {
    await requestWithSupertest.get('/healthcheck').expect(200);
});

it('GET / should return correct message', async () => {
    await requestWithSupertest
        .get('/')
        .expect(200, config.messages.welcomeMessage);
});

it('GET /not-existent-route should return 404', async () => {
    const expectedResultValue = {
        success: false,
        message: config.messages.routeNotFound,
    };

    await requestWithSupertest
        .get('/non-existent-route')
        .expect(404, expectedResultValue);
});
