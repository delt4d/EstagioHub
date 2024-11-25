import { Internship } from '../models/internship';

export type InStartNewInternshipDto = Pick<
    Internship,
    | 'organizationSupervisor'
    | 'division'
    | 'classification'
    | 'monthlyStipend'
    | 'transportationAid'
    | 'workSituation'
    | 'internshipSchedule'
    | 'period'
    | 'tasks'
> & {
    studentId: number;
    organizationCnpj: string;

    // TODO: Supervisor ID must be the student's supervisor
    // that is defined by the class of the student
    supervisorId: number;
};

export type InSearchInternshipsDto = {
    limit?: number;
    offset?: number;
    searchTerm: string;
};

export type InReasonDto = {
    reason: string;
};