import timekeeper from 'timekeeper';
import testing from '.';
import config from '../app/config';
import { DatabaseResolver } from '../app/database';
import { pick } from '../app/utils';
import { Student } from '../models/student';

describe('student', () => {
    beforeEach(async () => {
        timekeeper.freeze(new Date('2014-01-01'));
    });

    afterEach(() => {
        timekeeper.reset();
        DatabaseResolver.reset();
    });

    describe('POST /student/register', () => {
        // should register a new student
        it('should register a new student', async () => {
            const expectedResultValue = {
                registerStudentResponse: {
                    success: true,
                    message: config.messages.successfullRegister,
                },
            };
            await testing.requests.student['register']({
                email: testing.models.defaultStudent.user.email,
                fullName: testing.models.defaultStudent.fullName,
                password: testing.models.defaultStudent.user.password,
                repeatPassword: testing.models.defaultStudent.user.password,
            }).expect(expectedResultValue.registerStudentResponse);
        });

        // should not register when repeat-password does not match password
        it('should not register with wrong repeat-password', async () => {
            const expectedResultValue = {
                registerStudentResponse: {
                    success: false,
                    message: config.messages.wrongRepeatPassword,
                },
            };
            await testing.requests.student['register']({
                email: testing.models.defaultStudent.user.email,
                fullName: testing.models.defaultStudent.fullName,
                password: testing.models.defaultStudent.user.password,
                repeatPassword: 'wrong_repeat_password',
            }).expect(expectedResultValue.registerStudentResponse);
        });
    });

    describe('POST /student/login', () => {
        // should authenticate student
        it('should authenticate student', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    message: config.messages.successfullLogin,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                testing.models.defaultStudent.user.email,
                testing.models.defaultStudent.user.password
            ).expect(expectedResultValue.loginResponse);
        });

        // should not authenticate with wrong email
        it('should not authenticate with wrong email', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: false,
                    message: config.messages.studentNotFoundWithEmail,
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                'wrong_email@email.com',
                testing.models.defaultStudent.user.password
            ).expect(expectedResultValue.loginResponse);
        });

        // should not not authenticate with wrong password
        it('should not authenticate with wrong password', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: false,
                    message: config.messages.wrongPassword,
                },
            };
            await testing.expectPromiseNotToReject(
                // adding just for testing purpose
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                testing.models.defaultStudent.user.email,
                'wrong_password'
            ).expect(expectedResultValue.loginResponse);
        });
    });

    describe('GET /student', () => {
        // should not authorize get students when not authenticated
        it('should not authorize get students when not authenticated', async () => {
            const expectedResultValue = {
                loginResponse: 401,
            };
            await testing.requests.student['search']('', {
                limit: 10,
                searchTerm: '',
                offset: 0,
            }).expect(expectedResultValue.loginResponse);
        });

        // should not authorize get students when not authorized
        it('should not authorize get students when not authorized', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    message: config.messages.successfullLogin,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
                searchResponse: 403,
            };
            await testing.expectPromiseNotToReject(
                testing.services.student.saveNewStudent(
                    testing.models.defaultStudent
                )
            );
            await testing.requests.student['login'](
                testing.models.defaultStudent.user.email,
                testing.models.defaultStudent.user.password
            ).expect(expectedResultValue.loginResponse);
            await testing.requests.student['search'](testing.accessToken, {
                limit: 10,
                searchTerm: '',
                offset: 0,
            }).expect(expectedResultValue.searchResponse);
        });

        // should get 2 first students with limit
        it('should get 2 first students with limit', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    message: config.messages.successfullLogin,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
                searchStudentsResponse: {
                    searchTerm: '',
                    limit: 2,
                    offset: 0,
                    success: true,
                    students: [
                        pick(
                            testing.models.getStudentWithoutPassword(
                                testing.models.defaultStudent
                            ),
                            ['fullName', 'user']
                        ),
                        pick(
                            testing.models.getStudentWithoutPassword(
                                testing.models.alternativeStudent
                            ),
                            ['fullName', 'user']
                        ),
                    ],
                },
            };
            const students = [
                testing.models.defaultStudent,
                testing.models.alternativeStudent,
                testing.models.custom<Student>(testing.models.defaultStudent, {
                    fullName: 'student 3',
                    user: {
                        email: 'student3_email@email.com',
                    },
                }),
            ];
            for (let student of students) {
                await testing.expectPromiseNotToReject(
                    testing.services.student.saveNewStudent(student)
                );
            }

            await testing.expectPromiseNotToReject(
                testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
            );

            await testing.requests.admin['login'](
                testing.models.defaultAdmin.user.email,
                testing.models.defaultAdmin.user.password
            ).expect(expectedResultValue.loginResponse);

            const response = await testing.requests.student['search'](
                testing.accessToken,
                {
                    searchTerm: '',
                    limit: 2,
                    offset: 0,
                }
            );

            expect(response.body).toMatchObject(
                expectedResultValue.searchStudentsResponse
            );
        });

        // should get skip a student with offset
        it('should get skip a students with offset', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    message: config.messages.successfullLogin,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
                searchStudentsResponse: {
                    searchTerm: '',
                    limit: 10,
                    offset: 1,
                    success: true,
                    students: [
                        pick(
                            testing.models.getStudentWithoutPassword(
                                testing.models.alternativeStudent
                            ),
                            ['fullName', 'user']
                        ),
                        pick(
                            testing.models.getStudentWithoutPassword(
                                testing.models.custom<Student>(
                                    testing.models.defaultStudent,
                                    {
                                        fullName: 'student 3',
                                        user: {
                                            email: 'student3_email@email.com',
                                        },
                                    }
                                )
                            ),
                            ['fullName', 'user']
                        ),
                    ],
                },
            };
            const students = [
                testing.models.defaultStudent,
                testing.models.alternativeStudent,
                testing.models.custom<Student>(testing.models.defaultStudent, {
                    fullName: 'student 3',
                    user: {
                        email: 'student3_email@email.com',
                    },
                }),
            ];
            for (let student of students) {
                await testing.expectPromiseNotToReject(
                    testing.services.student.saveNewStudent(student)
                );
            }

            await testing.expectPromiseNotToReject(
                testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
            );

            await testing.requests.admin['login'](
                testing.models.defaultAdmin.user.email,
                testing.models.defaultAdmin.user.password
            ).expect(expectedResultValue.loginResponse);

            const response = await testing.requests.student['search'](
                testing.accessToken,
                {
                    searchTerm: '',
                    limit: 10,
                    offset: 1,
                }
            );

            expect(response.body).toMatchObject(
                expectedResultValue.searchStudentsResponse
            );
        });

        // should only get students that match search
        it('should only get students based search', async () => {
            const expectedResultValue = {
                loginResponse: {
                    success: true,
                    message: config.messages.successfullLogin,
                    token: testing.accessToken,
                    expiresAt: (() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        return date.toISOString();
                    })(),
                },
                searchStudentsResponse: {
                    searchTerm: 'student3_email',
                    limit: 10,
                    offset: 0,
                    success: true,
                    students: [
                        pick(
                            testing.models.getStudentWithoutPassword(
                                testing.models.custom<Student>(
                                    testing.models.defaultStudent,
                                    {
                                        fullName: 'student 3',
                                        user: {
                                            email: 'student3_email@email.com',
                                        },
                                    }
                                )
                            ),
                            ['fullName', 'user']
                        ),
                    ],
                },
            };
            const students = [
                testing.models.defaultStudent,
                testing.models.alternativeStudent,
                testing.models.custom<Student>(testing.models.defaultStudent, {
                    fullName: 'student 3',
                    user: {
                        email: 'student3_email@email.com',
                    },
                }),
            ];
            for (let student of students) {
                await testing.expectPromiseNotToReject(
                    testing.services.student.saveNewStudent(student)
                );
            }

            await testing.expectPromiseNotToReject(
                testing.services.admin.saveNewAdmin(testing.models.defaultAdmin)
            );

            await testing.requests.admin['login'](
                testing.models.defaultAdmin.user.email,
                testing.models.defaultAdmin.user.password
            ).expect(expectedResultValue.loginResponse);

            const response = await testing.requests.student['search'](
                testing.accessToken,
                {
                    searchTerm: 'student3_email',
                    limit: 10,
                    offset: 0,
                }
            );

            expect(response.body).toMatchObject(
                expectedResultValue.searchStudentsResponse
            );
        });
    });
});
