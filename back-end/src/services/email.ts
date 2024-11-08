import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../app/config';
import { User } from '../models/user';

interface EmailService {
    sendNewUserEmail(user: User): Promise<void>;
    sendResetPasswordEmail(user: User, token: string): Promise<void>;
}

class NodeMailerService implements EmailService {
    private transporter;

    constructor() {
        const auth = {
            user: config.project.emailOptions.auth.user,
            pass: config.project.emailOptions.auth.pass,
        };

        const options: SMTPTransport.Options = {
            port: config.project.emailOptions.port,
            host: config.project.emailOptions.host,
            secure: false,
            auth: auth.user ? auth : undefined,
        };

        this.transporter = nodemailer.createTransport(options);
    }

    verifyAsync(): Promise<null> {
        return new Promise((resolve, reject) => {
            return this.transporter.verify((err, success) => {
                if (success) return resolve(null);
                return reject(err);
            });
        });
    }

    async sendNewUserEmail(user: User): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: user.email,
            subject: 'Bem-vindo ao EstagioHub',
            text: `Olá ${user.email},\n\nObrigado por se cadastrar no EstagioHub. Você agora pode gerenciar suas atividades de estágio.\n\nAtenciosamente,\nEquipe EstagioHub`,
            html: `
                <p>Olá <strong>${user.email}</strong>,</p>
                <p>Obrigado por se cadastrar no EstagioHub. Você agora pode gerenciar suas atividades de estágio.</p>
                <p>Atenciosamente,<br/>Equipe EstagioHub</p>
            `,
        });
    }

    async sendResetPasswordEmail(user: User, token: string): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: user.email,
            subject: 'Solicitação de Redefinição de Senha',
            text: `Olá ${user.email},\n\nRecebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:\n\n[Link para redefinir a senha]\n\nSe você não fez essa solicitação, pode ignorar este e-mail.\n\nAtenciosamente,\nEquipe EstagioHub`,
            html: `
                <p>Olá <strong>${user.email}</strong>,</p>
                <p>Este é o seu token de redefinição de senha:</p>
                <sub>${token}</sub>
                <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p>
                <p><a href="${config.project.frontendUrl}/forgot-password">Redefinir Senha</a></p>
                <p>Se você não fez essa solicitação, pode ignorar este e-mail.</p>
                <p>Atenciosamente,<br/>Equipe EstagioHub</p>
            `,
        });
    }
}

class FakeMailerService implements EmailService {
    private logger: (message?: any, ...optionalParams: any[]) => void;

    constructor() {
        this.logger = config.external.logger;
    }

    async sendNewUserEmail(user: User): Promise<void> {
        this.logger(
            `Welcome message successfully sent to ${user.role} with email "${user.email}"`
        );
    }

    async sendResetPasswordEmail(user: User, token: string): Promise<void> {
        this.logger(
            `Password reset token "${token}" sent to ${user.role} with email "${user.email}"`
        );
    }
}

let emailService: NodeMailerService | FakeMailerService =
    new FakeMailerService();

if (config.project.environment === 'production') {
    emailService = new NodeMailerService();
    emailService.verifyAsync().catch((err) => {
        config.external.logger('Email service not working', err);
    });
}

export default emailService as EmailService;
