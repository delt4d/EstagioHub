import { Internship } from '../models/internship';

export type InStartNewInternshipDto = Pick<
    Internship,
    | 'organizationSupervisor'
    | 'division'
    | 'classification'
    | 'monthlyStipend'
    | 'transportationAid'
    | 'workSituation'
    | 'weeklyHours'
    | 'period'
    | 'schedule'
> & {
    studentId: number;
    organizationCnpj: string;

    // TODO: Supervisor ID must be the student's supervisor that is defined by the class of the student
    supervisorId: number;
};
