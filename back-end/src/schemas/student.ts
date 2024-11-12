import Joi from 'joi';
import {
    EmailSchema,
    NameSchema,
    PasswordSchema,
    RepeatPasswordSchema,
} from '.';
import config from '../app/config';
import { SearchStudentsDto } from '../dtos/student';

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
        .max(config.validations.maxSearchTermLength)
        .messages({
            'number.max': `O termo não deve exceder ${config.validations.maxSearchTermLength} caracteres.`,
            'number.min': 'O limite não deve ser menor que 0',
        })
        .required(),
});
