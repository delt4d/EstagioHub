import { mapObject } from '../app/helpers';
import { Mapper } from '../app/utils';
import { User } from '../models/user';

export type OutUserDto = Omit<User, 'password'>;

export const mapUserOut = (user: User): OutUserDto => {
    const mapper: Mapper<User, OutUserDto> = {
        id: 'id',
        role: 'role',
        email: 'email',
    };

    return mapObject(user, mapper);
};
