import { Request, Response } from 'express';
import organizationService from '../services/organization';

export default class OrganizationController {
    async findByCnpj(req: Request, res: Response) {
        const cnpj = req.params.cnpj;
        const result = await organizationService.fetchDataByCnpj(cnpj);
        return res.send(result);
    }
}
