import { Organization } from '../../models/organization';
import { Mapper } from '../../modules/utils';
import { BrasilApiCnpjDto, CNPJwsApiDto } from './dtos';

export const cnpjWsMapper: Mapper<CNPJwsApiDto, Organization> = {
    cnpj: (data) => data.estabelecimento.cnpj,
    corporateName: (data) => data.razao_social,
    businessName: (data) => data.estabelecimento.nome_fantasia,
    address: (data) => ({
        street: data.estabelecimento.logradouro,
        city: data.estabelecimento.cidade.nome,
        district: data.estabelecimento.bairro,
        postalCode: data.estabelecimento.cep,
        state: data.estabelecimento.estado.sigla.toLowerCase(),
        number: data.estabelecimento.numero,
        additionalInfo: data.estabelecimento.complemento,
    }),
    phone1: (data) =>
        data.estabelecimento.ddd1 + data.estabelecimento.telefone1,
    phone2: (data) =>
        (data.estabelecimento.ddd2 ?? '') +
        (data.estabelecimento.telefone2 ?? ''),
};

export const brasilApiCnpjMapper: Mapper<BrasilApiCnpjDto, Organization> = {
    cnpj: 'cnpj',
    corporateName: 'razao_social',
    businessName: 'nome_fantasia',
    address: (data) => ({
        street: data.logradouro,
        city: data.municipio,
        district: data.bairro,
        postalCode: data.cep,
        state: data.uf.toLowerCase(),
        number: data.numero,
        additionalInfo: data.complemento,
    }),
    phone1: 'ddd_telefone_1',
    phone2: 'ddd_telefone_2',
};
