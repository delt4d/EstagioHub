import timekeeper from 'timekeeper';
import testing from '.';
import { DatabaseConnection, DatabaseResolver } from '../app/database';
import { pick } from '../app/utils';

let dbConn: DatabaseConnection;

describe('database', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
        dbConn = await DatabaseResolver.getConnection();
        dbConn.throwIfHasError();
    });

    afterEach(() => {
        expect(dbConn.getError()).not.toBe(Error);
        DatabaseResolver.reset();
        timekeeper.reset();
    });

    describe('admin', () => {
        // should save a new admin
        it('should save a new admin', async () => {
            const expectedResult = {
                admin: testing.models.defaultAdmin,
            };
            const admin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            expect(admin).toMatchObject(expectedResult.admin);
        });

        // should not save an admin with duplicated name
        it('should not save a new admin with duplicated name', async () => {
            const expectedResult = {
                firstAdmin: testing.models.defaultAdmin,
            };
            const firstAdmin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            const adminWithDuplicatedName = await dbConn.saveNewAdmin(
                testing.models.custom(testing.models.defaultAdmin, {
                    user: {
                        email: testing.models.alternativeAdmin.user.email,
                    },
                })
            );
            expect(firstAdmin).toMatchObject(expectedResult.firstAdmin);
            expect(adminWithDuplicatedName).toBeUndefined();
        });

        // should not save an admin with duplicated email
        it('should not save a new admin with duplicated name', async () => {
            const expectedResult = {
                firstAdmin: testing.models.defaultAdmin,
            };
            const firstAdmin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            const adminWithDuplicatedName = await dbConn.saveNewAdmin(
                testing.models.custom(testing.models.defaultAdmin, {
                    name: testing.models.alternativeAdmin.name,
                })
            );
            expect(firstAdmin).toMatchObject(expectedResult.firstAdmin);
            expect(adminWithDuplicatedName).toBeUndefined();
        });

        // should find an admin by name
        it('should find admin by name', async () => {
            const expectedResult = {
                savedAdmin: testing.models.defaultAdmin,
            };
            const savedAdmin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            const foundAdmin = await dbConn.findAdminByNameOrEmail(
                testing.models.defaultAdmin.name
            );
            expect(savedAdmin).toMatchObject(expectedResult.savedAdmin);
            expect(foundAdmin).not.toBeUndefined();
        });

        // should find an admin by email
        it('should find admin by email', async () => {
            const expectedResult = {
                savedAdmin: testing.models.defaultAdmin,
            };
            const savedAdmin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            const foundAdmin = await dbConn.findAdminByNameOrEmail(
                testing.models.defaultAdmin.user.email
            );
            expect(savedAdmin).toMatchObject(expectedResult.savedAdmin);
            expect(foundAdmin).not.toBeUndefined();
        });

        // should not find an admin with wrong name
        it('should not find admin with wrong name', async () => {
            const expectedResult = {
                savedAdmin: testing.models.defaultAdmin,
            };
            const savedAdmin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            const admin = await dbConn.findAdminByNameOrEmail(
                testing.models.alternativeAdmin.name
            );
            expect(savedAdmin).toMatchObject(expectedResult.savedAdmin);
            expect(admin).toBeUndefined();
        });

        // should not find an admin with wrong email
        it('should not find admin with wrong email', async () => {
            const expectedResult = {
                savedAdmin: testing.models.defaultAdmin,
            };
            const savedAdmin = await dbConn.saveNewAdmin(
                testing.models.defaultAdmin
            );
            const admin = await dbConn.findAdminByNameOrEmail(
                testing.models.alternativeAdmin.user.email
            );
            expect(savedAdmin).toMatchObject(expectedResult.savedAdmin);
            expect(admin).toBeUndefined();
        });
    });

    describe('supervisor', () => {
        // should find a supervisor by id
        it('should find a supervisor by id', async () => {
            const expectedResult = {
                createdSupervisor: testing.models.defaultSupervisor,
                foundUser: testing.models.defaultSupervisor.user,
            };
            const createdSupervisor =
                await testing.expectPromiseNotToBeUndefined(
                    dbConn.saveNewSupervisor(testing.models.defaultSupervisor)
                );
            const foundSupervisor = await dbConn.findUserById(
                createdSupervisor.id!
            );
            expect(createdSupervisor).toMatchObject(
                expectedResult.createdSupervisor
            );
            expect(foundSupervisor).toMatchObject(expectedResult.foundUser);
        });

        // should save a new supervisor
        it('should save a new supervisor', async () => {
            const expectedResult = {
                supervisor: testing.models.defaultSupervisor,
            };
            const supervisor = await dbConn.saveNewSupervisor(
                testing.models.defaultSupervisor
            );
            expect(supervisor).toMatchObject(expectedResult.supervisor);
        });

        // should not save a new supervisor with duplicated email
        it('should not save a new supervisor with duplicated email', async () => {
            const expectedResult = {
                supervisor: testing.models.defaultSupervisor,
            };
            const supervisor = await dbConn.saveNewSupervisor(
                testing.models.defaultSupervisor
            );
            const supervisorWithDuplicatedEmail =
                await dbConn.saveNewSupervisor(
                    testing.models.defaultSupervisor
                );
            expect(supervisor).toMatchObject(expectedResult.supervisor);
            expect(supervisorWithDuplicatedEmail).toBeUndefined();
        });

        // should find a supervisor by email
        it('should find a supervisor by email', async () => {
            const expectedResult = {
                supervisor: testing.models.defaultSupervisor,
            };
            const supervisor = await dbConn.saveNewSupervisor(
                testing.models.defaultSupervisor
            );
            const foundSupervisor = await dbConn.findSupervisorByEmail(
                testing.models.defaultSupervisor.user.email
            );
            expect(supervisor).toMatchObject(expectedResult.supervisor);
            expect(foundSupervisor).not.toBeUndefined();
        });

        // should not find a supervisor with wrong email
        it('should not find a supervisor with wrong email', async () => {
            const expectedResult = {
                supervisor: testing.models.defaultSupervisor,
            };
            const supervisor = await dbConn.saveNewSupervisor(
                testing.models.defaultSupervisor
            );
            const supervisorWithWrongEmail = await dbConn.findSupervisorByEmail(
                testing.models.alternativeSupervisor.user.email
            );
            expect(supervisor).toMatchObject(expectedResult.supervisor);
            expect(supervisorWithWrongEmail).toBeUndefined();
        });
    });

    describe('student', () => {
        // should find a student by id
        it('should find a student by id', async () => {
            const expectedResult = {
                student: pick(testing.models.defaultStudent, [
                    'fullName',
                    'user',
                ]),
            };
            const student = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewStudent(testing.models.defaultStudent)
            );
            const foundStudent = await dbConn.findUserById(student.id!);
            expect(student).toMatchObject(expectedResult.student);
            expect(foundStudent).not.toBeUndefined();
        });

        // should save a new student
        it('should save a new student', async () => {
            const expectedResult = {
                student: pick(testing.models.defaultStudent, [
                    'fullName',
                    'user',
                ]),
            };
            const student = await dbConn.saveNewStudent(
                testing.models.defaultStudent
            );
            expect(student).toMatchObject(expectedResult.student);
        });

        // should not save a new student with duplicated email
        it('should not save a new student with duplicated email', async () => {
            const expectedResult = {
                student: pick(testing.models.defaultStudent, [
                    'fullName',
                    'user',
                ]),
            };
            const student = await dbConn.saveNewStudent(
                testing.models.defaultStudent
            );
            const studentWithDuplicatedEmail = await dbConn.saveNewStudent(
                testing.models.defaultStudent
            );
            expect(student).toMatchObject(expectedResult.student);
            expect(studentWithDuplicatedEmail).toBeUndefined();
        });

        // should find a student by email
        it('should find a student by email', async () => {
            const expectedResult = {
                student: pick(testing.models.defaultStudent, [
                    'fullName',
                    'user',
                ]),
            };
            const student = await dbConn.saveNewStudent(
                testing.models.defaultStudent
            );
            const foundStudent = await dbConn.findStudentByEmail(
                testing.models.defaultStudent.user.email
            );
            expect(student).toMatchObject(expectedResult.student);
            expect(foundStudent).not.toBeUndefined();
        });

        // should not find a student with wrong email
        it('should not find a student with wrong email', async () => {
            const expectedResult = {
                student: pick(testing.models.defaultStudent, [
                    'fullName',
                    'user',
                ]),
            };
            const student = await dbConn.saveNewStudent(
                testing.models.defaultStudent
            );
            const studentWithWrongEmail = await dbConn.findStudentByEmail(
                testing.models.alternativeStudent.user.email
            );
            expect(student).toMatchObject(expectedResult.student);
            expect(studentWithWrongEmail).toBeUndefined();
        });
    });

    describe('access-token', () => {
        // should save a new access-token
        it('should save a new access-token', async () => {
            const expectedResult = {
                accessToken: {
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date;
                    })(),
                    expiredAt: undefined,
                },
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            const savedAccessToken = await dbConn.saveNewAccessToken(
                testing.accessToken,
                admin.user.id!
            );
            expect(savedAccessToken).toMatchObject(expectedResult.accessToken);
        });

        // should not save a new access-token with duplicated token
        it('should not save a new access-token with duplicated token', async () => {
            const expectedResult = {
                firstAccessToken: {
                    token: testing.accessToken,
                },
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            const firstAccessToken = await dbConn.saveNewAccessToken(
                testing.accessToken,
                admin.user.id!
            );
            const secondAccessToken = await dbConn.saveNewAccessToken(
                testing.accessToken,
                admin.user.id!
            );
            expect(firstAccessToken).toMatchObject(
                expectedResult.firstAccessToken
            );
            expect(secondAccessToken).toBeUndefined();
        });

        // should find an user by a valid access-token
        it('should find an user by a valid access-token', async () => {
            const expectedResult = {
                accessToken: {
                    token: testing.accessToken,
                },
                foundUser: testing.models.defaultAdmin.user,
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            const accessToken = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAccessToken(testing.accessToken, admin.user.id!)
            );
            const foundUser = await dbConn.findUserByValidAccessToken(
                testing.accessToken
            );
            expect(accessToken).toMatchObject(expectedResult.accessToken);
            expect(foundUser).toMatchObject(expectedResult.foundUser);
        });

        // should not find a user with an invalid access-token
        it('should not find a user with an invalid access-token', async () => {
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                // adding just for testing purpose
                dbConn.saveNewAccessToken(testing.accessToken, admin.user.id!)
            );
            const foundUser = await dbConn.findUserByValidAccessToken(
                'invalid_access_token'
            );
            expect(foundUser).toBeUndefined();
        });

        // should invalidate an access-token
        it('should invalidate an access-token', async () => {
            const expectedResult = {
                accessToken: {
                    token: testing.accessToken,
                    user: testing.models.defaultAdmin.user,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date;
                    })(),
                    expiredAt: new Date(),
                },
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                // adding just for testing purpose
                dbConn.saveNewAccessToken(testing.accessToken, admin.user.id!)
            );
            const accessToken = await dbConn.invalidateAccessToken(
                testing.accessToken
            );
            expect(accessToken).toMatchObject(expectedResult.accessToken);
        });

        // should not find a user with an invalidated access-token
        it('should not find a user with an invalidated access-token', async () => {
            const expectedResult = {
                accessToken: {
                    token: testing.accessToken,
                    user: testing.models.defaultAdmin.user,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date;
                    })(),
                    expiredAt: new Date(),
                },
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAccessToken(testing.accessToken, admin.user.id!)
            );
            const invalidatedAccessToken =
                await testing.expectPromiseNotToBeUndefined(
                    dbConn.invalidateAccessToken(testing.accessToken)
                );
            const user = await dbConn.findUserByValidAccessToken(
                testing.accessToken
            );
            expect(invalidatedAccessToken).toMatchObject(
                expectedResult.accessToken
            );
            expect(user).toBeUndefined();
        });
    });

    describe('reset-password-token', () => {
        // should save a new reset-password token
        it('should save a new reset-password token', async () => {
            const expectedResult = {
                email: testing.models.defaultAdmin.user.email,
                token: testing.resetPasswordToken,
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            const resetPasswordToken = await dbConn.saveNewResetPasswordToken(
                admin.user.email,
                testing.resetPasswordToken
            );
            expect(resetPasswordToken).toMatchObject(expectedResult);
        });

        // should find a reset-password token by valid token and email
        it('should find a reset-password token by valid token and email', async () => {
            const expectedResult = {
                email: testing.models.defaultAdmin.user.email,
                token: testing.resetPasswordToken,
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewResetPasswordToken(
                    admin.user.email,
                    testing.resetPasswordToken
                )
            );
            const resetPasswordToken = await dbConn.findValidResetPasswordToken(
                admin.user.email,
                testing.resetPasswordToken
            );
            expect(resetPasswordToken).toMatchObject(expectedResult);
        });

        // should not find a reset-password token with invalid email
        it('should not find a reset-password token with invalid email', async () => {
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewResetPasswordToken(
                    admin.user.email,
                    testing.resetPasswordToken
                )
            );
            const resetPasswordToken = await dbConn.findValidResetPasswordToken(
                testing.models.alternativeAdmin.user.email,
                testing.resetPasswordToken
            );
            expect(resetPasswordToken).toBeUndefined();
        });

        // should not find a reset-password token with invalid token
        it('should not find a reset-password token with invalid token', async () => {
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewResetPasswordToken(
                    admin.user.email,
                    testing.resetPasswordToken
                )
            );
            const resetPasswordToken = await dbConn.findValidResetPasswordToken(
                admin.user.email,
                'invalid_reset_password_token'
            );
            expect(resetPasswordToken).toBeUndefined();
        });

        // should invalidate a reset-password token
        it('should invalidate a reset-password token', async () => {
            const expectedResult = {
                email: testing.models.defaultAdmin.user.email,
                token: testing.resetPasswordToken,
            };
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewResetPasswordToken(
                    admin.user.email,
                    testing.resetPasswordToken
                )
            );
            const resetPasswordToken =
                await dbConn.invalidateResetPasswordToken(
                    testing.resetPasswordToken
                );
            expect(resetPasswordToken).toMatchObject(expectedResult);
        });

        // should not find a reset-password token with invalidated token
        it('should not find a reset-password token with invalidated token', async () => {
            const admin = await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewAdmin(testing.models.defaultAdmin)
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.saveNewResetPasswordToken(
                    admin.user.email,
                    testing.resetPasswordToken
                )
            );
            await testing.expectPromiseNotToBeUndefined(
                dbConn.invalidateResetPasswordToken(testing.resetPasswordToken)
            );
            const resetPasswordToken = await dbConn.findValidResetPasswordToken(
                admin.user.email,
                testing.resetPasswordToken
            );
            expect(resetPasswordToken).toBeUndefined();
        });
    });
});
