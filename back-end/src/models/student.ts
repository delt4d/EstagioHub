import { Address } from './address';
import { AcademicClass } from './institution';
import { User } from './user';

export type Student = {
    id?: number;
    fullName: string;
    rg?: string;
    phone?: string;
    user: User;
    address?: Address;
    whatsapp?: string;
    academicClass?: AcademicClass;
    academicId?: string; // id do aluno na instituição
};
