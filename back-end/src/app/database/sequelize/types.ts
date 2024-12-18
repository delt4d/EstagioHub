import { AccessToken } from '../../../models/access-token';
import { Address } from '../../../models/address';
import { Admin } from '../../../models/admin';
import { AcademicClass } from '../../../models/institution';
import {
    Internship,
    InternshipDocument,
    InternshipSchedule,
    InternshipTask,
} from '../../../models/internship';
import { Organization } from '../../../models/organization';
import { ResetPasswordToken } from '../../../models/reset-password-token';
import { Student } from '../../../models/student';
import { Supervisor } from '../../../models/supervisor';
import { User } from '../../../models/user';

type BaseSequelizeModel<
    T,
    OmittedKeys extends keyof T = never,
    AddedProps extends Record<string, any> = {},
> = Omit<T, OmittedKeys> & AddedProps;

type CreationType<T, OmitKeys extends keyof T | 'id' = 'id'> = Omit<
    T,
    OmitKeys
>;

// Sequelize model types
export type SequelizeUser = BaseSequelizeModel<User>;
export type SequelizeAdmin = BaseSequelizeModel<
    Admin,
    'user',
    { userId: number }
>;
export type SequelizeSupervisor = BaseSequelizeModel<
    Supervisor,
    'user',
    { userId: number }
>;
export type SequelizeStudent = BaseSequelizeModel<
    Student,
    never,
    {
        userId: number;
        addressId: number;
    }
>;
export type SequelizeResetPasswordToken =
    BaseSequelizeModel<ResetPasswordToken>;
export type SequelizeAddress = BaseSequelizeModel<Address>;
export type SequelizeAcademicClass = AcademicClass;
export type SequelizeInternshipTasks = InternshipTask;
export type SequelizeOrganization = BaseSequelizeModel<
    Organization,
    'address',
    { addressId: number }
>;
export type SequelizeAccessToken = BaseSequelizeModel<
    AccessToken,
    'user',
    { userId: number }
>;
export type SequelizeInternship = BaseSequelizeModel<
    Internship,
    'student' | 'supervisor' | 'organization',
    {
        studentId: number;
        supervisorId: number;
        organizationId: number;
        periodStartDate: Date;
        periodExpectedEndDate: Date;
        organizationSupervisorName: string;
        organizationSupervisorEmail: string;
        organizationSupervisorPosition: string;
        internshipCloseReason?: string;
        tasks: InternshipTask[];
    }
>;
export type SequelizeInternshipDocument = BaseSequelizeModel<
    InternshipDocument,
    'id' | 'internshipId',
    {
        internshipId: number;
    }
>;
export type SequelizeInternshipTime = BaseSequelizeModel<InternshipSchedule>;

// Creation types
export type SequelizeUserCreate = CreationType<SequelizeUser, 'id'>;
export type SequelizeAdminCreate = CreationType<
    SequelizeAdmin,
    'id' | 'userId'
>;
export type SequelizeStudentCreate = CreationType<
    SequelizeStudent,
    'id' | 'userId' | 'addressId'
>;
export type SequelizeAddressCreate = CreationType<SequelizeAddress>;
export type SequelizeAcademicClassCreate = CreationType<SequelizeAcademicClass>;
export type SequelizeInternshipCreate = CreationType<
    SequelizeInternship,
    'id' | 'studentId' | 'supervisorId' | 'organizationId'
>;
export type SequelizeinternshipTasksCreate =
    CreationType<SequelizeInternshipTasks>;
export type SequelizeSupervisorCreate = CreationType<
    SequelizeSupervisor,
    'id' | 'userId'
>;
export type SequelizeInternshipDocumentCreate = CreationType<
    SequelizeInternshipDocument,
    'id'
>;
export type SequelizeAccessTokenCreate = CreationType<
    SequelizeAccessToken,
    'id' | 'expiresAt' | 'expiredAt'
>;
export type SequelizeResetPasswordTokenCreate = CreationType<
    SequelizeResetPasswordToken,
    'id' | 'expiresAt' | 'expiredAt'
>;
export type SequelizeInternshipTimeCreate = CreationType<
    SequelizeInternshipTime,
    'id'
>;
