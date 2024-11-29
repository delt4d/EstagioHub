import { Request, Response } from 'express';
import { BadRequestError, UnhandledError } from '../app/errors';
import { validateSchema } from '../app/helpers';
import { toResult } from '../app/utils';
import { mapInternshipOut } from '../dtos/internship';
import { InternshipStatus } from '../models/internship';
import { UserRole } from '../models/user-role';
import { ReasonSchema } from '../schemas';
import {
    SearchInternshipSchema,
    StartNewInternshipSchema,
} from '../schemas/internship';
import emailService from '../services/email';
import internshipService from '../services/internship';

export default class InternshipController {
    async startNewInternship(req: Request, res: Response) {
        // TODO: se o usuário atual é um estudante,
        // atribuir o seu ID de estudante à req.body.studentId
        const data = validateSchema(StartNewInternshipSchema, req.body);
        const internship = await internshipService.startNewInternship(data);

        return res.send({
            success: true,
            internship: mapInternshipOut(internship, true),
            message:
                'A solicitação de inicio de estágio foi realizado. Aguardando aprovação do orientador.',
        });
    }

    async searchInternships(req: Request, res: Response) {
        const data = validateSchema(SearchInternshipSchema, req.query);
        const internships = await internshipService.searchInternships(data);

        return res.send({
            ...data,
            success: true,
            internship: internships.map((internship) =>
                mapInternshipOut(internship, true)
            ),
        });
    }

    async getInternshipById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const internship = await internshipService.getInternshipById(id);

        return res.send({
            success: true,
            internship: mapInternshipOut(internship, true),
        });
    }

    async getInternshipsByStudentId(req: Request, res: Response) {
        const id = Number(req.params.id) ?? req.user?.id;

        if (!id || isNaN(id)) {
            throw new BadRequestError('ID do estudante inválido.');
        }

        const internships =
            await internshipService.getInternishipsByStudentId(id);

        return res.send({
            success: true,
            internship: internships.map((internship) =>
                mapInternshipOut(internship, true)
            ),
        });
    }

    async cancelNewInternship(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = validateSchema(ReasonSchema, req.body);
        const internship = await internshipService.cancelNewInternship(id);
        const currentUser = req.user!;

        if (currentUser.role !== UserRole.Student) {
            const result = toResult(
                emailService.sendToStudentInternshipRequestIsCanceled(
                    internship,
                    data.reason
                )
            );

            await result.orElseThrowAsync((err) => {
                throw new UnhandledError(
                    err.message,
                    'O estágio foi cancelado com sucesso, mas não foi possível notificar o aluno.'
                );
            });
        }

        return res.send({
            success: true,
            message: 'A solicitação de estágio foi cancelada.',
        });
    }

    async approveNewInternship(req: Request, res: Response) {
        const id = Number(req.params.id);
        const internship = await internshipService.approveNewInternship(id);
        const emailResult = toResult(
            emailService.sendToStudentInternshipRequestIsApproved(internship)
        );

        await emailResult.orElseThrowAsync((err) => {
            throw new UnhandledError(
                err.message,
                'A solicitação de estágio foi aprovada com sucesso, mas não foi possível notificar o aluno. Notifique-o e confirme o recebimento de todos os documentos necessários para iniciar o estágio.'
            );
        });

        return res.send({
            success: true,
            internship: mapInternshipOut(internship, true),
            message:
                'A solicitação de estágio foi aprovada com sucesso. Confirme o recebimento de todos os documentos necessários para iniciar o estágio.',
        });
    }

    async rejectNewInternship(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = validateSchema(ReasonSchema, req.body);
        const internship = await internshipService.rejectNewInternship(id);
        const emailResult = toResult(
            emailService.sendToStudentInternshipRequestIsRejected(
                internship,
                data.reason
            )
        );

        await emailResult.orElseThrowAsync((err) => {
            throw new UnhandledError(
                err.message,
                'A solicitação de estágio foi rejeitada, mas não foi possível notificar o aluno. Notifique-o.'
            );
        });

        return res.send({
            success: true,
            message: 'A solicitação de estágio foi rejeitada.',
        });
    }

    async closeInternship(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = validateSchema(ReasonSchema, req.body);
        const internship = await internshipService.closeInternship(id, data);

        await toResult(
            emailService.sendToStudentInternshipIsClosed(
                internship,
                data.reason
            )
        ).waitAsync();

        return res.send({
            success: true,
            message: 'O estágio foi encerrado.',
        });
    }

    async confirmInternshipDocument(req: Request, res: Response) {
        const id = Number(req.params.id);
        const internship = await internshipService.getInternshipByDocument(id);

        await internshipService.confirmInternshipDocument(id);

        if (internship.status === InternshipStatus.AwaitingInternshipApproval) {
            const startedInternship = await internshipService.startInternship(
                internship.id!
            );

            return res.send({
                success: true,
                message:
                    'Documento marcado como recebido! O estágio está autorizado para iniciar.',
                internship: mapInternshipOut(startedInternship, true),
            });
        }

        return res.send({
            success: true,
            message: 'Documento marcado como recebido!',
            internship: mapInternshipOut(internship, true),
        });
    }

    async uploadInternshipStartDoc(req: Request, res: Response) {
        const id = Number(req.params.id);
        const doc = req.file;

        if (!doc) {
            throw new BadRequestError('Nenhum documento foi recebido.');
        }

        const internship = await internshipService.uploadInternshipStartDoc(
            id,
            doc.buffer
        );

        return res.send({
            success: true,
            message: 'Documento enviado com sucesso!',
            internship: mapInternshipOut(internship, true),
        });
    }

    async uploadInternshipProgressDoc(req: Request, res: Response) {
        const id = Number(req.params.id);
        const doc = req.file;

        if (!doc) {
            throw new BadRequestError('Nenhum documento foi recebido.');
        }

        const internship = await internshipService.uploadInternshipProgressDoc(
            id,
            doc.buffer
        );

        return res.send({
            success: true,
            message: 'Documento enviado com sucesso!',
            internship: mapInternshipOut(internship, true),
        });
    }

    async uploadInternshipEndDoc(req: Request, res: Response) {
        const id = Number(req.params.id);
        const doc = req.file;

        if (!doc) {
            throw new BadRequestError('Nenhum documento foi recebido.');
        }

        const internship = await internshipService.uploadInternshipEndDoc(
            id,
            doc.buffer
        );

        return res.send({
            success: true,
            message: 'Documento enviado com sucesso!',
            internship: mapInternshipOut(internship, true),
        });
    }
}
