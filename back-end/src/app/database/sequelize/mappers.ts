import { AccessToken } from '../../../models/access-token';
import { Admin } from '../../../models/admin';
import {
    Classification,
    Internship,
    InternshipStatus,
    WorkSituation,
} from '../../../models/internship';
import { Organization } from '../../../models/organization';
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
    InternshipTable,
    OrganizationTable,
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
    academicId: 'academicId',
    academicClass: 'academicClass',
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

const organizationMapper: Mapper<OrganizationTable, Organization> = {
    id: 'id',
    cnpj: 'cnpj',
    corporateName: 'corporateName',
    businessName: 'businessName',
    address: 'address',
    phone1: 'phone1',
    phone2: 'phone2',
    website: 'website',
    whatsapp: 'whatsapp',
};

const internshipMapper: Mapper<InternshipTable, Internship> = {
    id: 'id',
    student: (src) => mapSequelizeStudentToModel(src.student),
    supervisor: (src) => mapSequelizeSupervisorToModel(src.supervisor),
    status: (src) => {
        const statusMap: Record<string, InternshipStatus> = {
            awaiting_initial_approval: InternshipStatus.AwaitingInitialApproval,
            awaiting_internship_approval:
                InternshipStatus.AwaitingInternshipApproval,
            in_progress: InternshipStatus.InProgress,
            canceled: InternshipStatus.Canceled,
            finished: InternshipStatus.Finished,
            rejected: InternshipStatus.Rejected,
            closed: InternshipStatus.Closed,
        };

        return statusMap[src.status];
    },
    organization: (src) => mapSequelizeOrganizationToModel(src.organization),
    organizationSupervisor: (src) => ({
        email: src.organizationSupervisorEmail,
        name: src.organizationSupervisorName,
        position: src.organizationSupervisorPosition,
    }),
    division: 'division',
    classification: (src) => {
        const classificationMap: Record<string, Classification> = {
            mandatory: Classification.Mandatory,
            optional: Classification.NonMandatory,
        };
        return classificationMap[src.classification];
    },
    monthlyStipend: 'monthlyStipend',
    transportationAid: 'transportationAid',
    internshipCloseReason: 'internshipCloseReason',
    workSituation: (src) => {
        const workSituationMap: Record<string, WorkSituation> = {
            onsite: WorkSituation.Onsite,
            hybrid: WorkSituation.Hybrid,
            remote: WorkSituation.Remote,
        };
        return workSituationMap[src.workSituation];
    },
    period: (src) => ({
        startDate: src.periodStartDate,
        expectedEndDate: src.periodExpectedEndDate,
    }),
    internshipSchedule: 'internshipSchedule',
    tasks: 'tasks',
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

export const mapSequelizeOrganizationToModel = (entity: OrganizationTable) =>
    mapObject(entity, organizationMapper);

export const mapSequelizeInternshipToModel = (
    entity: InternshipTable,
    ignoreError: boolean = false
) => mapObject(entity, internshipMapper, ignoreError);
