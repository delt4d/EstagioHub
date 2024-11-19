import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../app/config';
import { Supervisor } from '../models/supervisor';
import { User } from '../models/user';

interface EmailService {
    sendNewUserEmail(user: User): Promise<void>;
    sendResetPasswordEmail(user: User, token: string): Promise<void>;
    sendInternshipStartDoc(
        supervisor: Supervisor,
        document: Buffer
    ): Promise<void>;
    sendInternshipProgressDoc(
        supervisor: Supervisor,
        document: Buffer
    ): Promise<void>;
    sendInternshipEndDoc(
        supervisor: Supervisor,
        document: Buffer
    ): Promise<void>;
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

    async sendInternshipStartDoc(
        supervisor: Supervisor,
        document: Buffer
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: supervisor.user.email,
            subject: 'Documento de Início de Estágio',
            attachments: [
                {
                    filename: 'documento_inicial_de_estagio.pdf',
                    content: document,
                },
            ],
        });
    }

    async sendInternshipProgressDoc(
        supervisor: Supervisor,
        document: Buffer
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: supervisor.user.email,
            subject: 'Documento de Progresso do Estágio',
            attachments: [
                {
                    filename: 'documento_de_progresso_de_estagio.pdf',
                    content: document,
                },
            ],
        });
    }

    async sendInternshipEndDoc(
        supervisor: Supervisor,
        document: Buffer
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: supervisor.user.email,
            subject: 'Documento de Término do Estágio',
            attachments: [
                {
                    filename: 'documento_de_conclusao_de_estagio.pdf',
                    content: document,
                },
            ],
        });
    }
}

class FakeMailerService implements EmailService {
    private logger: (message?: any, ...optionalParams: any[]) => void;

    constructor() {
        this.logger = config.external.logger;
    }

    async sendInternshipStartDoc(
        supervisor: Supervisor,
        _: Buffer
    ): Promise<void> {
        this.logger(
            `A internship document was sent to "${supervisor.user.email}"`
        );
    }

    async sendInternshipProgressDoc(
        supervisor: Supervisor,
        _: Buffer
    ): Promise<void> {
        this.logger(`Progress document was sent to "${supervisor.user.email}"`);
    }

    async sendInternshipEndDoc(
        supervisor: Supervisor,
        _: Buffer
    ): Promise<void> {
        this.logger(`End document was sent to "${supervisor.user.email}"`);
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
