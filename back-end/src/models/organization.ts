import { Address } from './address';

export type Organization = {
    id?: number;
    cnpj: string;
    corporateName: string; // razão social
    businessName: string; // nome fantasia
    address: Address;
    phone1: string;
    phone2?: string;
    website?: string;
    whatsapp?: string;
};

export type OrganizationInternshipSupervisor = {
    name: string;
    email: string;
    position: string; // cargo do supervisor
};
