import Joi from 'joi';
import config from '../config';

export class UnauthorizedError extends Error {
    readonly name = 'UnauthorizedError';

    public constructor() {
        super('Você precisa estar logado para acessar este recurso.');
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

    public constructor(message: string, userFriendlyMessage?: string) {
        if (config.project.environment === 'production') {
            const defaultMessage = config.messages.serverUnhandledException;
            message = userFriendlyMessage || defaultMessage;
        }

        super(message);
    }
}
