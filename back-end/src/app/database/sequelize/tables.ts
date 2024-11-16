import { DataTypes } from 'sequelize';
import {
    AllowNull,
    Column,
    Default,
    Index,
    IsLowercase,
    Length,
    Model,
    NotEmpty,
    Table,
    Unique,
    Validate,
} from 'sequelize-typescript';
import { AccessToken } from '../../../models/access-token';
import { Address } from '../../../models/address';
import { Admin } from '../../../models/admin';
import { AcademicClass } from '../../../models/institution';
import { Internship, InternshipSchedule } from '../../../models/internship';
import { Organization } from '../../../models/organization';
import { ResetPasswordToken } from '../../../models/reset-password-token';
import { Student } from '../../../models/student';
import { Supervisor } from '../../../models/supervisor';
import { User } from '../../../models/user';
import config from '../../config';

type BaseSequelizeModel<T, F extends keyof any = never> = Omit<T, F> & {
    [P in F]: number;
};

type CreationType<T, OmitKeys extends keyof T | 'id' = 'id'> = Omit<
    T,
    OmitKeys
>;

// Sequelize model types
type SequelizeUser = User;
type SequelizeAdmin = BaseSequelizeModel<Admin, 'userId'>;
type SequelizeSupervisor = BaseSequelizeModel<Supervisor, 'userId'>;
type SequelizeStudent = BaseSequelizeModel<
    Omit<Student, 'user' | 'address'>,
    'userId' | 'addressId'
>;
type SequelizeResetPasswordToken = ResetPasswordToken;
type SequelizeAddress = Address;
type SequelizeAcademicClass = AcademicClass;
type SequelizeInternshipSchedule = InternshipSchedule;
type SequelizeOrganization = BaseSequelizeModel<
    Omit<Organization, 'address'>,
    'addressId'
>;
type SequelizeAccessToken = BaseSequelizeModel<
    Omit<AccessToken, 'user'>,
    'userId'
>;
type SequelizeInternship = BaseSequelizeModel<
    Omit<Internship, 'student' | 'supervisor' | 'organization'>,
    'studentId' | 'supervisorId' | 'organizationId'
> & {
    periodStartDate: Date;
    periodExpectedEndDate: Date;
    organizationSupervisorName: string;
    organizationSupervisorEmail: string;
    organizationSupervisorPosition: string;
    schedule: InternshipSchedule[];
};

// Creation types
type SequelizeUserCreate = CreationType<SequelizeUser>;
type SequelizeAdminCreate = CreationType<SequelizeAdmin, 'id' | 'userId'>;
type SequelizeStudentCreate = CreationType<
    SequelizeStudent,
    'id' | 'userId' | 'addressId'
>;
type SequelizeAcademicClassCreate = CreationType<SequelizeAcademicClass>;
type SequelizeInternshipCreate = CreationType<
    SequelizeInternship,
    'id' | 'studentId' | 'supervisorId' | 'organizationId'
>;
type SequelizeInternshipScheduleCreate =
    CreationType<SequelizeInternshipSchedule>;
type SequelizeSupervisorCreate = CreationType<
    SequelizeSupervisor,
    'id' | 'userId'
>;
type SequelizeAccessTokenCreate = CreationType<
    SequelizeAccessToken,
    'id' | 'expiresAt' | 'expiredAt'
>;
type SequelizeResetPasswordTokenCreate = CreationType<
    SequelizeResetPasswordToken,
    'id' | 'expiresAt' | 'expiredAt'
>;

@Table({
    tableName: 'reset-password-tokens',
    modelName: 'reset-password-tokens',
})
export class ResetPasswordTable extends Model<
    SequelizeResetPasswordToken,
    SequelizeResetPasswordTokenCreate
> {
    @Index
    @Unique
    @AllowNull(false)
    @Length({
        max: config.validations.maxEmailLength,
        msg: config.messages.invalidEmail,
    })
    @Validate({
        isEmail: {
            msg: config.messages.invalidEmail,
        },
    })
    @IsLowercase
    @Column
    public declare email: string;

    @AllowNull(false)
    @Unique
    @Length({
        min: 1,
        msg: config.messages.invalidResetPasswordToken,
    })
    @Column
    public declare token: string;

    @Column
    public declare expiredAt?: Date;

    @AllowNull(false)
    @Default(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1); // +1 day
        return date;
    })
    @Column
    public declare expiresAt: Date;
}

@Table({
    tableName: 'access-tokens',
    modelName: 'access-tokens',
})
export class AccessTokenTable extends Model<
    SequelizeAccessToken,
    SequelizeAccessTokenCreate
