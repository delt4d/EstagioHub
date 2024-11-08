import { Router } from 'express';
import {
    ensureIsAuthenticated,
    ensureIsAuthorized,
} from '../app/passport/ensure-is-auth';
import StudentController from '../controllers/student';
import { UserRole } from '../models/user-role';

const controller = new StudentController();
const routes = Router();

routes.post('/login', controller.login);
routes.post('/register', controller.register);
routes.get(
    '/',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Adm, UserRole.Supervisor),
    controller.findStudents
);

export default routes;
