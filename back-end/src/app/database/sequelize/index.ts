import sequelize, { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseConnection } from '..';
import { SearchStudentsDto } from '../../../dtos/student';
import { AccessToken } from '../../../models/access-token';
import { Admin } from '../../../models/admin';
import { ResetPasswordToken } from '../../../models/reset-password-token';
import { Student } from '../../../models/student';
import { Supervisor } from '../../../models/supervisor';
import { User } from '../../../models/user';
import { UserRole } from '../../../models/user-role';
import config from '../../config';
import { DatabaseError } from '../../errors';
import {
    mapSequelizeAccessTokenToModel,
    mapSequelizeAdminToModel,
    mapSequelizeResetPasswordTokenToModel,
    mapSequelizeStudentToModel,
    mapSequelizeSupervisorToModel,
    mapSequelizeUserToModel,
} from './mappers';
import {
    AccessTokenTable,
    AdminTable,
    ResetPasswordTable,
    StudentTable,
    SupervisorTable,
    UserTable,
} from './tables';

export class SequelizeDatabaseConnection implements DatabaseConnection {
    private static models = [
        UserTable,
        AccessTokenTable,
        AdminTable,
        SupervisorTable,
        StudentTable,
        ResetPasswordTable,
    ];
    private static sequelize: Sequelize;
    private _error?: sequelize.DatabaseError;
    private set error(err: sequelize.DatabaseError) {
        config.external.logger(err.message);
        this._error = err;
    }

