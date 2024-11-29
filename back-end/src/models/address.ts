export type Address = {
    id?: number;
    street: string; // logradouro
    city: string; // município
    district: string; // bairro
    postalCode: string; // cep
    state: string; // uf (estado)
    number?: string; // número do local (opcional)
    additionalInfo?: string; // complemento
};
