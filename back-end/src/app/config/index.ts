import RedisStore from 'connect-redis';
import { randomUUID } from 'crypto';
import { CookieOptions } from 'express';
import { Store } from 'express-session';
import Redis from 'ioredis';
import hashService from '../../services/hash';

type Environment = 'development' | 'test' | 'production';

const messages = {
    // validation
    adminNotFoundWithNameOrEmail:
        'Administrador não encontrado com este nome ou email.',
    supervisorNotFoundWithEmail: 'Orientador não encontrado com este email',
    studentNotFoundWithEmail: 'Não foi encontrado nenhum aluno com este email',
    emptyEmail: 'O campo email é obrigatório.',
    emptyNameOrEmail: 'O campo nome ou email é obrigatório.',
    emptyPassword: 'O campo senha é obrigatório.',
    insuficientPasswordCharacters: 'A senha deve ter pelo menos 8 caracteres.',
    invalidEmail: 'Este não é um email válido',
    emailAddressIsInUse: 'Este email já está em uso',
    userWithEmailNotFound: 'Não foi encontrado nenhum usuário com este email',
    invalidAdminName: 'O nome do admin deve conter apenas letras e números',
    nameOnlyLetters: 'O campo nome só pode ter letras.',
    wrongRepeatPassword: 'A confirmação de senha está incorreta',
    wrongPassword: 'A senha está incorreta!',
    invalidCnpj: 'Este CNPJ não é válido. Use apenas números.',
    emptyCnpj: 'O campo CNPJ é obrigatório.',

    // good
    welcomeMessage: 'Servidor ativo. API está disponível.',
    successfullLogin: 'Login realizado com sucesso!',
    successfullRegister: 'Cadastro realizado com sucesso.',
    successfullPasswordReset: 'Senha alterada com sucesso.',
    getSuccessfullRequestResetPassword: (email: string) =>
        `Um código de uso único foi enviado para ${email}.`,

    // bad
    databaseImplNotDefined:
        'A implementação do banco de dados não foi definida.',
    routeNotFound: 'Este recurso não foi encontrado.',
    serverUnhandledException:
        'Não foi possível completar a requisição porque ocorreu um erro inesperado!',
    tooManyRequests:
        'Muitas requisições foram enviadas em pouco tempo. Aguarde alguns minutos para continuar.',
    unauthenticated:
        'Você precisa estar autenticado para acessar este recurso!',
    unauthorized: 'Você não tem permissão para acessar este recurso!',
    invalidAccessToken:
        'Seu acesso não é válido! Tente fazer o login novamente.',
    invalidEmailOrResetPasswordToken:
        'O código de uso único ou o e-mail é inválido.',
    expiredResetPasswordToken: 'O código de uso único expirou.',
    invalidResetPasswordToken: 'O código de uso único é inválido',
    organizationNotFoundWithCNPJ:
        'Nenhum empresa foi encontrada com este CNPJ.',
};

const validations = {
    minPasswordLength: 8,
    maxEmailLength: 254,
    maxSearchTermLength: 100,
    maxSearchLimit: 100,
    defaultSearchLimit: 10,
};

const project = (() => {
    const config = {
        environment: 'production' as Environment,
        port: Number(process.env.PORT || '8000'),
        secret: process.env.secret || randomUUID(),
        frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:8081',
        redisUrl: process.env.REDIS_URL,
        emailOptions: {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            sender: process.env.EMAIL_SENDER,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        },
        databaseUrl: process.env.DATABASE_URL ?? '',
    };

    if (process.env.TS_NODE_DEV || process.env.NODE_ENV === 'development') {
        config.environment = 'development';
    }

    if (process.env.NODE_ENV === 'test') {
        config.environment = 'test';
    }

    const cookieOptions: CookieOptions = {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        signed: false,
    };

    if (config.environment == 'production') {
        cookieOptions.signed = true;
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'strict';
    }

    return {
        ...config,
        cookieOptions,
    };
})();

const instituition = {
    get adminName() {
        return project.environment === 'production'
            ? (process.env.DEFAULT_ADMIN_NAME ?? '')
            : 'admin';
    },
    get adminEmail() {
        return project.environment === 'production'
            ? (process.env.DEFAULT_ADMIN_EMAIL ?? '')
            : 'admin@email.com';
    },
    get adminPassword() {
        return project.environment === 'production'
            ? (process.env.DEFAULT_ADMIN_PASSWORD ?? '')
            : 'adminPassword123*';
    },
    get encryptedAdminPasswordAsync() {
        return hashService.encryptPasswordAsync(this.adminPassword);
    },
};

const external = {
    get redisStore(): Store {
        const redisClient = new Redis(project.redisUrl as string);

        return new RedisStore({
            client: redisClient,
            prefix: 'session:',
        });
    },
    get logger(): (message?: any, ...optionalParams: any[]) => void {
        return (message, ...optionalParams) => {
            if (project.environment === 'test') return message;
            console.log('=>', message, ...optionalParams);
        };
    },
    brasilAPI: {
        baseURL: 'https://brasilapi.com.br/api',
    },
    cnpjWS: {
        baseURL: 'https://publica.cnpj.ws',
    },
};

export default Object.freeze({
    messages,
    validations,
    project,
    instituition,
    external,
});
