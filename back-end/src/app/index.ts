import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session, { MemoryStore } from 'express-session';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import validator from 'validator';
import routes from '../routes';
import config from './config';
import configurePassport from './passport';

const app = express();
const sessionOptions: session.SessionOptions = {
    secret: config.project.secret,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: config.project.cookieOptions,
    store:
        config.project.environment === 'production'
            ? config.external.redisStore
            : new MemoryStore(),
};

if (config.project.environment === 'production') {
    app.set('trust proxy', 1);
    app.use(
        slowDown({
            // a partir de 100 requisições em menos de 10 minutos, dá um delay de 1 segundo
            // que aumenta em 1 para cada 50 requisições a mais que forem recebidas
            windowMs: 10 * 60 * 1000,
            delayAfter: 100,
            delayMs: (heats) => (heats / 50) * 1000,
        })
    );

    app.use(
        rateLimit({
            // permite até 1125 requisições a cada 15 minutos
            windowMs: 15 * 60 * 1000,
            limit: 1125,
            legacyHeaders: true,
            handler(req, res) {
                res.status(429).send({
                    success: false,
                    message: config.messages.tooManyRequests,
                });
            },
        })
    );
}

app.use(
    helmet({
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        noSniff: true,
        referrerPolicy: { policy: 'no-referrer-when-downgrade' }, // Cabeçalho Referer (Desabilitado)
        xssFilter: true,
    })
);

app.use(session(sessionOptions));
app.use(express.json());
app.use(
    config.project.environment === 'production'
        ? cookieParser(config.project.secret)
        : cookieParser()
);
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [config.project.frontendUrl],
    })
);

configurePassport();

app.use((req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = validator.trim(req.body[key]);
                req.body[key] = validator.escape(req.body[key]);
            }
        }
    }
    next();
});
app.get('/', (req, res) => res.send(config.messages.welcomeMessage));
app.get('/healthcheck', (req, res) => res.sendStatus(200));
app.use('/api/v1', routes());
app.use(
    (
        error: Error | undefined,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (!error) {
            return next();
        }

        const statusCode =
            {
                UnauthorizedError: 401,
                ForbiddenError: 403,
                BadRequestError: 400,
                NotFoundError: 404,
                ValidationError: 400,
                UnhandledError: 500,
                TooManyRequestsError: 429,
            }[error.name] ?? 500;

        if (config.project.environment === 'development') {
            return res.status(statusCode).send({
                success: false,
                ...error,
                message: error.message,
                statusCode,
                stack: error.stack,
            });
        }

        return res.status(statusCode).send({
            success: false,
            message: error.message,
        });
    }
);
app.use((req, res) => {
    const error: any = {
        success: false,
        message: config.messages.routeNotFound,
    };

    if (config.project.environment === 'development')
        error.stack = new Error().stack;

    res.status(404).send(error);
});

export default app;
