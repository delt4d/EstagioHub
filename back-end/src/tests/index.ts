import { randomUUID } from 'crypto';
import supertest, { Response } from 'supertest';
import { Admin } from '../models/admin';
import { Student } from '../models/student';
import { Supervisor } from '../models/supervisor';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import app from '../modules';
import { deepMerge, DeepPartial, toResult } from '../modules/utils';
import adminService from '../services/admin';
import hashService from '../services/hash';
import studentService from '../services/student';
import supervisorService from '../services/supervisor';
import tokenService from '../services/token';

const accessToken = randomUUID();
const resetPasswordToken = randomUUID();

jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue(accessToken);
jest.spyOn(tokenService, 'generateResetPasswordToken').mockReturnValue(
    resetPasswordToken
);

export const requestWithSupertest = supertest(app);

const expectAuthResponseCookies = (res: Response) => {
    const cookies = res.headers['set-cookie'];
    const isArray = Array.isArray(cookies);

    expect(isArray).toBe(true);

    for (let key of ['token=' + accessToken, 'HttpOnly']) {
        expect(cookies[0]).toContain(key);
    }
};

const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const expectPromiseNotToReject = async <T>(promise: Promise<T>) => {
    const result = await toResult(promise).resolveAsync();
    expect(result.isSuccess).toBe(true);
    return result.orElseThrow();
};

const expectPromiseNotToBeUndefined = async <T>(promise: Promise<T>) => {
    const result = await toResult(promise).resolveAsync();
    expect(result.isSuccess).toBe(true);
    expect(result.value).not.toBeUndefined();
    return result.orElseThrow() as Exclude<T, undefined>;
};

const requests = {
    user: {
        me(token?: string) {
            return requestWithSupertest
                .get(`/api/v1/user/me?access_token=${token}`)
                .send();
        },
        forgotPassword(email: string) {
            return requestWithSupertest
                .post('/api/v1/user/forgot-password')
                .send({ email });
        },
        resetPasswordToken(data: {
            email: string;
            token: string;
            newPassword: string;
        }) {
            return requestWithSupertest
                .post('/api/v1/user/reset-password')
                .send({
                    email: data.email,
                    token: data.token,
                    newPassword: data.newPassword,
                });
        },
    },
    admin: {
        login(nameOrEmail: string, password: string) {
            return requestWithSupertest.post('/api/v1/admin/login').send({
                nameOrEmail,
                password,
            });
        },
    },
    supervisor: {
        login(email: string, password: string) {
            return requestWithSupertest.post('/api/v1/supervisor/login').send({
                email,
                password,
            });
        },
        register(data: {
            name: string;
            email: string;
            password: string;
            repeatPassword: string;
        }) {
            return requestWithSupertest
                .post('/api/v1/supervisor/register')
                .send({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    repeatPassword: data.repeatPassword,
                });
        },
    },
    student: {
        login(email: string, password: string) {
            return requestWithSupertest.post('/api/v1/student/login').send({
                email,
                password,
            });
        },
        register(data: {
            fullName: string;
            email: string;
            password: string;
            repeatPassword: string;
        }) {
            return requestWithSupertest.post('/api/v1/student/register').send({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                repeatPassword: data.repeatPassword,
            });
        },
    },
    logout(token: string) {
        return requestWithSupertest
            .delete(`/api/v1/logout?access_token=${token}`)
            .send();
    },
};

const services = {
    admin: {
        async saveNewAdmin(admin: Admin) {
            return await adminService.saveNewAdmin({ ...admin });
        },
    },
    student: {
        async saveNewStudent(student: Student) {
            return await studentService.saveNewStudent({ ...student });
        },
    },
    supervisor: {
        async saveNewSupervisor(supervisor: Supervisor) {
            return await supervisorService.saveNewSupervisor({ ...supervisor });
        },
    },
};

const models = {
    custom<T>(data: T, replace: DeepPartial<T>): T {
        return deepMerge(data, replace);
    },

    get defaultAdmin(): Admin {
        return {
            name: 'defaultAdminName123',
            user: {
                email: 'admin_email@email.com',
                password: 'adminPassword123*',
                role: UserRole.Adm,
            },
        };
    },

    async getAdminWithEncryptedPasswordAsync(admin: Admin | undefined) {
        expect(admin).not.toBeUndefined();
        return this.custom<Admin>(admin!, {
            user: {
                password: await hashService.encryptPasswordAsync(
                    admin!.user.password
                ),
            },
        });
    },

    getAdminWithoutPassword(admin: Admin | undefined) {
        expect(admin).not.toBeUndefined();
        return {
            ...admin,
            user: getUserWithoutPassword(admin!.user),
        };
    },

    get alternativeAdmin(): Admin {
        return {
            name: 'differentName23',
            user: {
                email: 'differentEmail23@email.com',
                password: 'different_Password 123',
                role: UserRole.Adm,
            },
        };
    },

    get defaultSupervisor(): Supervisor {
        return {
            name: 'Supervisor Name',
            user: {
                email: 'supervisor_name79@email.com',
                password: 'supervisor-123pass__word',
                role: UserRole.Supervisor,
            },
        };
    },

    get alternativeSupervisor(): Supervisor {
        return {
            name: 'Different Supervisor Name',
            user: {
                email: 'anothersupervisor_name123@email.com',
                password: 'anothersupervisor123Password*',
                role: UserRole.Supervisor,
            },
        };
    },

    async getSupervisorWithEncryptedPasswordAsync(
        supervisor: Supervisor | undefined
    ) {
        expect(supervisor).not.toBeUndefined();
        return this.custom<Supervisor>(supervisor!, {
            user: {
                password: await hashService.encryptPasswordAsync(
                    supervisor!.user.password
                ),
            },
        });
    },

    getSupervisorWithoutPassword(supervisor: Supervisor | undefined) {
        expect(supervisor).not.toBeUndefined();
        return {
            ...supervisor,
            user: getUserWithoutPassword(supervisor!.user),
        };
    },

    get defaultStudent(): Student {
        return {
            fullName: 'Student Name',
            user: {
                email: 'student_name79@email.com',
                password: 'student-123pass__word',
                role: UserRole.Student,
            },
        };
    },

    get alternativeStudent(): Student {
        return {
            fullName: 'Different Student Name',
            user: {
                email: 'anotherStudent_name123@email.com',
                password: 'anotherStudent123Password*',
                role: UserRole.Student,
            },
        };
    },

    async getStudentWithEncryptedPasswordAsync(student: Student | undefined) {
        expect(student).not.toBeUndefined();
        return this.custom<Student>(student!, {
            user: {
                password: await hashService.encryptPasswordAsync(
                    student!.user.password
                ),
            },
        });
    },

    getStudentWithoutPassword(student: Student | undefined) {
        expect(student).not.toBeUndefined();
        return {
            ...student,
            user: getUserWithoutPassword(student!.user),
        };
    },
};

const testing = Object.freeze({
    resetPasswordToken,
    accessToken,
    models,
    services,
    requests,
    expectAuthResponseCookies,
    expectPromiseNotToReject,
    expectPromiseNotToBeUndefined,
});

export default testing;
