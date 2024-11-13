import { DataTypes, Optional } from 'sequelize';
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
import { Organization } from '../../../models/organization';
import { ResetPasswordToken } from '../../../models/reset-password-token';
import { Student } from '../../../models/student';
import { Supervisor } from '../../../models/supervisor';
import { User } from '../../../models/user';
import config from '../../config';

type SequelizeUser = User;
type SequelizeAdmin = Omit<Admin, 'user'> & { userId: number };
type SequelizeSupervisor = Omit<Supervisor, 'user'> & { userId: number };
type SequelizeStudent = Omit<Student, 'user'> & { userId: number };
type SequelizeAccessToken = Omit<AccessToken, 'user'> & {
    userId: number;
    expiredAt?: Date;
};
type SequelizeResetPasswordToken = ResetPasswordToken;

type UserCreate = Optional<SequelizeUser, 'id'>;
type AdminCreate = Omit<Optional<SequelizeAdmin, 'id'>, 'userId'>;
type SupervisorCreate = Omit<Optional<SequelizeSupervisor, 'id'>, 'userId'>;
type StudentCreate = Omit<Optional<SequelizeStudent, 'id'>, 'userId'>;
type AccessTokenCreate = Omit<
    SequelizeAccessToken,
    'id' | 'expiresAt' | 'expiredAt'
>;
type ResetPasswordCreate = Omit<
    SequelizeResetPasswordToken,
    'id' | 'expiresAt' | 'expiredAt'
>;

@Table({
    tableName: 'reset-password-tokens',
    modelName: 'reset-password-tokens',
})
export class ResetPasswordTable extends Model<
    SequelizeResetPasswordToken,
    ResetPasswordCreate
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
    AccessTokenCreate
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
export class UserTable extends Model<SequelizeUser, UserCreate> {
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
export class AdminTable extends Model<SequelizeAdmin, AdminCreate> {
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
    SupervisorCreate
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
export class StudentTable extends Model<SequelizeStudent, StudentCreate> {
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

    @AllowNull(true)
    @Column
    public declare addressId?: number;

    @AllowNull(true)
    @Column
    public declare academicClassId?: number;

    @AllowNull(true)
    @Column
    public declare academicId?: number;
}

@Table({
    tableName: 'academic-classes',
    modelName: 'academic-classes',
})
export class AcademicClassTable extends Model<AcademicClass> {
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
export class OrganizationTable extends Model<Organization> {
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

    @AllowNull(true)
    @Column
    public declare addressId?: number;
}

@Table({
    tableName: 'addresses',
    modelName: 'addresses',
})
export class AddressTable extends Model<Address> {
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
    tableName: 'internships',
    modelName: 'internships',
})
export class InternshipTable extends Model {
    public declare student: StudentTable;
    public declare supervisor: SupervisorTable;
    public declare organization: OrganizationTable;

    @AllowNull(false)
    @Column
    public declare studentId: number;

    @AllowNull(false)
    @Column
    public declare supervisorId: number;

    @AllowNull(false)
    @Column
    public declare organizationId: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare companySupervisorName: string;

    @AllowNull(false)
    @NotEmpty
    @Validate({
        isEmail: true,
    })
    @Column
    public declare companySupervisorEmail: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public declare companySupervisorPosition: string;
}
