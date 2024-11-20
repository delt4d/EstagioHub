import { Op, DatabaseError as SequelizeDatabaseError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseConnection } from '..';
import { InSearchInternshipsDto } from '../../../dtos/internship';
import { SearchStudentsDto } from '../../../dtos/student';
import { AccessToken } from '../../../models/access-token';
import { Admin } from '../../../models/admin';
import { Internship, InternshipStatus } from '../../../models/internship';
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
    mapSequelizeInternshipToModel,
    mapSequelizeResetPasswordTokenToModel,
    mapSequelizeStudentToModel,
    mapSequelizeSupervisorToModel,
    mapSequelizeUserToModel,
} from './mappers';
import {
    AcademicClassTable,
    AccessTokenTable,
    AddressTable,
    AdminTable,
    InternshipScheduleTable,
    InternshipTable,
    OrganizationTable,
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
        AcademicClassTable,
        AddressTable,
        OrganizationTable,
        InternshipTable,
        InternshipScheduleTable,
    ];
    private static sequelize: Sequelize;
    private _error?: SequelizeDatabaseError;
    private set error(err: SequelizeDatabaseError) {
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
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
        }
    }

    async saveUserPasswordByEmail(
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
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
        }
    }
    async getAdmins(): Promise<Admin[]> {
        try {
            const admins = await AdminTable.findAll({
                include: [UserTable],
            });

            return admins.map(mapSequelizeAdminToModel);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
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
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('name')),
                            nameOrEmail.toLowerCase()
                        ),
                        { '$user.email$': nameOrEmail.toLowerCase() },
                    ],
                },
                include: [UserTable],
            });

            if (!model) return;

            return mapSequelizeAdminToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
        }
    }
    async findSupervisorById(id: number): Promise<Supervisor | undefined> {
        try {
            const model = await SupervisorTable.findByPk(id, {
                include: [UserTable],
            });

            if (!model) return;

            return mapSequelizeSupervisorToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
        }
    }
    async findStudentById(id: number): Promise<Student | undefined> {
        try {
            const model = await StudentTable.findByPk(id, {
                include: [UserTable],
            });

            if (!model) return;

            return mapSequelizeStudentToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
        }
    }
    async verifyStudentIsInterning(
        studentId: number
    ): Promise<boolean | undefined> {
        try {
            const internships = await InternshipTable.findAll({
                where: { studentId },
            });

            for (const internship of internships) {
                if (
                    !(
                        internship.status in
                        [
                            InternshipStatus.Canceled,
                            InternshipStatus.Closed,
                            InternshipStatus.Rejected,
                            InternshipStatus.Finished,
                        ]
                    )
                ) {
                    return true;
                }
            }

            return false;
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }
    async searchStudents(
        data: SearchStudentsDto
    ): Promise<Student[] | undefined> {
        try {
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
                limit: data.limit,
                offset: data.offset,
            });

            return models.map(mapSequelizeStudentToModel);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
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
            this.error = err as SequelizeDatabaseError;
        }
    }
    async findUserById(id: number): Promise<User | undefined> {
        try {
            const model = await UserTable.findByPk(id);
            if (!model) return;
            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }
    async findUserByEmail(email: string): Promise<User | undefined> {
        try {
            const model = await UserTable.findOne({ where: { email } });
            if (!model) return;
            return mapSequelizeUserToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }
    async verifyIfEmailIsInUse(email: string): Promise<boolean | undefined> {
        try {
            const count = await UserTable.count({
                where: { email },
            });
            return count > 0;
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }
    async findInternshipById(id: number): Promise<Internship | undefined> {
        try {
            const model = await InternshipTable.findByPk(id, {
                include: [
                    {
                        model: StudentTable,
                        include: [UserTable, AddressTable],
                    },
                    {
                        model: SupervisorTable,
                        include: [UserTable],
                    },
                    OrganizationTable,
                    InternshipScheduleTable,
                ],
            });

            if (!model) return;

            return mapSequelizeInternshipToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }
    async saveNewInternship(
        internship: Omit<Internship, 'status'>
    ): Promise<Internship | undefined> {
        try {
            const model = await InternshipTable.create(
                {
                    // TODO: verify other fields to map
                    ...internship,
                    periodStartDate: internship.period.startDate,
                    periodExpectedEndDate: internship.period.expectedEndDate,
                    organizationSupervisorName:
                        internship.organizationSupervisor.name,
                    organizationSupervisorEmail:
                        internship.organizationSupervisor.email,
                    organizationSupervisorPosition:
                        internship.organizationSupervisor.position,
                    status: InternshipStatus.AwaitingInitialApproval,
                },
                {
                    include: [
                        InternshipScheduleTable,
                        {
                            model: OrganizationTable,
                            include: [AddressTable],
                        },
                    ],
                }
            );

            return mapSequelizeInternshipToModel(model, true);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }

    async saveInternship(
        id: number,
        data: Partial<Internship>
    ): Promise<Internship | undefined> {
        try {
            const model = await InternshipTable.findByPk(id, {
                include: [
                    InternshipScheduleTable,
                    OrganizationTable,
                    {
                        model: StudentTable,
                        include: [UserTable, AddressTable],
                    },
                    {
                        model: SupervisorTable,
                        include: [UserTable],
                    },
                ],
            });

            if (!model) return;
            if (data.status && data.status !== InternshipStatus.Closed) {
                data.internshipCloseReason = undefined;
            }

            await model.update(data);

            return mapSequelizeInternshipToModel(model);
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }

    async searchInternships(
        data: InSearchInternshipsDto
    ): Promise<Internship[] | undefined> {
        try {
            const column = Sequelize.col;
            const models = await InternshipTable.findAll({
                where: Sequelize.where(
                    Sequelize.fn(
                        'concat',
                        column('student.fullName'),
                        '%',
                        column('student.user.email'),
                        '%',
                        column('supervisor.name'),
                        '%',
                        column('supervisor.user.email'),
                        '%',
                        column('internships.organizationSupervisorName'),
                        '%',
                        column('internships.organizationSupervisorEmail'),
                        '%',
                        column('internships.monthlyStipend'),
                        '%',
                        column('internships.division')
                    ),
                    {
                        [Op.like]: `%${data.searchTerm}%`,
                    }
                ),
                subQuery: false,
                include: [
                    InternshipScheduleTable,
                    OrganizationTable,
                    {
                        model: StudentTable,
                        include: [UserTable, AddressTable],
                    },
                    {
                        model: SupervisorTable,
                        include: [UserTable],
                    },
                ],
                limit: data.limit,
                offset: data.offset,
            });

            return models.map((m) => mapSequelizeInternshipToModel(m));
        } catch (err) {
            this.error = err as SequelizeDatabaseError;
        }
    }

    async init(): Promise<void> {
        try {
            if (!this.sequelize)
                throw new Error(config.messages.databaseImplNotDefined);

            this.sequelize.addModels(SequelizeDatabaseConnection.models);

            UserTable.addHook('beforeValidate', (model) => {
                model.set('email', model.getDataValue('email').toLowerCase());
            });

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

            // student and address association
            StudentTable.belongsTo(AddressTable);
            AddressTable.hasMany(StudentTable);

            // student and academic-class association
            StudentTable.belongsTo(AcademicClassTable);
            AcademicClassTable.hasMany(StudentTable);

            // organization and address association
            OrganizationTable.belongsTo(AddressTable);
            AddressTable.hasMany(OrganizationTable);

            // internship and student association
            InternshipTable.belongsTo(StudentTable);
            StudentTable.hasMany(InternshipTable);

            // internship and supervisor association
            InternshipTable.belongsTo(SupervisorTable);
            SupervisorTable.hasMany(InternshipTable);

            // internship and organization association
            InternshipTable.belongsTo(OrganizationTable);
            OrganizationTable.hasMany(InternshipTable);

            // internship-schedule and internship association
            InternshipScheduleTable.belongsTo(InternshipTable);
            InternshipTable.hasMany(InternshipScheduleTable);

            // sync
            if (config.project.environment !== 'production')
                await this.sequelize.sync();

            await this.sequelize.authenticate();
        } catch (err) {
            const customError = err as SequelizeDatabaseError;
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
