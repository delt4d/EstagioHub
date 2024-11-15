import { Organization, OrganizationInternshipSupervisor } from './organization';
import { Student } from './student';
import { Supervisor } from './supervisor';

export enum InternshipStatus {
    AwaitingInitialApproval = 'awaiting_initial_approval',
    AwaitingInternshipApproval = 'awaiting_internship_approval',
    InProgress = 'in_progress',
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

export type InternshipSchedule = {
    id?: number;
    name: string; // Nome da atividade
    description: string; // Descrição da atividade
};

export type Internship = {
    id?: number;
    student: Student;
    supervisor: Supervisor;
    status: InternshipStatus;
    organization: Organization;
    organizationSupervisor: OrganizationInternshipSupervisor;
    division: string; // divisão/departamento
    classification: Classification; // classificação (obrigatório, não obrigatório)
    monthlyStipend: number; // valor mensal bolsa do estágio
    transportationAid: number; // valor auxílio transporte
    workSituation: WorkSituation; // situação de trabalho (presencial, semi presencial, remota)
    weeklyHours: {
        mondayToFriday: { startTime: number; endTime: number }; // Horário de segunda a sexta
        mondayToFridaySecondary?: { startTime: number; endTime: number }; // Horário adicional de segunda a sexta
        saturday?: { startTime: number; endTime: number }; // Horário aos sábados (opcional)
    };
    period: {
        startDate: Date; // data de início
        expectedEndDate: Date; // data previsão para término
    };
    schedule: InternshipSchedule[];
};
