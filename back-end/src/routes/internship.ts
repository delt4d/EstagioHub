import { Router } from 'express';
import multer from 'multer';
import {
    ensureIsAuthenticated,
    ensureIsAuthorized,
} from '../app/passport/ensure-is-auth';
import InternshipController from '../controllers/internship';
import { UserRole } from '../models/user-role';

const controller = new InternshipController();
const routes = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    '/student/me',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Student),
    controller.getInternshipsByStudentId
);

routes.get(
    '/student/:id',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Adm, UserRole.Supervisor),
    controller.getInternshipsByStudentId
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

routes.post(
    '/:id/confirm-internship-document',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Supervisor),
    controller.confirmInternshipDocument
);

routes.post(
    '/:id/upload-start-document',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Student),
    upload.single('document'),
    controller.uploadInternshipStartDoc
);

routes.post(
    '/:id/upload-progress-document',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Student),
    upload.single('document'),
    controller.uploadInternshipProgressDoc
);

routes.post(
    '/:id/upload-end-document',
    ensureIsAuthenticated,
    ensureIsAuthorized(UserRole.Student),
    upload.single('document'),
    controller.uploadInternshipEndDoc
);

export default routes;
