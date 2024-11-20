import Joi from 'joi';
import config from '../app/config';
import {
    InSearchInternshipsDto,
    InStartNewInternshipDto,
} from '../dtos/internship';

export const StartNewInternshipSchema = Joi.object<InStartNewInternshipDto>({
    // TODO: terminar... implementar validações e mensagens
    classification: Joi.string().required(),
    division: Joi.string().required(),
    monthlyStipend: Joi.number().required(),
    organizationCnpj: Joi.string().required(),
    organizationSupervisor: Joi.object({
        email: Joi.string().required(),
        name: Joi.string().required(),
        position: Joi.string().required(),
    }).required(),
    period: Joi.object({
        startDate: Joi.date().required(),
        expectedEndDate: Joi.date().required(),
    }).required(),
    schedule: Joi.array().required(),
    studentId: Joi.number().required(),
    supervisorId: Joi.number().required(),
    transportationAid: Joi.number().required(),
    weeklyHours: Joi.object({
        mondayToFriday: Joi.object({
            startTime: Joi.number().required(),
            endTime: Joi.number().required(),
        }).required(),
        mondayToFridaySecondary: Joi.object({
            startTime: Joi.number().required(),
            endTime: Joi.number().required(),
        }).allow(null),
        saturday: Joi.object({
            startTime: Joi.number().required(),
            endTime: Joi.number().required(),
        }).allow(null),
    }).required(),
    workSituation: Joi.string().required(),
});

export const SearchInternshipSchema = Joi.object<InSearchInternshipsDto>({
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
