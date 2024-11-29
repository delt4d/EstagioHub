import { DatabaseResolver } from '../app/database';
import { UnhandledError } from '../app/errors';
import {
    CreateStudentDto,
    SearchStudentsDto,
    UpdateStudentDto,
} from '../dtos/student';
import { Student } from '../models/student';
import hashService from './hash';
import userService from './user';

class StudentService {
    async findStudentByEmail(
        email: string
    ): Promise<Student | undefined | never> {
        const conn = await DatabaseResolver.getConnection();
        const student = await conn.findStudentByEmail(email);
        conn.throwIfHasError();
        return student;
    }

    async searchStudents(
        search: SearchStudentsDto
    ): Promise<Student[] | never> {
        const conn = await DatabaseResolver.getConnection();
        const students = await conn.searchStudents(search);
        conn.throwIfHasError();
        return students!;
    }

    async ensureCanSaveStudent(
        student: CreateStudentDto
    ): Promise<void | never> {
        await userService.ensureEmailIsNotInUse(student.user.email);
    }

    async saveNewStudent(student: CreateStudentDto): Promise<Student | never> {
        await this.ensureCanSaveStudent(student);

        student.user.password = await hashService.encryptPasswordAsync(
            student.user.password
        );

        const conn = await DatabaseResolver.getConnection();
        const createdStudent = await conn.saveNewStudent({
            ...student,
            address: {
                city: '',
                district: '',
                number: '',
                postalCode: '',
                street: '',
                state: '',
            },
        });

        conn.throwIfHasError();

        return createdStudent!;
    }

    async saveStudentByUserId(
        userId: number,
        data: UpdateStudentDto
    ): Promise<Student | never> {
        const conn = await DatabaseResolver.getConnection();
        const student = await conn.saveStudentByUserId(userId, data);

        conn.throwIfHasError();

        if (!student) {
            throw new UnhandledError(
                'Não foi possível atualizar as informações do aluno.'
            );
        }

        return student;
    }

    async checkIfStudentIsInterning(
        studentId: number
    ): Promise<boolean | never> {
        const conn = await DatabaseResolver.getConnection();
        const isInterning = await conn.verifyStudentIsInterning(studentId);

        conn.throwIfHasError();

        return isInterning!;
    }
}

const studentService = new StudentService();

export default studentService;
