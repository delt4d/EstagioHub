import { DatabaseResolver } from '../app/database';
import { SearchStudentsDto } from '../dtos/student';
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

    async ensureCanSaveStudent(student: Student): Promise<void | never> {
        await userService.ensureEmailIsNotInUse(student.user.email);
    }

    async saveNewStudent(student: Student): Promise<Student | never> {
        await this.ensureCanSaveStudent(student);

        student.user.password = await hashService.encryptPasswordAsync(
            student.user.password
        );

        const conn = await DatabaseResolver.getConnection();
        const createdStudent = await conn.saveNewStudent(student);

        conn.throwIfHasError();

        return createdStudent!;
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
