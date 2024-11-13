import { AccessToken } from '../../../models/access-token';
import { Admin } from '../../../models/admin';
import { ResetPasswordToken } from '../../../models/reset-password-token';
import { Student } from '../../../models/student';
import { Supervisor } from '../../../models/supervisor';
import { User } from '../../../models/user';
import { UserRole } from '../../../models/user-role';
import { mapObject } from '../../helpers';
import { Mapper } from '../../utils';
import {
    AccessTokenTable,
    AdminTable,
    ResetPasswordTable as ResetPasswordTokenTable,
    StudentTable,
    SupervisorTable,
    UserTable,
} from './tables';

const adminMapper: Mapper<AdminTable, Admin> = {
    id: 'id',
    name: 'name',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const supervisorMapper: Mapper<SupervisorTable, Supervisor> = {
    id: 'id',
    name: 'name',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const studentMapper: Mapper<StudentTable, Student> = {
    id: 'id',
    fullName: 'fullName',
    phone: 'phone',
    whatsapp: 'whatsapp',
    academicClass: 'academicClass',
    address: 'address',
    rg: 'rg',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const userMapper: Mapper<UserTable, User> = {
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

const accessTokenMapper: Mapper<AccessTokenTable, AccessToken> = {
    id: 'id',
    token: 'token',
    expiredAt: 'expiredAt',
    expiresAt: 'expiresAt',
    user: (src) => mapSequelizeUserToModel(src.user),
};

const resetPasswordTokenMapper: Mapper<
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

export const mapSequelizeAccessTokenToModel = (
    entity: AccessTokenTable,
    ignoreError: boolean = false
) => mapObject(entity, accessTokenMapper, ignoreError);

export const mapSequelizeResetPasswordTokenToModel = (
    entity: ResetPasswordTokenTable
) => mapObject(entity, resetPasswordTokenMapper);

export const mapSequelizeUserToModel = (entity: UserTable) =>
    mapObject(entity, userMapper);
