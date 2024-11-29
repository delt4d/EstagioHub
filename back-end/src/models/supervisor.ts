import { User } from './user';

export type Supervisor = {
    id?: number;
    name: string;
    user: User;
};
