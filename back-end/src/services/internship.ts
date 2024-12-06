import { DatabaseResolver } from '../app/database';
import { BadRequestError, NotFoundError, UnhandledError } from '../app/errors';
import { toResult } from '../app/utils';
import {
    InReasonDto,
    InSearchInternshipsDto,
    InStartNewInternshipDto,
} from '../dtos/internship';
import {
    Internship,
    InternshipDocument,
    InternshipStatus,
} from '../models/internship';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import emailService from './email';
import internshipDocumentService from './internship-document';
import organizationService from './organization';
import studentService from './student';

// TODO: Criar documentos de estágio de progresso a cada 6 meses e de conclusão quando o estágio terminar

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
            throw new NotFoundError('Orientador não encotrado.');
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
        search: InSearchInternshipsDto
    ): Promise<Internship[] | never> {
        const conn = await DatabaseResolver.getConnection();
        const internships = await conn.searchInternships(search);
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

    async getInternishipsByUserId(
        userId: number
    ): Promise<Internship[] | never> {
        const conn = await DatabaseResolver.getConnection();
        const internships = await conn.findInternshipsByUserId(userId);
        conn.throwIfHasError();
        return internships!;
    }

    async getInternishipsByStudentId(
        studentId: number
    ): Promise<Internship[] | never> {
        const conn = await DatabaseResolver.getConnection();
        const internships = await conn.findInternshipsByStudentId(studentId);
        conn.throwIfHasError();
        return internships!;
    }

    async cancelNewInternship(id: number): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        // TODO: se o orientador que está tentando cancelar,
        // deve ser verificado se ele tem permissão (é da mesma turma)
        const internship = await conn.findInternshipById(id);
        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        const isInternshipWaitingApproval = [
            InternshipStatus.AwaitingInitialApproval,
            InternshipStatus.AwaitingInternshipApproval,
            InternshipStatus.Rejected,
        ].includes(internship.status);

        if (!isInternshipWaitingApproval) {
            throw new BadRequestError(
                'Este estágio não pode ser cancelado no momento.'
            );
        }

        const updatedInternship = await conn.saveInternship(id, {
            status: InternshipStatus.Canceled,
        });
        conn.throwIfHasError();

        if (!updatedInternship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        return updatedInternship;
    }

    async approveNewInternship(id: number): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        // TODO: se o orientador que está tentando aprovar,
        // deve ser verificado se ele tem permissão (é da mesma turma)
        const internship = await conn.findInternshipById(id);
        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        const isInternshipAwaitingApproval =
            internship.status === InternshipStatus.AwaitingInitialApproval;

        if (!isInternshipAwaitingApproval) {
            throw new BadRequestError(
                'Este estágio não pode ser aprovado no momento.'
            );
        }

        const updatedInternship = await conn.saveInternship(id, {
            status: InternshipStatus.AwaitingInternshipApproval,
        });
        conn.throwIfHasError();

        if (!updatedInternship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        updatedInternship.documents =
            await internshipDocumentService.createStartingInternshipDocuments(
                internship.id!
            );

        return updatedInternship;
    }

    async rejectNewInternship(id: number): Promise<Internship | never> {
        // TODO: se é o orientador que está tentando aprovar,
        // deve ser verificado se ele tem permissão (é da mesma turma)
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.findInternshipById(id);
        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        const isInternshipWaitingApproval = [
            InternshipStatus.AwaitingInitialApproval,
            InternshipStatus.AwaitingInternshipApproval,
        ].includes(internship.status);

        if (!isInternshipWaitingApproval) {
            throw new BadRequestError(
                'Este estágio não pode ser rejeitado no momento.'
            );
        }

        const updatedInternship = await conn.saveInternship(id, {
            status: InternshipStatus.Rejected,
        });
        conn.throwIfHasError();

        if (!updatedInternship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        return updatedInternship;
    }

    async closeInternship(
        id: number,
        data: InReasonDto
    ): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.findInternshipById(id);
        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        if (internship.status !== InternshipStatus.InProgress) {
            throw new BadRequestError(
                'O estágio deve estar em andamento para poder ser encerrado.'
            );
        }

        const updatedInternship = await conn.saveInternship(id, {
            status: InternshipStatus.Closed,
            internshipCloseReason: data.reason,
        });
        conn.throwIfHasError();

        if (!updatedInternship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        return updatedInternship;
    }

    async startInternship(internshipId: number): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.saveInternship(internshipId, {
            status: InternshipStatus.InProgress,
        });

        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        return internship;
    }

    async confirmInternshipDocument(
        internshipDocumentId: number
    ): Promise<InternshipDocument | never> {
        const conn = await DatabaseResolver.getConnection();
        const internshipDocument =
            await conn.confirmInternshipDocument(internshipDocumentId);

        conn.throwIfHasError();

        if (!internshipDocument) {
            throw new NotFoundError('Documento de estágio não encontrado.');
        }

        return internshipDocument;
    }

    async getInternshipByDocument(
        internshipDocumentId: number
    ): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        const internship =
            await conn.findInternshipByDocument(internshipDocumentId);

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

        if (internship.status !== InternshipStatus.AwaitingInternshipApproval) {
            throw new BadRequestError(
                'Este documento só deve ser enviado quando solicitado, com o estágio aprovado.'
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
            throw new BadRequestError(
                'Este documento só deve ser enviado quando solicitado, com o estágio em andamento.'
            );
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

        const isInternshipFinished =
            internship.status == InternshipStatus.Finished;

        if (!isInternshipFinished) {
            throw new BadRequestError(
                'Este documento só deve ser enviado quando solicitado, com o estágio concluído.'
            );
        }

        await emailService.sendInternshipEndDoc(
            internship.supervisor,
            document
        );

        return internship;
    }

    async updateInternship(
        internshipId: number,
        data: Partial<Internship>,
        actualUser: User
    ): Promise<Internship | never> {
        const conn = await DatabaseResolver.getConnection();
        const internship = await conn.findInternshipById(internshipId);
        conn.throwIfHasError();

        if (!internship) {
            throw new NotFoundError('Estágio não encontrado.');
        }

        const isInternshipInitialState = [
            InternshipStatus.AwaitingInitialApproval,
            InternshipStatus.Rejected,
        ].includes(internship.status);

        // TODO: mudar mais tarde, deve ser verificado se o usuário é o orientador
        // do aluno deste estágio. Ele é permitido alterar os dados.
        if (
            !isInternshipInitialState ||
            actualUser.role !== UserRole.Supervisor
        ) {
            const isInternshipEndedOrCanceled = [
                InternshipStatus.Canceled,
                InternshipStatus.Finished,
                InternshipStatus.Closed,
            ].includes(internship.status);

            if (isInternshipEndedOrCanceled) {
                throw new BadRequestError(
                    'Este estágio não pode ter suas informações alteradas porque ele foi encerrado.'
                );
            }

            throw new BadRequestError(
                'Você não está autorizado a alterar as informações deste estágio'
            );
        }

        const updatedInternship = await conn.saveInternship(
            internship.id!,
            data
        );
        conn.throwIfHasError();

        if (!updatedInternship) {
            throw UnhandledError.withFriendlyMessage(
                'Não foi possível atualizar as informações do estágio.'
            );
        }

        return updatedInternship;
    }
}

const internshipService = new InternshipService();

export default internshipService;
