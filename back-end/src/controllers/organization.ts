import { Request, Response } from 'express';
import { validateSchema } from '../app/helpers';
import { CnpjSchema } from '../schemas';
import organizationService from '../services/organization';

export default class OrganizationController {
    async findByCnpj(req: Request, res: Response) {
        const cnpj = validateSchema(CnpjSchema, req.params.cnpj);
        const organization = await organizationService.fetchDataByCnpj(cnpj);
        return res.send({
            success: true,
            data: organization,
        });
    }
}
