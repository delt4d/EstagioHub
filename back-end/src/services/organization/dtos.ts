export type BrasilApiCnpjDto = {
    uf: string;
    cep: string;
    qsa: Array<{
        pais: string | null;
        nome_socio: string;
        codigo_pais: string | null;
        faixa_etaria: string;
        cnpj_cpf_do_socio: string;
        qualificacao_socio: string;
        codigo_faixa_etaria: number;
        data_entrada_sociedade: string;
        identificador_de_socio: number;
        cpf_representante_legal: string;
        nome_representante_legal: string;
        codigo_qualificacao_socio: number;
        qualificacao_representante_legal: string;
        codigo_qualificacao_representante_legal: number;
    }>;
    cnpj: string;
    pais: string | null;
    email: string | null;
    porte: string;
    bairro: string;
    numero: string;
    ddd_fax: string;
    municipio: string;
    logradouro: string;
    cnae_fiscal: number;
    codigo_pais: string | null;
    complemento: string;
    codigo_porte: number;
    razao_social: string;
    nome_fantasia: string;
    capital_social: number;
    ddd_telefone_1: string;
    ddd_telefone_2: string;
    opcao_pelo_mei: boolean | null;
    descricao_porte: string;
    codigo_municipio: number;
    cnaes_secundarios: Array<{
        codigo: number;
        descricao: string;
    }>;
    natureza_juridica: string;
    situacao_especial: string;
    opcao_pelo_simples: boolean | null;
    situacao_cadastral: number;
    data_opcao_pelo_mei: string | null;
    data_exclusao_do_mei: string | null;
    cnae_fiscal_descricao: string;
    codigo_municipio_ibge: number;
    data_inicio_atividade: string;
    data_situacao_especial: string | null;
    data_opcao_pelo_simples: string | null;
    data_situacao_cadastral: string;
    nome_cidade_no_exterior: string;
    codigo_natureza_juridica: number;
    data_exclusao_do_simples: string | null;
    motivo_situacao_cadastral: number;
    ente_federativo_responsavel: string;
    identificador_matriz_filial: number;
    qualificacao_do_responsavel: number;
    descricao_situacao_cadastral: string;
    descricao_tipo_de_logradouro: string;
    descricao_motivo_situacao_cadastral: string;
    descricao_identificador_matriz_filial: string;
};

export type CNPJwsApiDto = {
    cnpj_raiz: string;
    razao_social: string;
    capital_social: string;
    responsavel_federativo: string;
    atualizado_em: string;
    porte: {
        id: string;
        descricao: string;
    };
    natureza_juridica: {
        id: string;
        descricao: string;
    };
    qualificacao_do_responsavel: {
        id: number;
        descricao: string;
    };
    socios: Array<{
        cpf_cnpj_socio: string;
        nome: string;
        tipo: string;
        data_entrada: string;
        cpf_representante_legal: string;
        nome_representante: string | null;
        faixa_etaria: string;
        atualizado_em: string;
        pais_id: string;
        qualificacao_socio: {
            id: number;
            descricao: string;
        };
        qualificacao_representante: string | null;
        pais: {
            id: string;
            iso2: string;
            iso3: string;
            nome: string;
            comex_id: string;
        };
    }>;
    simples: null;
    estabelecimento: {
        cnpj: string;
        atividades_secundarias: Array<{
            id: string;
            secao: string;
            divisao: string;
            grupo: string;
            classe: string;
            subclasse: string;
            descricao: string;
        }>;
        cnpj_raiz: string;
        cnpj_ordem: string;
        cnpj_digito_verificador: string;
        tipo: string;
        nome_fantasia: string;
        situacao_cadastral: string;
        data_situacao_cadastral: string;
        data_inicio_atividade: string;
        nome_cidade_exterior: string | null;
        tipo_logradouro: string;
        logradouro: string;
        numero: string;
        complemento: string;
        bairro: string;
        cep: string;
        ddd1: string;
        telefone1: string;
        ddd2: string | null;
        telefone2: string | null;
        ddd_fax: string | null;
        fax: string | null;
        email: string;
        situacao_especial: string | null;
        data_situacao_especial: string | null;
        atualizado_em: string;
        atividade_principal: {
            id: string;
            secao: string;
            divisao: string;
            grupo: string;
            classe: string;
            subclasse: string;
            descricao: string;
        };
        pais: {
            id: string;
            iso2: string;
            iso3: string;
            nome: string;
            comex_id: string;
        };
        estado: {
            id: number;
            nome: string;
            sigla: string;
            ibge_id: number;
        };
        cidade: {
            id: number;
            nome: string;
            ibge_id: number;
            siafi_id: string;
        };
        motivo_situacao_cadastral: string | null;
        inscricoes_estaduais: Array<unknown>;
    };
};
