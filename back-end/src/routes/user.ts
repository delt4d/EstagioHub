import { Router } from 'express';
import { ensureIsAuthenticated } from '../app/passport/ensure-is-auth';
import UserController from '../controllers/user';

const controller = new UserController();
const routes = Router();

routes.get('/me', ensureIsAuthenticated, controller.me);
routes.post('/forgot-password', controller.requestResetPassword);
routes.post('/reset-password', controller.resetPassword);

export default routes;
