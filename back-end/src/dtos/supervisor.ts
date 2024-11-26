import { mapObject } from '../app/helpers';
import { Mapper, Replace } from '../app/utils';
import { Supervisor } from '../models/supervisor';
import { mapUserOut, OutUserDto } from './user';

export type OutSupervisorDto = Replace<
    Supervisor,
    {
        user: OutUserDto;
    }
>;

export const mapSupervisorOut = (supervisor: Supervisor): OutSupervisorDto => {
    const mapper: Mapper<Supervisor, OutSupervisorDto> = {
        id: 'id',
        name: 'name',
        user: (source) => mapUserOut(source.user),
    };

    return mapObject(supervisor, mapper);
};
