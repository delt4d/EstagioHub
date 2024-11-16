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
            internship,
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
}
