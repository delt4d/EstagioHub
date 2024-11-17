import { Request, Response } from 'express';
import { validateSchema } from '../app/helpers';
import {
    SearchInternshipSchema,
    StartNewInternshipSchema,
} from '../schemas/internship';
import internshipService from '../services/internship';

export default class InternshipController {
    async startNewInternship(req: Request, res: Response) {
        // TODO: se o usuário atual é um estudante,
        // atribuir o seu ID de estudante à req.body.studentId
        const data = validateSchema(StartNewInternshipSchema, req.body);

        // TODO: add to a mapper later
        const internship = await internshipService.startNewInternship(data);

        return res.send({
            success: true,
            internship, // TODO: add mapper
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
            internships, // TODO: add mapper
        });
    }

    async getInternshipById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const internship = await internshipService.getInternshipById(id);
        return res.send({
            success: true,
            internship, // TODO: add mapper
        });
    }

    async cancelNewInternship(req: Request, res: Response) {
        const id = Number(req.params.id);
        await internshipService.cancelNewInternship(id);
        return res.send({
            success: true,
            message: 'Solicitação de cancelamento de estágio cancelada.',
        });
    }

    async approveNewInternship(req: Request, res: Response) {
        const id = Number(req.params.id);
        await internshipService.approveNewInternship(id);
        return res.send({
            success: true,
            message:
                'A solicitação de estágio foi aprovada com sucesso. Aguardando envio dos documentos de estágio.',
        });
    }

    async rejectNewInternship(req: Request, res: Response) {
        // TODO: adicionar campo de justificativa, para que o aluno possa corrigir
        // o que for necessário para começar o estágio
        const id = Number(req.params.id);
        await internshipService.rejectNewInternship(id);
        return res.send({
            success: true,
            message: 'A solicitação de estágio foi rejeitada.',
        });
    }

    async closeInternship(req: Request, res: Response) {
        // TODO: adicionar campo de justificativa,
        // do porque o estágio foi encerrado
        const id = Number(req.params.id);
        await internshipService.closeInternship(id);
        return res.send({
            success: true,
            message: 'O estágio foi encerrado.',
        });
    }
}
