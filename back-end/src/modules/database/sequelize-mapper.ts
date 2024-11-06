import { AccessToken } from '../../models/access-token';
import { Admin } from '../../models/admin';
import { ResetPasswordToken } from '../../models/reset-password-token';
import { Student } from '../../models/student';
import { Supervisor } from '../../models/supervisor';
import { User } from '../../models/user';
import { UserRole } from '../../models/user-role';
import { MapperDictionary } from '../config/helpers';
import { mapObject } from '../config/utils';
import {
    AccessTokenTable,
    AdminTable,
    ResetPasswordTable as ResetPasswordTokenTable,
    StudentTable,
    SupervisorTable,
    UserTable,
} from './sequelize-tables';

const adminMapper: MapperDictionary<AdminTable, Admin> = {
    id: 'id',
    name: 'name',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const supervisorMapper: MapperDictionary<SupervisorTable, Supervisor> = {
    id: 'id',
    name: 'name',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const studentMapper: MapperDictionary<StudentTable, Student> = {
    id: 'id',
    fullName: 'fullName',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const userMapper: MapperDictionary<UserTable, User> = {
    id: 'id',
    email: 'email',
    password: 'password',
    role: (src) => {
        const rolesMap: Record<string, UserRole> = {
            admin: UserRole.Adm,
            student: UserRole.Student,
            supervisor: UserRole.Supervisor,
        };

        return rolesMap[src.role];
    },
};

const accessTokenMapper: MapperDictionary<AccessTokenTable, AccessToken> = {
    id: 'id',
    token: 'token',
    expiredAt: 'expiredAt',
    expiresAt: 'expiresAt',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const resetPasswordTokenMapper: MapperDictionary<
    ResetPasswordTokenTable,
    ResetPasswordToken
> = {
    id: 'id',
    email: 'email',
    expiredAt: 'expiredAt',
    expiresAt: 'expiresAt',
    token: 'token',
};

export const mapSequelizeAdminToModel = (entity: AdminTable) =>
    mapObject(entity, adminMapper);

export const mapSequelizeSupervisorToModel = (entity: SupervisorTable) =>
    mapObject(entity, supervisorMapper);

export const mapSequelizeStudentToModel = (entity: StudentTable) =>
    mapObject(entity, studentMapper);

export const mapSequelizeAccessTokenToModel = (entity: AccessTokenTable) =>
    mapObject(entity, accessTokenMapper);

export const mapSequelizeResetPasswordTokenToModel = (
    entity: ResetPasswordTokenTable
) => mapObject(entity, resetPasswordTokenMapper);

export const mapSequelizeUserToModel = (entity: UserTable) =>
    mapObject(entity, userMapper);
