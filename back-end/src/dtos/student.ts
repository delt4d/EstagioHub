import { mapObject } from '../app/helpers';
import { Mapper, Replace } from '../app/utils';
import { Student } from '../models/student';
import { mapUserOut, OutUserDto } from './user';

export type SearchStudentsDto = {
    limit?: number;
    offset?: number;
    searchTerm: string;
};

export type OutStudentDto = Replace<
    Student,
    {
        user: OutUserDto;
    }
>;

export const mapStudentOut = (student: Student): OutStudentDto => {
    const mapper: Mapper<Student, OutStudentDto> = {
        id: 'id',
        fullName: 'fullName',
        academicClass: 'academicClass',
        academicId: 'academicId',
        phone: 'phone',
        whatsapp: 'whatsapp',
        rg: 'rg',
        address: 'address',
        user: (source) => mapUserOut(source.user),
    };

    return mapObject(student, mapper);
};
