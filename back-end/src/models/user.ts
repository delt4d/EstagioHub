import { UserRole } from './user-role';

export type User = {
    id?: number;
    email: string;
    password: string;
    role?: UserRole;
};
