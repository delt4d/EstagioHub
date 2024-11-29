import { Axios } from 'axios';
import config from '../../app/config';
import {
    BadRequestError,
    NotFoundError,
    TooManyRequestsError,
    UnhandledError,
} from '../../app/errors';
import { mapObject } from '../../app/helpers';
import { BrasilApiCnpjDto, CNPJwsApiDto } from '../../dtos/organization';
import { Organization } from '../../models/organization';
import { brasilApiCnpjMapper, cnpjWsMapper } from './mapper';

export interface CnpjHandler {
    setNext(handler: CnpjHandler): CnpjHandler;
    fetchData(cnpj: string): Promise<Organization | never>;
}

abstract class BaseCnpjHandler implements CnpjHandler {
    private nextHandler?: CnpjHandler;

    setNext(handler: CnpjHandler): CnpjHandler {
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

export class CnpjWsApiHandler extends BaseCnpjHandler {
    private request: Axios;

    constructor() {
        super();
        const baseURL = config.external.cnpjWS.baseURL;
        this.request = new Axios({ baseURL });
    }

    async fetchData(cnpj: string): Promise<Organization | never> {
        try {
            const route = '/cnpj/' + cnpj;
            const response = await this.request.get(route);
            const data: unknown = JSON.parse(response.data);

            if (response.status === 200) {
                return mapObject(data as CNPJwsApiDto, cnpjWsMapper);
            }

            const errorData = data as {
                status: number;
                titulo: string;
                detalhes: string;
                validacao: Array<unknown>;
            };

            if (response.status === 400) {
                throw new BadRequestError(errorData.detalhes);
            }
            if (response.status === 429) {
                throw new TooManyRequestsError(errorData.detalhes);
            }

            return await super.fetchData(cnpj);
        } catch (err: any) {
            return await super.fetchData(cnpj, err);
        }
    }
}

export class BrasilApiHandler extends BaseCnpjHandler {
    private request: Axios;

    constructor() {
        super();
        const baseURL = config.external.brasilAPI.baseURL;
        this.request = new Axios({ baseURL });
    }

    async fetchData(cnpj: string): Promise<Organization | never> {
        try {
            const route = '/cnpj/v1/' + cnpj;
            const response = await this.request.get(route);
            const data: unknown = JSON.parse(response.data);

            if (response.status === 200) {
                return mapObject(data as BrasilApiCnpjDto, brasilApiCnpjMapper);
            }

            const errorData = data as {
                name: string;
                message: string;
                type: string;
                errors: Array<unknown>;
            };

            if (response.status === 400) {
                throw new BadRequestError(errorData.message);
            }
            if (response.status === 404) {
                throw new NotFoundError(errorData.message);
            }

            return await super.fetchData(cnpj);
        } catch (err: any) {
            return await super.fetchData(cnpj, err);
        }
    }
}
