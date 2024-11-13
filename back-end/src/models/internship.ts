import { Organization, OrganizationInternshipSupervisor } from './organization';
import { Student } from './student';
import { Supervisor } from './supervisor';

export enum InternshipStatus {
    AwaitingInitialApproval = 'awaiting_initial_approval',
    AwaitingStartDocs = 'awaiting_start_docs',
    AwaitingStartApproval = 'awaiting_start_approval',
    InProgress = 'in_progress',
    InProgressPendingDocs = 'in_progress_pending_docs',
    CompletedPendingDocs = 'completed_pending_docs',
    Completed = 'completed',
    Rejected = 'rejected',
    Closed = 'closed',
}

export enum WorkSituation {
    Onsite = 'onsite',
    Hybrid = 'hybrid',
    Remote = 'remote',
}

export enum Classification {
    Mandatory = 'mandatory',
    NonMandatory = 'non_mandatory',
}

export type Internship = {
    id?: number;
    student: Student;
    supervisor: Supervisor;
    status: InternshipStatus;
    organization: Organization;
    internshipSupervisor: OrganizationInternshipSupervisor;
    division: string; // divisão/departamento
    classification: Classification; // classificação (obrigatório, não obrigatório)
    monthlyStipend: number; // valor mensal bolsa do estágio
    transportationAid: number; // valor auxílio transporte
    workSituation: WorkSituation; // situação de trabalho (presencial, semi presencial, remota)
    weeklyHours: {
        mondayToFriday: { startTime: string; endTime: string }; // Horário de segunda a sexta
        mondayToFridaySecondary?: { startTime: string; endTime: string }; // Horário adicional de segunda a sexta
        saturday?: { startTime: string; endTime: string }; // Horário aos sábados (opcional)
    };
    period: {
        startDate: Date; // data de início
        expectedEndDate: Date; // data previsão para término
    };
    schedule: Array<{
        name: string; // Nome da atividade
        description: string; // Descrição da atividade
    }>;
};