    constructor() {
        if (config.project.environment === 'production') {
            this.sequelize = new Sequelize(config.project.databaseUrl);
            return;
        }

        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            repositoryMode: false,
            pool:
                config.project.environment !== 'test'
                    ? {
                          max: 5,
                          min: 0,
                          acquire: 3000,
                          idle: 1000,
                      }
                    : undefined,
        });
    }

    async saveNewResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        try {
            const model = await ResetPasswordTable.create({
                email,
                token,
            });

            const entity = mapSequelizeResetPasswordTokenToModel(model);

            return entity;
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }

    async findValidResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        try {
            const model = await ResetPasswordTable.findOne({
                where: {
                    email,
                    token,
                },
            });

            // token não encontrado
            if (!model) return;
            const now = new Date();

            // token expirado
            if (model.expiredAt) return;
            if (now > model.expiresAt) return;

            return mapSequelizeResetPasswordTokenToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }

    async invalidateResetPasswordToken(
        token: string
    ): Promise<ResetPasswordToken | undefined> {
        try {
            const model = await ResetPasswordTable.findOne({
                where: { token },
            });

            if (!model) return;

            await model.update({ expiredAt: new Date() });

            return mapSequelizeResetPasswordTokenToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }

    async updateUserPasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<User | undefined> {
        try {
            const model = await UserTable.findOne({
                where: { email },
            });

            if (!model) return;

            await model.update({ password: newPassword });

            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }

    async saveNewAdmin(admin: Admin): Promise<Admin | undefined> {
        try {
            admin.user.role = UserRole.Adm;

            const model = await AdminTable.create(admin, {
                include: [UserTable],
            });

            const entity = mapSequelizeAdminToModel(model);

            return entity;
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async getAdmins(): Promise<Admin[]> {
        try {
            const admins = await AdminTable.findAll({
                include: [UserTable],
            });

            return admins.map(mapSequelizeAdminToModel);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
            return [];
        }
    }
    async findAdminByNameOrEmail(
        nameOrEmail: string
    ): Promise<Admin | undefined> {
        try {
            const model = await AdminTable.findOne({
                where: {
                    [Op.or]: [
                        { name: nameOrEmail },
                        { '$user.email$': nameOrEmail },
                    ],
                },
                include: [UserTable],
            });

            if (!model) return;

            return mapSequelizeAdminToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async saveNewSupervisor(
        supervisor: Supervisor
    ): Promise<Supervisor | undefined> {
        try {
            supervisor.user.role = UserRole.Supervisor;

            const model = await SupervisorTable.create(supervisor, {
                include: [UserTable],
            });

            const entity = mapSequelizeSupervisorToModel(model);

            return entity;
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async findSupervisorByEmail(
        email: string
    ): Promise<Supervisor | undefined> {
        try {
            const model = await SupervisorTable.findOne({
                where: {
                    [Op.or]: [{ '$user.email$': email }],
                },
                include: [UserTable],
            });

            if (!model) return;

            return mapSequelizeSupervisorToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async saveNewStudent(student: Student): Promise<Student | undefined> {
        try {
            student.user.role = UserRole.Student;

            const model = await StudentTable.create(student, {
                include: [UserTable],
            });

            const entity = mapSequelizeStudentToModel(model);

            return entity;
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async findStudentByEmail(email: string): Promise<Student | undefined> {
        try {
            const model = await StudentTable.findOne({
                where: {
                    [Op.or]: [{ '$user.email$': email }],
                },
                include: [UserTable],
            });

            if (!model) return;

            return mapSequelizeStudentToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async searchStudents(
        data: SearchStudentsDto
    ): Promise<Student[] | undefined> {
        try {
            // TODO: limit and offset
            const models = await StudentTable.findAll({
                where: Sequelize.where(
                    Sequelize.fn(
                        'concat',
                        Sequelize.col('user.email'),
                        '%',
                        Sequelize.col('students.fullName')
                    ),
                    {
                        [Op.like]: `%${data.searchTerm}%`,
                    }
                ),
                include: [UserTable],
            });

            return models.map(mapSequelizeStudentToModel);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async saveNewAccessToken(
        token: string,
        userId: number
    ): Promise<AccessToken | undefined> {
        try {
            const model = await AccessTokenTable.create({
                token,
                userId,
            });

            return mapSequelizeAccessTokenToModel(model, true);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async invalidateAccessToken(
        token: string
    ): Promise<AccessToken | undefined> {
        try {
            const model = await AccessTokenTable.findOne({
                where: { token },
                include: [UserTable],
            });

            if (!model) return;

            await model.update({ expiredAt: new Date() });

            return mapSequelizeAccessTokenToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async findUserByValidAccessToken(token: string): Promise<User | undefined> {
        try {
            const model = await AccessTokenTable.findOne({
                where: { token },
                include: [UserTable],
            });

            // token não encontrado
            if (!model) return;
            const now = new Date();

            // token expirado
            if (model.expiredAt) return;
            if (now > model.expiresAt) {
                await model.update({ expiredAt: now });
                return;
            }

            return mapSequelizeUserToModel(model.user);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async findUserById(id: number): Promise<User | undefined> {
        try {
            const model = await UserTable.findByPk(id);
            if (!model) return;
            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async findUserByEmail(email: string): Promise<User | undefined> {
        try {
            const model = await UserTable.findOne({ where: { email } });
            if (!model) return;
            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }
    async verifyIfEmailIsInUse(email: string): Promise<boolean | undefined> {
        try {
            const result = await UserTable.findAndCountAll({
                where: { email },
            });
            return result.count > 0;
        } catch (err) {
            this.error = err as sequelize.DatabaseError;
        }
    }

    async init(): Promise<void> {
        try {
            if (!this.sequelize)
                throw new Error(config.messages.databaseImplNotDefined);

            this.sequelize.addModels(SequelizeDatabaseConnection.models);

            // user and user-tokens association
            AccessTokenTable.belongsTo(UserTable);
            UserTable.hasMany(AccessTokenTable);

            // user and admin association
            AdminTable.belongsTo(UserTable);
            UserTable.hasOne(AdminTable);

            // user and supervisor association
            SupervisorTable.belongsTo(UserTable);
            UserTable.hasOne(SupervisorTable);

            // user and student association
            StudentTable.belongsTo(UserTable);
            UserTable.hasOne(StudentTable);

            // sync
            if (config.project.environment !== 'production')
                await this.sequelize.sync();

            await this.sequelize.authenticate();
        } catch (err) {
            const customError = err as sequelize.DatabaseError;
            customError.message = `Unable to connect to the database: ${customError.message}`;
            throw customError;
        }
    }

    getError(): DatabaseError | undefined {
        if (!this._error) return;
        return DatabaseError.fromSequelizeDatabaseError(this._error);
    }

    throwIfHasError(): undefined | never {
        const error = this.getError();
        if (!error) return;
        throw error;
    }

    getConnection() {
        return this.sequelize;
    }

    private get sequelize() {
        return SequelizeDatabaseConnection.sequelize;
    }

    private set sequelize(seq: Sequelize) {
        SequelizeDatabaseConnection.sequelize = seq;
    }
}
