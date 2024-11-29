import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../app/config';
import { Internship } from '../models/internship';
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
    sendToStudentInternshipRequestIsCanceled(
        internship: Internship,
        reason?: string
    ): Promise<void>;
    sendToStudentInternshipRequestIsApproved(
        internship: Internship
    ): Promise<void>;
    sendToStudentInternshipRequestIsRejected(
        internship: Internship,
        reason: string
    ): Promise<void>;
    sendToStudentInternshipIsClosed(
        internship: Internship,
        reason: string
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
            text: `Olá ${user.email},\n\nEste é o seu token de redefinição de senha: ${token}\n\nRecebemos uma solicitação para redefinir sua senha. Acesse o link abaixo para criar uma nova senha:\n${config.project.frontendUrl}/forgot-password\n\nSe você não fez essa solicitação, pode ignorar este e-mail.\n\nAtenciosamente,\nEquipe EstagioHub`,
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
            text: `Olá ${supervisor.user.email},\n\nSegue anexado o documento inicial do estágio para revisão.\n\nAtenciosamente,\nEquipe EstagioHub`,
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
            text: `Olá ${supervisor.user.email},\n\nSegue anexado o documento de progresso do estágio para revisão.\n\nAtenciosamente,\nEquipe EstagioHub`,
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
            text: `Olá ${supervisor.user.email},\n\nSegue anexado o documento de término do estágio para revisão.\n\nAtenciosamente,\nEquipe EstagioHub`,
            subject: 'Documento de Término do Estágio',
            attachments: [
                {
                    filename: 'documento_de_conclusao_de_estagio.pdf',
                    content: document,
                },
            ],
        });
    }

    async sendToStudentInternshipRequestIsCanceled(
        internship: Internship,
        reason?: string
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: internship.student.user.email,
            subject: 'Solicitação de Estágio Cancelada',
            text: `Olá ${internship.student.user.email},\n\nSua solicitação de estágio para ${internship.organization.businessName} foi cancelada.\n"${reason ?? 'Motivo não especificado'}".\n\nAtenciosamente,\nEquipe EstagioHub`,
            html: `
                <p>Olá <strong>${internship.student.user.email}</strong>,</p>
                <p>Sua solicitação de estágio para ${internship.organization.businessName} foi cancelada.</p>
                <q>${reason}</q>
                <p>Atenciosamente,<br/>Equipe EstagioHub</p>
                `,
        });
    }

    async sendToStudentInternshipRequestIsApproved(
        internship: Internship
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: internship.student.user.email,
            subject: 'Solicitação de Estágio Aprovada',
            text: `Olá ${internship.student.user.email},\n\nSua solicitação de estágio para ${internship.organization.businessName} foi aprovada.\nAguarde o envio dos documentos para assinatura ou a chamada do seu orientador.\n\nAtenciosamente,\nEquipe EstagioHub`,
            html: `
                <p>Olá <strong>${internship.student.user.email}</strong>,</p>
                <p>Sua solicitação de estágio para ${internship.organization.businessName} foi aprovada.</p>
                <p>Aguarde o envio dos documentos para assinatura ou a chamada do seu orientador.</p>
                <p>Atenciosamente,<br/>Equipe EstagioHub</p>
                `,
        });
    }

    async sendToStudentInternshipRequestIsRejected(
        internship: Internship,
        reason: string
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: internship.student.user.email,
            subject: 'Solicitação de Estágio Rejeitada',
            text: `Olá ${internship.student.user.email},\n\nSua solicitação de estágio para ${internship.organization.businessName} foi rejeitada.\n"${reason}".\nPor favor, tente novamente ou entre em contato com o orientador do seu estágio.\n\nAtenciosamente,\nEquipe EstagioHub`,
            html: `
                <p>Olá <strong>${internship.student.user.email}</strong>,</p>
                <p>Sua solicitação de estágio para ${internship.organization.businessName} foi rejeitada.</p>
                <q>${reason}</q>
                <p>Por favor, tente novamente ou entre em contato com o orientador do seu estágio.</p>
                <p>Atenciosamente,<br/>Equipe EstagioHub</p>
                `,
        });
    }

    async sendToStudentInternshipIsClosed(
        internship: Internship,
        reason: string
    ): Promise<void> {
        await this.transporter.sendMail({
            from: config.project.emailOptions.sender,
            to: internship.student.user.email,
            subject: 'Estágio Fechado',
            text: `Olá ${internship.student.user.email},\n\nSeu estágio para ${internship.organization.businessName} foi encerrado.\n"${reason}".\n\nAtenciosamente,\nEquipe EstagioHub`,
            html: `
                <p>Olá <strong>${internship.student.user.email}</strong>,</p>
                <p>Seu estágio para ${internship.organization.businessName} foi encerrado.</p>
                <q>${reason}</q>
                <p>Por favor, confira os resultados e tente novamente se necessário.</p>
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

    async sendToStudentInternshipRequestIsCanceled(
        internship: Internship,
        reason?: string
    ): Promise<void> {
        this.logger(
            `Internship #${internship.id} request is canceled with reason "${reason}"`
        );
    }

    async sendToStudentInternshipRequestIsApproved(
        internship: Internship
    ): Promise<void> {
        this.logger(`Internship #${internship.id} request is approved`);
    }

    async sendToStudentInternshipRequestIsRejected(
        internship: Internship,
        reason: string
    ): Promise<void> {
        this.logger(
            `Internship #${internship.id} request is rejected with reason "${reason}"`
        );
    }

    async sendToStudentInternshipIsClosed(
        internship: Internship,
        reason: string
    ): Promise<void> {
        this.logger(
            `Internship #${internship.id} is closed with reason "${reason}"`
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
