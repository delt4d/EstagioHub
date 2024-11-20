import { SearchInternshipsDto } from '../../dtos/internship';
import { SearchStudentsDto } from '../../dtos/student';
import { AccessToken } from '../../models/access-token';
import { Admin } from '../../models/admin';
import { Internship } from '../../models/internship';
import { ResetPasswordToken } from '../../models/reset-password-token';
import { Student } from '../../models/student';
import { Supervisor } from '../../models/supervisor';
import { User } from '../../models/user';
import { DatabaseError } from '../errors';
import { SequelizeDatabaseConnection } from './sequelize';

export interface DatabaseConnection {
    /// Error handling
    getError(): DatabaseError | undefined;
    throwIfHasError(): undefined | never;

    /// Admin-related operations
    // cadastrar novo admin
    saveNewAdmin(admin: Admin): Promise<Admin | undefined>;
    // obter todos os admins
    getAdmins(): Promise<Admin[]>;
    // obter um administrador pelo nome ou email
    findAdminByNameOrEmail(nameOrEmail: string): Promise<Admin | undefined>;

    /// Supervisor-related operations
    // cadastrar novo orientador
    saveNewSupervisor(supervisor: Supervisor): Promise<Supervisor | undefined>;
    // obter orientador pelo id
    findSupervisorById(id: number): Promise<Supervisor | undefined>;
    // obter um orientador pelo email
    findSupervisorByEmail(email: string): Promise<Supervisor | undefined>;

    /// Student-related operations
    // cadastrar novo aluno
    saveNewStudent(student: Student): Promise<Student | undefined>;
    // obter um estudante pelo id
    findStudentById(id: number): Promise<Student | undefined>;
    // obter um estudante pelo email
    findStudentByEmail(email: string): Promise<Student | undefined>;
    // obter usuários à partir de uma busca e paginição
    searchStudents(data: SearchStudentsDto): Promise<Student[] | undefined>;
    // verifica se o estudante está estágiando
    verifyStudentIsInterning(studentId: number): Promise<boolean | undefined>;

    /// User-related operations
    // obter um usuário pelo id
    findUserById(id: number): Promise<User | undefined>;
    // obter um usuário pelo email
    findUserByEmail(email: string): Promise<User | undefined>;
    // verificar se um email está em uso
    verifyIfEmailIsInUse(email: string): Promise<boolean | undefined>;
    // obter um usuário por um user-token válido
    findUserByValidAccessToken(token: string): Promise<User | undefined>;
    // atualizar senha pelo email
    saveUserPasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<User | undefined>;

    /// Token-related operations
    // cadastrar um novo user-token
    saveNewAccessToken(
        token: string,
        userid: number
    ): Promise<AccessToken | undefined>;
    // invalidar um user-token
    invalidateAccessToken(token: string): Promise<AccessToken | undefined>;
    // salvar reset-password token
    saveNewResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined>;
    // obter reset-password token não expirado
    findValidResetPasswordToken(
        email: string,
        token: string
    ): Promise<ResetPasswordToken | undefined>;
    // invalidar reset-password token
    invalidateResetPasswordToken(
        token: string
    ): Promise<ResetPasswordToken | undefined>;

    /// Internship-related operations
    // cadastrar um novo estágio
    saveNewInternship(
        internship: Omit<Internship, 'status'>
    ): Promise<Internship | undefined>;
    // atualizar um estágio
    saveInternship(
        id: number,
        data: Partial<Internship>
    ): Promise<Internship | undefined>;
    // obter estágio por id
    findInternshipById(id: number): Promise<Internship | undefined>;
    // obter estágios à partir de uma busca e paginção
    searchInternships(
        data: SearchInternshipsDto
    ): Promise<Internship[] | undefined>;
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
