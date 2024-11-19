import { DatabaseResolver } from '../app/database';
import { BadRequestError, NotFoundError } from '../app/errors';
import { toResult } from '../app/utils';
import {
    InStartNewInternshipDto,
    SearchInternshipsDto,
} from '../dtos/internship';
import { Internship, InternshipStatus } from '../models/internship';
import emailService from './email';
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

    async searchInternships(
        search: SearchInternshipsDto
    ): Promise<Internship[] | never> {
        const conn = await DatabaseResolver.getConnection();
        const internships = await conn.searchInternshipts(search);
        conn.throwIfHasError();
        return internships!;
    }

    async getInternshipById(id: number): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.findInternshipById(id);
        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        return internship!;
    }

    async cancelNewInternship(id: number): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        // TODO: se o orientador que está tentando cancelar,
        // deve ser verificado se ele tem permissão (é da mesma turma)
        // TODO: só deve cancelar se o status atual do estágio for
        // 'awaiting_initial_approval' ou 'awaiting_internship_approval'
        const internship = await conn.updateInternshipStatus(
            id,
            InternshipStatus.Canceled
        );
        conn.throwIfHasError();
        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }
        return internship;
    }

    async approveNewInternship(id: number): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        // TODO: se o orientador que está tentando aprovar,
        // deve ser verificado se ele tem permissão (é da mesma turma)
        // TODO: só deve aprovar se o status atual do estágio for
        // 'awaiting_initial_approval' ou 'awaiting_internship_approval'
        const internship = await conn.updateInternshipStatus(
            id,
            InternshipStatus.AwaitingInternshipApproval
        );
        conn.throwIfHasError();
        // TODO: neste momento o upload dos documentos
        // necessários estará disponível
        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }
        return internship;
    }

    async rejectNewInternship(id: number): Promise<Internship | never> {
        // TODO: se o orientador que está tentando aprovar,
        // deve ser verificado se ele tem permissão (é da mesma turma)
        // TODO: só deve rejeitar se o status atual do estágio for
        // 'awaiting_initial_approval' ou 'awaiting_internship_approval'
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.updateInternshipStatus(
            id,
            InternshipStatus.Rejected
        );
        conn.throwIfHasError();
        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }
        return internship;
    }

    async closeInternship(id: number): Promise<Internship | never> {
        // TODO: só deve rejeitar se o status atual do estágio
        // for 'in_progress'
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.updateInternshipStatus(
            id,
            InternshipStatus.Closed
        );
        conn.throwIfHasError();
        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }
        return internship;
    }

    async uploadInternshipStartDoc(
        internshipId: number,
        document: Buffer
    ): Promise<Internship | never> {
        const internship =
            await internshipService.getInternshipById(internshipId);

        if (internship.status === InternshipStatus.AwaitingInitialApproval) {
            throw new BadRequestError(
                'Estágio ainda não recebeu a aprovação inicial do orientador.'
            );
        }
        if (internship.status !== InternshipStatus.AwaitingInternshipApproval) {
            throw new BadRequestError(
                'Este documento não precisa ser enviado. O estágio já passou do estado de aprovação.'
            );
        }

        await emailService.sendInternshipStartDoc(
            internship.supervisor,
            document
        );

        return internship;
    }

    async uploadInternshipProgressDoc(
        internshipId: number,
        document: Buffer
    ): Promise<Internship | never> {
        const internship =
            await internshipService.getInternshipById(internshipId);

        if (internship.status !== InternshipStatus.InProgress) {
            throw new BadRequestError('O Estágio não precisa deste documento.');
        }

        await emailService.sendInternshipProgressDoc(
            internship.supervisor,
            document
        );

        return internship;
    }

    async uploadInternshipEndDoc(
        internshipId: number,
        document: Buffer
    ): Promise<Internship | never> {
        const internship =
            await internshipService.getInternshipById(internshipId);

        if (
            internship.status !== InternshipStatus.Completed &&
            internship.status !== InternshipStatus.Canceled &&
            internship.status !== InternshipStatus.Closed
        ) {
            throw new BadRequestError(
                'O Estágio não precisa deste documento. O estágio já passou do estado de conclusão.'
            );
        }

        await emailService.sendInternshipEndDoc(
            internship.supervisor,
            document
        );

        return internship;
    }
}

const internshipService = new InternshipService();

export default internshipService;
