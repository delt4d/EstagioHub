import { AccessToken } from '../../models/access-token';
import { Admin, AdminCollection } from '../../models/admin';
import { ResetPasswordToken } from '../../models/reset-password-token';
import { Student } from '../../models/student';
import { Supervisor } from '../../models/supervisor';
import { User } from '../../models/user';
import { UnhandledError } from '../errors';
import { SequelizeDatabaseConnection } from './sequelize';

export interface DatabaseConnection {
    getError(): UnhandledError | undefined;

    throwIfHasError(): undefined;

    // cadastrar novo admin
    saveNewAdmin(admin: Admin): Promise<Admin | undefined>;

    // cadastrar novo orientador
    saveNewSupervisor(supervisor: Supervisor): Promise<Supervisor | undefined>;

    // cadastrar novo aluno
    saveNewStudent(student: Student): Promise<Student | undefined>;

    // cadastrar um novo user-token
    saveNewAccessToken(
        token: string,
        userid: number
    ): Promise<AccessToken | undefined>;

    // salvar reset-password token
    saveNewResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined>;

    // obter todos os admins
    getAdmins(): Promise<AdminCollection>;

    // obter um usuário pelo id
    findUserById(id: number): Promise<User | undefined>;

    // obter um usuário pelo email
    findUserByEmail(email: string): Promise<User | undefined>;

    // verificar se um email está em uso
    verifyIfEmailIsInUse(email: string): Promise<boolean | undefined>;

    // obter um usuário por um user-token válido
    findUserByValidAccessToken(token: string): Promise<User | undefined>;

    // obter um administrador pelo nome ou email
    findAdminByNameOrEmail(nameOrEmail: string): Promise<Admin | undefined>;

    // obter um orientador pelo email
    findSupervisorByEmail(email: string): Promise<Supervisor | undefined>;

    // obter um estudente pelo email
    findStudentByEmail(email: string): Promise<Student | undefined>;

    // obter reset-password token não expirado
    findValidResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined>;

    // invalidar um user-token
    invalidateAccessToken(token: string): Promise<AccessToken | undefined>;

    // invalidar reset-password token
    invalidateResetPasswordToken(
        token: string
    ): Promise<ResetPasswordToken | undefined>;

    // atualizar senha
    updateUserPasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<User | undefined>;
}

export class DatabaseResolver {
    private static initialized = false;

    public static async reset() {
        this.initialized = false;
    }

    public static async getConnection(): Promise<DatabaseConnection> {
        try {
            const conn = new SequelizeDatabaseConnection();

            if (!this.initialized) {
                await conn.init();
                this.initialized = true;
            }

            return conn;
        } catch (err) {
            const customError = err as Error;
            const message =
                'Unable to connect to database: ' + customError.message;
            customError.message = message;
            throw customError;
        }
    }
}
