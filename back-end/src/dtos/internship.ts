import { mapObject } from '../app/helpers';
import { Mapper, Replace } from '../app/utils';
import { Internship } from '../models/internship';
import { mapStudentOut, OutStudentDto } from './student';
import { mapSupervisorOut, OutSupervisorDto } from './supervisor';

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

export type OutInternshipDto = Replace<
    Internship,
    {
        student: OutStudentDto;
        supervisor: OutSupervisorDto;
    }
>;

export const mapInternshipOut = (
    internship: Internship,
    ignoreError: boolean = false
): OutInternshipDto => {
    const mapper: Mapper<Internship, OutInternshipDto> = {
        id: 'id',
        classification: 'classification',
        division: 'division',
        monthlyStipend: 'monthlyStipend',
        transportationAid: 'transportationAid',
        workSituation: 'workSituation',
        internshipSchedule: 'internshipSchedule',
        documents: 'documents',
        internshipCloseReason: 'internshipCloseReason',
        period: 'period',
        tasks: 'tasks',
        status: 'status',
        organization: 'organization',
        organizationSupervisor: 'organizationSupervisor',
        supervisor: (source) => mapSupervisorOut(source.supervisor),
        student: (source) => mapStudentOut(source.student),
    };

    return mapObject(internship, mapper, ignoreError);
};
