import app from './app';
import config from './app/config';
import adminService from './services/admin';

app.listen(config.project.port, async () => {
    if (config.project.environment === 'development') {
        await adminService.saveNewAdmin({
            name: config.instituition.adminName,
            user: {
                email: config.instituition.adminEmail,
                password: config.instituition.adminPassword,
            },
        });
    }

    console.log('Server running at port ' + config.project.port);
});
