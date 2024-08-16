import { Admin } from '../../admin/model';
import { UserToken } from '../../token/model';
import { User } from '../../user/model';
import { SequelizeAdmin } from './admin';
import { SequelizeUserToken } from './tokens';
import { SequelizeUser } from './user';

export function mapSequelizeToModel<T>(entity: T): any {
    if (entity instanceof SequelizeAdmin) {
        return {
            ...entity.toJSON(),
            user: mapSequelizeUserModel(entity.user),
        } as Admin;
    }

    if (entity instanceof SequelizeUser) {
        return mapSequelizeUserModel(entity)!;
    }

    if (entity instanceof SequelizeUserToken) {
        return {
            ...entity.toJSON(),
            user: mapSequelizeUserModel(entity.user),
        } as UserToken;
    }

    throw new Error('Esta entidade não pertence aos do banco');
}

function mapSequelizeUserModel(
    entity: SequelizeUser | undefined
): User | undefined {
    if (entity) {
        return entity.toJSON() as User;
    }
}