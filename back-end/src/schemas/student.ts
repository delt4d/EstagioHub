import Joi from 'joi';
import {
    EmailSchema,
    NameSchema,
    PasswordSchema,
    RepeatPasswordSchema,
} from '.';
import config from '../app/config';
import { SearchStudentsDto, UpdateStudentDto } from '../dtos/student';

export const StudentLoginSchema = Joi.object<{
    email: string;
    password: string;
}>({
    email: EmailSchema,
    password: PasswordSchema,
});

export const StudentRegisterSchema = Joi.object<{
    fullName: string;
    email: string;
    password: string;
    repeatPassword: string;
}>({
    fullName: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    repeatPassword: RepeatPasswordSchema,
});

// TODO: Verificar como remover campos vazios do resultado da validação
export const UpdateStudentSchema = Joi.object<UpdateStudentDto>({
    fullName: NameSchema.optional().empty(''),
    rg: Joi.string().pattern(/^\d+$/).optional().empty('').messages({
        'string.pattern.base': 'O RG deve conter apenas números.',
    }),
    phone: Joi.string()
        .pattern(/^\+?\d+$/)
        .optional()
        .empty('')
        .messages({
            'string.pattern.base':
                'O telefone deve conter apenas números e pode incluir o símbolo +.',
            'string.max': 'O telefone não deve exceder 15 caracteres.',
        }),
    address: Joi.object({
        street: Joi.string().optional().empty(''),
        city: Joi.string().optional().empty(''),
        district: Joi.string().optional().empty(''),
        postalCode: Joi.string().optional().empty(''),
        state: Joi.string().optional().empty(''),
        number: Joi.string().optional().empty(''),
        additionalInfo: Joi.string().optional().empty(''),
    })

        .optional(),
    whatsapp: Joi.string()
        .pattern(/^\+?\d+$/)
        .optional()
        .empty('')
        .messages({
            'string.pattern.base':
                'O WhatsApp deve conter apenas números e pode incluir o símbolo +.',
            'string.max': 'O WhatsApp não deve exceder 15 caracteres.',
        }),
    academicClass: Joi.string().optional().empty(''),
    academicId: Joi.string().pattern(/^\d+$/).optional().empty('').messages({
        'string.pattern.base': 'O ID acadêmico deve conter apenas números.',
    }),
});

export const SearchStudentsSchema = Joi.object<SearchStudentsDto>({
    limit: Joi.number()
        .integer()
        .min(1)
        .max(config.validations.maxSearchLimit)
        .default(config.validations.defaultSearchLimit)
        .messages({
            'number.max': `O limite deve ser menor que ${config.validations.maxSearchLimit}`,
            'number.min': 'O limite deve ser no mínimo 1',
        }),
    offset: Joi.number().integer().min(0).default(0),
    searchTerm: Joi.string()
        .allow('')
        .max(config.validations.maxSearchTermLength)
        .messages({
            'number.max': `O termo não deve exceder ${config.validations.maxSearchTermLength} caracteres.`,
            'number.min': 'O limite não deve ser menor que 0',
        })
        .required(),
});
