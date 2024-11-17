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

routes.get(
    '/',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Adm, UserRole.Supervisor),
    controller.searchInternships
);

routes.get(
    '/:id',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Adm, UserRole.Supervisor),
    controller.getInternshipById
);

routes.post(
    '/:id/cancel-new-internship',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Student, UserRole.Supervisor),
    controller.cancelNewInternship
);

routes.post(
    '/:id/approve-new-internship',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Supervisor),
    controller.approveNewInternship
);

routes.post(
    '/:id/reject-new-internship',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Supervisor),
    controller.rejectNewInternship
);

routes.post(
    '/:id/close-internship',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Supervisor),
    controller.closeInternship
);

export default routes;
