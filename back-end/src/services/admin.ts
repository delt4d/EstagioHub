import { DatabaseResolver } from '../app/database';
import { Admin } from '../models/admin';
import hashService from './hash';

export class AdminService {
    async findAdminByNameOrEmail(
        nameOrEmail: string
    ): Promise<Admin | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const admin = await conn.findAdminByNameOrEmail(nameOrEmail);

        conn.throwIfHasError();

        return admin;
    }

    async saveNewAdmin(admin: Admin): Promise<Admin> {
        admin.user.password = await hashService.encryptPasswordAsync(
            admin.user.password
        );

        const conn = await DatabaseResolver.getConnection();
        const createdAdmin = await conn.saveNewAdmin(admin);

        conn.throwIfHasError();

        return createdAdmin!;
    }
}

const adminService = new AdminService();

export default adminService;
