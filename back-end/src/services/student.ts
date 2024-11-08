import { DatabaseResolver } from '../app/database';
import { Student } from '../models/student';
import hashService from './hash';
import userService from './user';

export class StudentService {
    async findStudentByEmail(email: string): Promise<Student | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const student = await conn.findStudentByEmail(email);
        conn.throwIfHasError();
        return student;
    }

    async ensureCanSaveStudent(student: Student): Promise<void> {
        await userService.ensureEmailIsNotInUse(student.user.email);
    }

    async saveNewStudent(student: Student): Promise<Student> {
        await this.ensureCanSaveStudent(student);

        student.user.password = await hashService.encryptPasswordAsync(
            student.user.password
        );

        const conn = await DatabaseResolver.getConnection();
        const createdStudent = await conn.saveNewStudent(student);

        conn.throwIfHasError();

        return createdStudent!;
    }
}

const studentService = new StudentService();

export default studentService;
