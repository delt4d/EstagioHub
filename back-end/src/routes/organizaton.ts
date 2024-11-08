import { Router } from 'express';

const routes = Router();
const controller = new OrganizationController();

routes.get(':cnpj', controller.findByCnpj);

export default routes;
