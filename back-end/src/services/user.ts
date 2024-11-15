import config from '../app/config';
import { DatabaseResolver } from '../app/database';
import { BadRequestError, NotFoundError } from '../app/errors';
import { User } from '../models/user';
import hashService from './hash';

class UserService {
    async updatePasswordByEmail(
        email: string,
        newPassword: string
    ): Promise<User> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.saveUserPasswordByEmail(
            email,
            await hashService.encryptPasswordAsync(newPassword)
        );

        conn.throwIfHasError();

        if (!user) {
            throw new NotFoundError(config.messages.userWithEmailNotFound);
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserByEmail(email);

        conn.throwIfHasError();

        return user;
    }

    async findUserById(userId: number): Promise<User | undefined> {
        const conn = await DatabaseResolver.getConnection();
        const user = await conn.findUserById(userId);

        conn.throwIfHasError();

        return user;
    }

    async verifyIfEmailIsInUse(email: string): Promise<boolean> {
        const conn = await DatabaseResolver.getConnection();
        const isEmailInUse = await conn.verifyIfEmailIsInUse(email);

        conn.throwIfHasError();

        return isEmailInUse!;
    }

    async ensureEmailIsInUse(email: string): Promise<void> {
        if (!(await this.verifyIfEmailIsInUse(email)))
            throw new BadRequestError(config.messages.userWithEmailNotFound);
    }

    async ensureEmailIsNotInUse(email: string): Promise<void> {
        if (await this.verifyIfEmailIsInUse(email))
            throw new BadRequestError(config.messages.emailAddressIsInUse);
    }

    async comparePasswordsAsync(
        user: User,
        plainPassword: string
    ): Promise<boolean> {
        return await hashService.comparePasswordsAsync(
            plainPassword,
            user.password
        );
    }

    async ensurePasswordsMatchAsync(
        user: User,
        plainPassword: string
    ): Promise<void> {
        const passwordsMatch = await userService.comparePasswordsAsync(
            user,
            plainPassword
        );
        if (!passwordsMatch)
            throw new BadRequestError(config.messages.wrongPassword);
    }
}

const userService = new UserService();

export default userService;
