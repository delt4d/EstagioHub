import { Router } from 'express';
import { ensureIsAuthenticated } from '../app/passport/ensure-is-auth';
import LogoutController from '../controllers/logout';

const routes = Router();
const controller = new LogoutController();

routes.delete('', ensureIsAuthenticated, controller.logout);

export default routes;
