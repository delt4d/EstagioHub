import Joi from 'joi';
import config from '../app/config';

const NameSchemaNoMessages = Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .lowercase()
    .required();

const AdminNameSchemaNoMessages = Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .lowercase()
    .required();

const EmailSchemaNoMessages = Joi.string()
    .email()
    .max(config.validations.maxEmailLength)
    .lowercase()
    .required();

export const AdminNameSchema = AdminNameSchemaNoMessages.messages({
    'string.pattern.base': config.messages.invalidAdminName,
});

export const NameSchema = NameSchemaNoMessages.messages({
    'string.pattern.base': config.messages.nameOnlyLetters,
});

export const EmailSchema = EmailSchemaNoMessages.messages({
    'any.required': config.messages.emptyEmail,
    'string.empty': config.messages.emptyEmail,
    'string.email': config.messages.invalidEmail,
    'string.max': `O email deve ter no máximo ${config.validations.maxEmailLength} caracteres.`,
});

export const AdminNameOrEmailSchema = Joi.string()
    .lowercase()
    .required()
    .when(Joi.string().email(), {
        then: EmailSchemaNoMessages,
        otherwise: AdminNameSchema,
    })
    .messages({
        'any.required': config.messages.emptyNameOrEmail,
        'alternatives.match': 'Por favor, forneça um nome ou um email válido.',
        'string.max': `O email deve ter no máximo ${config.validations.maxEmailLength} caracteres.`,
        'string.empty': config.messages.emptyNameOrEmail,
        'string.email': config.messages.invalidEmail,
    });

export const PasswordSchema = Joi.string()
    .min(config.validations.minPasswordLength)
    .required()
    .messages({
        'any.required': config.messages.emptyPassword,
        'string.empty': config.messages.emptyPassword,
        'string.min': config.messages.insuficientPasswordCharacters,
    });

export const RepeatPasswordSchema = Joi.any()
    .equal(Joi.ref('password'))
    .label('Confirmar senha')
    .required()
    .options({
        messages: { 'any.only': config.messages.wrongRepeatPassword },
    });

export const ResetPasswordTokenSchema = Joi.string().required().messages({
    'any.required': config.messages.invalidResetPasswordToken,
    'string.empty': config.messages.invalidResetPasswordToken,
});
