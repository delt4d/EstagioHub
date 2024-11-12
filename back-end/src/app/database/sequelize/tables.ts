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
import { Admin } from '../../../models/admin';
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
    @IsLowercase
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
    @IsLowercase
    @Column
    public declare name: string;
}

@Table({
    tableName: 'students',
    modelName: 'students',
})
export class StudentTable extends Model<SequelizeStudent, StudentCreate> {
    public declare user: UserTable;

    @Index
    @NotEmpty
    @AllowNull(false)
    @IsLowercase
    @Column
    public declare fullName: string;
}
