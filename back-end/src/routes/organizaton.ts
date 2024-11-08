import { Router } from 'express';
import OrganizationController from '../controllers/organization';

const routes = Router();
const controller = new OrganizationController();

routes.get('/:cnpj', controller.findByCnpj);

export default routes;
