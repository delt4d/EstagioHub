import { AccessToken } from '../../../models/access-token';
import { Address } from '../../../models/address';
import { Admin } from '../../../models/admin';
import { AcademicClass } from '../../../models/institution';
import {
    Internship,
    InternshipSchedule,
    InternshipTasks,
} from '../../../models/internship';
import { Organization } from '../../../models/organization';
import { ResetPasswordToken } from '../../../models/reset-password-token';
import { Student } from '../../../models/student';
import { Supervisor } from '../../../models/supervisor';
import { User } from '../../../models/user';

type BaseSequelizeModel<T, F extends keyof any = never> = Omit<T, F> & {
    [P in F]: number;
};

type CreationType<T, OmitKeys extends keyof T | 'id' = 'id'> = Omit<
    T,
    OmitKeys
>;

// Sequelize model types
export type SequelizeUser = User;
export type SequelizeAdmin = BaseSequelizeModel<Admin, 'userId'>;
export type SequelizeSupervisor = BaseSequelizeModel<Supervisor, 'userId'>;
export type SequelizeStudent = BaseSequelizeModel<
    Omit<Student, 'user' | 'address'>,
    'userId' | 'addressId'
>;
export type SequelizeResetPasswordToken = ResetPasswordToken;
export type SequelizeAddress = Address;
export type SequelizeAcademicClass = AcademicClass;
export type SequelizeinternshipTasks = InternshipTasks;
export type SequelizeOrganization = BaseSequelizeModel<
    Omit<Organization, 'address'>,
    'addressId'
>;
export type SequelizeAccessToken = BaseSequelizeModel<
    Omit<AccessToken, 'user'>,
    'userId'
>;
export type SequelizeInternship = BaseSequelizeModel<
    Omit<Internship, 'student' | 'supervisor' | 'organization'>,
    'studentId' | 'supervisorId' | 'organizationId'
> & {
    periodStartDate: Date;
    periodExpectedEndDate: Date;
    organizationSupervisorName: string;
    organizationSupervisorEmail: string;
    organizationSupervisorPosition: string;
    internshipCloseReason?: string;
    tasks: InternshipTasks[];
};
export type SequelizeInternshipTime = BaseSequelizeModel<InternshipSchedule>;

// Creation types
export type SequelizeUserCreate = CreationType<SequelizeUser>;
export type SequelizeAdminCreate = CreationType<
    SequelizeAdmin,
    'id' | 'userId'
>;
export type SequelizeStudentCreate = CreationType<
    SequelizeStudent,
    'id' | 'userId' | 'addressId'
>;
export type SequelizeAcademicClassCreate = CreationType<SequelizeAcademicClass>;
export type SequelizeInternshipCreate = CreationType<
    SequelizeInternship,
    'id' | 'studentId' | 'supervisorId' | 'organizationId'
>;
export type SequelizeinternshipTasksCreate =
    CreationType<SequelizeinternshipTasks>;
export type SequelizeSupervisorCreate = CreationType<
    SequelizeSupervisor,
    'id' | 'userId'
>;
export type SequelizeAccessTokenCreate = CreationType<
    SequelizeAccessToken,
    'id' | 'expiresAt' | 'expiredAt'
>;
export type SequelizeResetPasswordTokenCreate = CreationType<
    SequelizeResetPasswordToken,
    'id' | 'expiresAt' | 'expiredAt'
>;
export type SequelizeInternshipTimeCreate =
    CreationType<SequelizeInternshipTime>;
