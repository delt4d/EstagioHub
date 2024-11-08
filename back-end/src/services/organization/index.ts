import { Organization } from '../../models/organization';
import config from '../../modules/config';
import { NotFoundError } from '../../modules/errors';
import * as fakeData from './data.json';
import { BrasilApiHandler, CnpjApiHandler, CnpjWsApiHandler } from './handlers';

interface OrganizationService {
    fetchDataByCnpj(cnpj: string): Promise<Organization | never>;
}

class FakeOrganizationService implements OrganizationService {
    private organizations: Organization[];

    constructor() {
        this.organizations = [...fakeData] as Organization[];
    }

    fetchDataByCnpj(cnpj: string): Promise<Organization | never> {
        const foundOrganization = this.organizations.find((org) => {
            return org.cnpj === cnpj;
        });

        if (!foundOrganization)
            throw new NotFoundError(
                config.messages.organizationNotFoundWithCNPJ
            );

        return Promise.resolve(foundOrganization);
    }
}

class ImplOrganizationService implements OrganizationService {
    private cnpjApiHandler: CnpjApiHandler;

    constructor() {
        const handler1 = new BrasilApiHandler();
        const handler2 = new CnpjWsApiHandler();

        handler1.setNext(handler2);

        this.cnpjApiHandler = handler1;
    }

    async fetchDataByCnpj(cnpj: string): Promise<Organization | never> {
        return await this.cnpjApiHandler.fetchData(cnpj);
    }
}

const organizationService =
    config.project.environment === 'production'
        ? new ImplOrganizationService()
        : new FakeOrganizationService();

export default organizationService as OrganizationService;
