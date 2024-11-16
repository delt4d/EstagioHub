import { DatabaseResolver } from '../app/database';
import { BadRequestError, NotFoundError } from '../app/errors';
import { toResult } from '../app/utils';
import {
    InStartNewInternshipDto,
    SearchInternshipsDto,
} from '../dtos/internship';
import { Internship } from '../models/internship';
import organizationService from './organization';
import studentService from './student';

class InternshipService {
    async startNewInternship(
        data: InStartNewInternshipDto
    ): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        const student = await conn.findStudentById(data.studentId);
        conn.throwIfHasError();

        if (!student) {
            throw new NotFoundError('Aluno não encotrado na base de dados.');
        }

        await toResult(studentService.checkIfStudentIsInterning(student.id!))
            .validateAsync(
                (isInterning) => !isInterning,
                new BadRequestError('O aluno já está estágiando.')
            )
            .orElseThrowAsync();

        const supervisor = await conn.findSupervisorById(data.supervisorId);
        conn.throwIfHasError();

        if (!supervisor) {
            throw new NotFoundError(
                'Orientador não encotrado na base de dados.'
            );
        }

        const organization = await toResult(
            organizationService.fetchDataByCnpj(data.organizationCnpj)
        ).orElseThrowAsync();

        const internship = await conn.saveNewInternship({
            ...data,
            student,
            supervisor,
            organization,
        });
        conn.throwIfHasError();

        return internship!;
    }

    async searchInternships(search: SearchInternshipsDto) {
        const conn = await DatabaseResolver.getConnection();
        const internships = await conn.searchInternshipts(search);
        conn.throwIfHasError();
        return internships!;
    }
}

const internshipService = new InternshipService();

export default internshipService;
