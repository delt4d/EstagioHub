import Joi from 'joi';
import sequelize from 'sequelize';
import config from '../config';

export class UnauthorizedError extends Error {
    readonly name = 'UnauthorizedError';

    public constructor(message?: string) {
        super(
            message || 'Você precisa estar logado para acessar este recurso.'
        );
    }
}

export class ForbiddenError extends Error {
    readonly name = 'ForbiddenError';

    public constructor(message?: string) {
        super(message || config.messages.unauthorized);
    }
}

export class BadRequestError extends Error {
    readonly name = 'BadRequestError';

    public constructor(message?: string) {
        super(message || 'Verifique se os dados estão corretos.');
    }
}

export class NotFoundError extends Error {
    readonly name = 'NotFoundError';

    public constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends Joi.ValidationError implements Error {
    warning: Joi.ValidationError | undefined;

    public constructor(
        message: string,
        details: Joi.ValidationErrorItem[],
        warning?: Joi.ValidationError | undefined,
        original?: any
    ) {
        super(message, details, original);
        this.warning = warning;
        this.name = 'ValidationError';
    }
}

export class TooManyRequestsError extends Error {
    readonly name = 'TooManyRequestsError';

    public constructor(message?: string) {
        super(message || 'A requisição excedeu o limite de requisições.');
    }
}

export class UnhandledError extends Error {
    readonly name = 'UnhandledError';
    readonly userFriendlyMessage?: string;

    public constructor(message: string, userFriendlyMessage?: string) {
        if (config.project.environment === 'production') {
            const defaultMessage = config.messages.serverUnhandledException;
            message = userFriendlyMessage || defaultMessage;
        }

        super(message);

        this.userFriendlyMessage = userFriendlyMessage;
    }

    static withFriendlyMessage(message: string): UnhandledError {
        return new UnhandledError(message, message);
    }
}

export class DatabaseError extends Error {
    readonly name = 'DatabaseError';
    databaseErrorName: string;
    userFriendlyMessage?: string;
    code: string;
    sql: string;
    params: any;

    public constructor(
        message: string,
        databaseErrorName: string,
        code: string,
        sql: string,
        params: any,
        userFriendlyMessage?: string
    ) {
        if (config.project.environment === 'production') {
            const defaultMessage = config.messages.serverUnhandledException;
            message = userFriendlyMessage || defaultMessage;
        }

        super(message);

        this.userFriendlyMessage = userFriendlyMessage;
        this.databaseErrorName = databaseErrorName;
        this.code = code;
        this.sql = sql;
        this.params = params;
    }

    public static fromSequelizeDatabaseError(
        error: sequelize.DatabaseError
    ): DatabaseError {
        const newErr = new DatabaseError(
            error.message,
            error.name,
            (error.original as any)?.code,
            error?.sql,
            error.parameters
        );
        newErr.stack = error.stack;
        return newErr;
    }

    public changeFriendlyMessage(newMessage: string): DatabaseError {
        this.userFriendlyMessage = newMessage;

        if (config.project.environment === 'production') {
            this.message = newMessage;
        }

        return this;
    }
}
