import { Request, Response } from 'express';
import { validateSchema } from '../app/helpers';
import { StartNewInternshipSchema } from '../schemas/internship';
import internshipService from '../services/internship';

export default class InternshipController {
    async startNewInternship(req: Request, res: Response) {
        // TODO: se o usuário atual é um estudante,
        // atribuir o seu ID de estudante à req.body.studentId

        const data = validateSchema(StartNewInternshipSchema, req.body);

        await internshipService.startNewInternship(data);

        return res.send({
            success: true,
            message:
                'A solicitação de inicio de estágio foi realizado. Aguardando aprovação do orientador.',
        });
    }
}
