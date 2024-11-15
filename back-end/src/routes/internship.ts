import { Router } from 'express';
import {
    ensureIsAuthenticated,
    ensureIsAuthorized,
} from '../app/passport/ensure-is-auth';
import InternshipController from '../controllers/internship';
import { UserRole } from '../models/user-role';

const controller = new InternshipController();
const routes = Router();

routes.post(
    '/start-new-internship',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Student, UserRole.Supervisor),
    controller.startNewInternship
);

export default routes;
