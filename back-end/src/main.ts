import app from './app';
import config from './app/config';
import { DatabaseResolver } from './app/database';
import adminService from './services/admin';
import authService from './services/auth';
import studentService from './services/student';
import supervisorService from './services/supervisor';

app.listen(config.project.port, async () => {
    console.log('Server running at port ' + config.project.port);

    if (config.project.environment === 'development') {
        console.clear();

        await DatabaseResolver.getConnection();

        const [admin, supervisor, student] = await Promise.all([
            adminService.saveNewAdmin({
                name: config.instituition.adminName,
                user: {
                    email: config.instituition.adminEmail,
                    password: config.instituition.adminPassword,
                },
            }),
            supervisorService.saveNewSupervisor({
                name: 'Supervisor 1',
                user: {
                    email: 'supervisor1@example.com',
                    password: '12345678',
                },
            }),
            studentService.saveNewStudent({
                fullName: 'Student Full Name',
                user: {
                    email: 'student1@example.com',
                    password: '12345678',
                },
            }),
        ]);

        const [adminAccessToken, supervisorAccessToken, studentAccessToken] =
            await Promise.all([
                authService.saveNewAccessToken(admin.user.id!),
                authService.saveNewAccessToken(supervisor.user.id!),
                authService.saveNewAccessToken(student.user.id!),
            ]);

        config.external.logger(`admin access token: ${adminAccessToken.token}`);
        config.external.logger(
            `supervisor access token: ${supervisorAccessToken.token}`
        );
        config.external.logger(
            `student access token: ${studentAccessToken.token}`
        );
    }
});
