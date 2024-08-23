import {
    Model,
    Column,
    DeletedAt,
    Table,
    PrimaryKey,
    AutoIncrement,
    Length,
    Index,
    Validate,
    AllowNull,
    HasMany,
    HasOne,
} from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
import { SequelizeAdmin } from './admin';
import { User, UserRole, UserRoleValues } from '../../user/model';
import { SequelizeUserToken } from './tokens';
import validation from '../../config/validation';

type LocalUser = User;

export type SequelizeUserCreation = Optional<LocalUser, 'id'>;

@Table({
    tableName: 'users',
})
export class SequelizeUser extends Model<LocalUser, SequelizeUserCreation> {
    @PrimaryKey
    @AutoIncrement
    @Column
    public declare id: number;

    @Index
    @AllowNull(false)
    @Validate({
        isEmail: {
            msg: 'Este não é um email válido',
        },
    })
    @Column
    public declare email: string;

    @Column(DataTypes.ENUM(...UserRoleValues))
    public declare role: UserRole;

    @Length({
        min: validation.minPasswordLength,
        msg: 'A senha deve ter no mínimo 8 caracteres',
    })
    @Column
    public declare password: string;

    @DeletedAt
    @Column
    public deletedAt?: Date;

    @HasMany(() => SequelizeUserToken)
    public declare Tokens: SequelizeUserToken[];

    @HasOne(() => SequelizeAdmin)
    public declare Admin: SequelizeAdmin;
}
