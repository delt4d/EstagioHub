import { mapObject } from '../app/helpers';
import { Mapper, Replace } from '../app/utils';
import { Student } from '../models/student';
import { mapUserOut, OutUserDto } from './user';

export type SearchStudentsDto = {
    limit?: number;
    offset?: number;
    searchTerm: string;
};

export type OutStudentDto = Replace<Student, { user: OutUserDto }>;

export const mapStudentOut = (student: Student): OutStudentDto => {
    // TODO: adicionar demais campos
    const mapper: Mapper<Student, OutStudentDto> = {
        id: 'id',
        fullName: 'fullName',
        user: (source) => mapUserOut(source.user),
    };

    return mapObject(student, mapper);
};
