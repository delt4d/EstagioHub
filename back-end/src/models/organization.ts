import { Address } from './address';

export type Organization = {
    cnpj: string;
    corporateName: string; // razão social
    businessName: string; // nome fantasia
    address: Address;
    phone1: string;
    phone2?: string;
};
