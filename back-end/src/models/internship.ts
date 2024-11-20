import { Organization, OrganizationInternshipSupervisor } from './organization';
import { Student } from './student';
import { Supervisor } from './supervisor';

export enum InternshipStatus {
    // quando o estágio é recém criado com as informações básicas
    AwaitingInitialApproval = 'awaiting_initial_approval',
    // quando o orientador vê que todas as informações iniciais são válidas
    // os documentos de estágio são requeridos neste momento
    AwaitingInternshipApproval = 'awaiting_internship_approval',
    // solicitação de estágio foi rejeitado
    // o aluno precisa verificar e corrigir as informações
    Rejected = 'rejected',
    // quando o aluno ou orientador cancelam uma solicitação
    // de início de estágio
    Canceled = 'canceled',
    // durante o período de estágio
    InProgress = 'in_progress',
    // quando o estágio terminou
    Finished = 'finished',
    // o estágio estava em andamento mas foi fechado devido a algum problema, como desistência,
    // morte, demissão, etc...
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

export type InternshipWeeklyHour = {
    startTime: number;
    endTime: number;
};

export type InternshipWeeklyHours = {
    mondayToFriday: InternshipWeeklyHour; // Horário de segunda a sexta
    mondayToFridaySecondary?: InternshipWeeklyHour; // Horário adicional de segunda a sexta
    saturday?: InternshipWeeklyHour; // Horário aos sábados (opcional)
};

export type InternshipPeriod = {
    startDate: Date; // data de início
    expectedEndDate: Date; // data previsão para término
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
    weeklyHours: InternshipWeeklyHours;
    period: InternshipPeriod;
    schedule: InternshipSchedule[];
    internshipCloseReason?: string;
};
