import { DatabaseResolver } from '../app/database';
import { Supervisor } from '../models/supervisor';
import hashService from './hash';
import userService from './user';

export class SupervisorService {
    async findSupervisorByEmail(
        email: string
    ): Promise<Supervisor | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const supervisor = await conn.findSupervisorByEmail(email);
        conn.throwIfHasError();
        return supervisor;
    }

    async ensureCanSaveSupervisor(supervisor: Supervisor): Promise<void> {
        await userService.ensureEmailIsNotInUse(supervisor.user.email);
    }

    async saveNewSupervisor(supervisor: Supervisor): Promise<Supervisor> {
        await this.ensureCanSaveSupervisor(supervisor);

        supervisor.user.password = await hashService.encryptPasswordAsync(
            supervisor.user.password
        );

        const conn = await DatabaseResolver.getConnection();
        const createdSupervisor = await conn.saveNewSupervisor(supervisor);

        conn.throwIfHasError();

        return createdSupervisor!;
    }
}

const supervisorService = new SupervisorService();

export default supervisorService;
