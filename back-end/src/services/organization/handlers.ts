import { Axios } from 'axios';
import { Organization } from '../../models/organization';
import config from '../../modules/config';
import {
    BadRequestError,
    TooManyRequestsError,
    UnhandledError,
} from '../../modules/errors';
import { mapObject } from '../../modules/helpers';
import { brasilApiCnpjMapper, cnpjWsMapper } from './mapper';

export interface CnpjApiHandler {
    setNext(handler: CnpjApiHandler): CnpjApiHandler;
    fetchData(cnpj: string): Promise<Organization | never>;
}

abstract class BaseHandler implements CnpjApiHandler {
    private nextHandler?: CnpjApiHandler;

    setNext(handler: CnpjApiHandler): CnpjApiHandler {
        this.nextHandler = handler;
        return handler;
    }

    async fetchData(cnpj: string, err?: Error): Promise<Organization | never> {
        if (this.nextHandler) {
            return await this.nextHandler.fetchData(cnpj);
        }

        throw (
            err ??
            new UnhandledError(config.messages.organizationNotFoundWithCNPJ)
        );
    }
}

export class CnpjWsApiHandler extends BaseHandler {
    protected static request: Axios;

    public static BrasilCnpjApiHandler() {
        this.request.defaults.baseURL = config.external.cnpjWS.baseURL;
    }

    async fetchData(cnpj: string): Promise<Organization | never> {
        try {
            const route = '/cnpj/' + cnpj;
            const response = await CnpjWsApiHandler.request.get(route);

            if (response.status !== 200) {
                if (response.status === 400) {
                    throw new BadRequestError(response.data.message);
                }
                if (response.status === 429) {
                    throw new TooManyRequestsError(response.data.detalhes);
                }

                return await super.fetchData(cnpj);
            }

            return mapObject(response.data, cnpjWsMapper);
        } catch (err: any) {
            return await super.fetchData(cnpj, err);
        }
    }
}

export class BrasilApiHandler extends BaseHandler {
    protected static request: Axios;

    public static BrasilCnpjApiHandler() {
        this.request.defaults.baseURL = config.external.brasilAPI.baseURL;
    }

    async fetchData(cnpj: string): Promise<Organization | never> {
        try {
            const route = '/cnpj/v1/' + cnpj;
            const response = await BrasilApiHandler.request.get(route);

            if (response.status !== 200) {
                if (response.status === 400) {
                    throw new BadRequestError(response.data.message);
                }

                return await super.fetchData(cnpj);
            }

            return mapObject(response.data, brasilApiCnpjMapper);
        } catch (err: any) {
            return await super.fetchData(cnpj, err);
        }
    }
}
