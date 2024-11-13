import app from './app';
import config from './app/config';
import adminService from './services/admin';
import authService from './services/auth';

app.listen(config.project.port, async () => {
    console.log('Server running at port ' + config.project.port);

    if (config.project.environment === 'development') {
        const admin = await adminService.saveNewAdmin({
            name: config.instituition.adminName,
            user: {
                email: config.instituition.adminEmail,
                password: config.instituition.adminPassword,
            },
        });

        const accessToken = await authService.saveNewAccessToken(
            admin.user.id!
        );

        config.external.logger(`admin access token: ${accessToken.token}`);
    }
});