> {
    public declare user: UserTable;

    @AllowNull(false)
    @Length({
        min: 1,
        msg: config.messages.invalidAccessToken,
    })
    @Unique
    @Column
    public declare token: string;

    @Column
    public declare expiredAt?: Date;

    @AllowNull(false)
    @Default(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1); // +1 day
        return date;
    })
    @Column
    public declare expiresAt: Date;
}

@Table({
    tableName: 'users',
    modelName: 'users',
})
export class UserTable extends Model<SequelizeUser, SequelizeUserCreate> {
    @Index
    @Unique
    @AllowNull(false)
    @Length({
        max: config.validations.maxEmailLength,
        msg: config.messages.invalidEmail,
    })
    @Validate({
        isEmail: {
            msg: config.messages.invalidEmail,
        },
    })
    @IsLowercase
    @Column
    public declare email: string;

    @Index
    @Column(DataTypes.STRING)
    public declare role: string;

    @Length({
        min: config.validations.minPasswordLength,
        msg: config.messages.insuficientPasswordCharacters,
    })
    @Column
    public declare password: string;
}

@Table({
    tableName: 'admins',
    modelName: 'admins',
})
export class AdminTable extends Model<SequelizeAdmin, SequelizeAdminCreate> {
    public declare user: UserTable;

    @Index
    @Unique
    @AllowNull(false)
    @NotEmpty
    @Column
    public declare name: string;
}

@Table({
    tableName: 'supervisors',
    modelName: 'supervisors',
})
export class SupervisorTable extends Model<
    SequelizeSupervisor,
    SequelizeSupervisorCreate
> {
    public declare user: UserTable;

    @Index
    @NotEmpty
    @AllowNull(false)
    @Column
    public declare name: string;
}

@Table({
    tableName: 'students',
    modelName: 'students',
})
export class StudentTable extends Model<
    SequelizeStudent,
    SequelizeStudentCreate
> {
    public declare user: UserTable;
    public declare academicClass: AcademicClassTable;
    public declare address: AddressTable;

    @Index
    @NotEmpty
    @AllowNull(false)
    @Column
    public declare fullName: string;

    @Column
    public declare rg?: string;

    @Column
    public declare phone?: string;

    @Column
    public declare whatsapp?: string;

    @Column
    public declare academicId?: string;
}

@Table({
    tableName: 'academic-classes',
    modelName: 'academic-classes',
})
export class AcademicClassTable extends Model<
    SequelizeAcademicClass,
    SequelizeAcademicClassCreate
> {
    @AllowNull(false)
    @NotEmpty
    @Column
    public declare courseName: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataTypes.STRING)
    public declare schedulePeriod: string;
}

@Table({
    tableName: 'organizations',
    modelName: 'organizations',
})
export class OrganizationTable extends Model<SequelizeOrganization> {
    public declare address: AddressTable;

    @AllowNull(false)
    @Unique
    @Column
    public declare cnpj: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare corporateName: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare businessName: string;

    @AllowNull(false)
    @Column
    public declare phone1: string;

    @Column
    public declare phone2?: string;

    @Column
    public declare website?: string;

    @Column
    public declare whatsapp?: string;
}

@Table({
    tableName: 'addresses',
    modelName: 'addresses',
})
export class AddressTable extends Model<SequelizeAddress> {
    @AllowNull(false)
    @NotEmpty
    @Column
    public declare street: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare city: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare district: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare postalCode: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare state: string;

    @Column
    public declare number?: string;

    @Column
    public declare additionalInfo?: string;
}

@Table({
    tableName: 'internship-schedules',
    modelName: 'internship-schedules',
})
export class InternshipScheduleTable extends Model<
    SequelizeInternshipSchedule,
    SequelizeInternshipScheduleCreate
> {
    public declare internship: InternshipTable;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare description: string;
}

@Table({
    tableName: 'internships',
    modelName: 'internships',
})
export class InternshipTable extends Model<
    SequelizeInternship,
    SequelizeInternshipCreate
> {
    public declare student: StudentTable;
    public declare supervisor: SupervisorTable;
    public declare organization: OrganizationTable;
    public declare schedule: InternshipSchedule[];

    @AllowNull(false)
    @NotEmpty
    @Column(DataTypes.STRING)
    public declare status: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare division: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare classification: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare monthlyStipend: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare transportationAid: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare workSituation: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare periodStartDate: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare periodExpectedEndDate: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare organizationSupervisorName: string;

    @AllowNull(false)
    @NotEmpty
    @Validate({ isEmail: true })
    @Column
    public declare organizationSupervisorEmail: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare organizationSupervisorPosition: string;
}
