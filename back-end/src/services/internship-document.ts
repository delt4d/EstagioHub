import { DatabaseResolver } from '../app/database';
import {
    InternshipDocument,
    InternshipDocumentType,
} from '../models/internship';

class InternshipDocumentService {
    async createStartingInternshipDocuments(
        internshipId: number
    ): Promise<InternshipDocument[]> {
        const conn = await DatabaseResolver.getConnection();
        const documents = await conn.saveNewInternshipDocuments([
            {
                internshipId,
                type: InternshipDocumentType.Start,
                name: 'Plano de Atividades - Ficha de Início',
            },
        ]);
        conn.throwIfHasError();
        return documents!;
    }

    async createProgressInternshipDocuments(
        internshipId: number
    ): Promise<InternshipDocument[]> {
        const conn = await DatabaseResolver.getConnection();
        const documents = await conn.saveNewInternshipDocuments([
            {
                internshipId,
                type: InternshipDocumentType.Progress,
                name: 'Relatório de Progresso',
            },
        ]);

        conn.throwIfHasError();

        return documents!;
    }

    async createFinishedInternshipDocuments(
        internshipId: number
    ): Promise<InternshipDocument[]> {
        const conn = await DatabaseResolver.getConnection();
        const documents = await conn.saveNewInternshipDocuments([
            {
                internshipId,
                type: InternshipDocumentType.Finished,
                name: 'Avaliação de Desempenho',
            },
            {
                internshipId,
                type: InternshipDocumentType.Finished,
                name: 'Relatório Final',
            },
        ]);

        conn.throwIfHasError();

        return documents!;
    }
}

const internshipDocumentService = new InternshipDocumentService();

export default internshipDocumentService;
