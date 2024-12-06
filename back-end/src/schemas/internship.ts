import Joi from 'joi';
import config from '../app/config';
import {
    InSearchInternshipsDto,
    InStartNewInternshipDto,
} from '../dtos/internship';

const TimeSchema = Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm')
    .required()
    .messages({
        'string.base': 'O horário deve ser uma string.',
        'string.pattern.base': 'O horário deve estar no formato HH:mm.',
        'any.required': 'O horário é obrigatório.',
    });

export const StartNewInternshipSchema = Joi.object<InStartNewInternshipDto>({
    classification: Joi.string()
        .valid('mandatory', 'non_mandatory')
        .required()
        .messages({
            'any.required': 'A classificação é obrigatória.',
            'string.base': 'A classificação deve ser uma string.',
            'any.only':
                'A classificação deve ser "mandatory" ou "non_mandatory".',
        }),
    division: Joi.string().required().messages({
        'any.required': 'A divisão é obrigatória.',
        'string,empty': 'A divisão não pode estar vazia.',
        'string.base': 'A divisão deve ser uma string.',
    }),
    monthlyStipend: Joi.number().min(0).required().messages({
        'any.required': 'O valor da bolsa mensal é obrigatório.',
        'number.base': 'O valor da bolsa mensal deve ser um número.',
        'number.min': 'O valor da bolsa mensal deve ser maior ou igual a 0.',
    }),
    organizationCnpj: Joi.string()
        .pattern(/^\d{14}$/)
        .required()
        .messages({
            'any.required': 'O CNPJ da organização é obrigatório.',
            'string.base': 'O CNPJ da organização deve ser uma string.',
            'string.pattern.base':
                'O CNPJ da organização deve ser um número de 14 dígitos.',
        }),
    organizationSupervisor: Joi.object({
        email: Joi.string().email().required().messages({
            'any.required': 'O e-mail do supervisor é obrigatório.',
            'string.email':
                'O e-mail do supervisor deve ser um endereço de e-mail válido.',
        }),
        name: Joi.string().required().messages({
            'any.required': 'O nome do supervisor é obrigatório.',
            'string.base': 'O nome do supervisor deve ser uma string.',
        }),
        position: Joi.string().required().messages({
            'any.required': 'O cargo do supervisor é obrigatório.',
            'string.base': 'O cargo do supervisor deve ser uma string.',
        }),
    })
        .required()
        .messages({
            'any.required':
                'As informações do supervisor da organização são obrigatórias.',
        }),
    period: Joi.object({
        startDate: Joi.date().required().messages({
            'any.required': 'A data de início é obrigatória.',
            'date.base': 'A data de início deve ser uma data válida.',
        }),
        expectedEndDate: Joi.date()
            .greater(Joi.ref('startDate'))
            .required()
            .messages({
                'any.required': 'A data de término esperada é obrigatória.',
                'date.base':
                    'A data de término esperada deve ser uma data válida.',
                'date.greater':
                    'A data de término esperada deve ser posterior à data de início.',
            }),
    })
        .required()
        .messages({
            'any.required': 'As informações do período são obrigatórias.',
        }),
    tasks: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required().messages({
                    'any.required': 'O nome da tarefa é obrigatório.',
                    'string.base': 'O nome da tarefa deve ser uma string.',
                }),
                description: Joi.string().required().messages({
                    'any.required': 'A descrição da tarefa é obrigatória.',
                    'string.base': 'A descrição da tarefa deve ser uma string.',
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'Pelo menos uma tarefa é obrigatória.',
            'any.required': 'As tarefas são obrigatórias.',
        }),
    studentId: Joi.number().integer().positive().required().messages({
        'any.required': 'O ID do estudante é obrigatório.',
        'number.base': 'O ID do estudante deve ser um número.',
        'number.positive':
            'O ID do estudante deve ser um número inteiro positivo.',
    }),
    supervisorId: Joi.number().integer().positive().required().messages({
        'any.required': 'O ID do supervisor é obrigatório.',
        'number.base': 'O ID do supervisor deve ser um número.',
        'number.positive':
            'O ID do supervisor deve ser um número inteiro positivo.',
    }),
    transportationAid: Joi.number().min(0).required().messages({
        'any.required': 'O auxílio transporte é obrigatório.',
        'number.base': 'O auxílio transporte deve ser um número.',
        'number.min': 'O auxílio transporte deve ser maior ou igual a 0.',
    }),
    internshipSchedule: Joi.object({
        mondayToFriday: Joi.object({
            startTime: TimeSchema.messages({
                'any.required':
                    'O horário de início de segunda a sexta é obrigatório.',
            }),
            endTime: TimeSchema.custom((value, helpers) => {
                const startTime = helpers.state.ancestors[0].startTime;
                if (startTime && value <= startTime) {
                    return helpers.error('any.custom');
                }
                return value;
            }).messages({
                'any.required':
                    'O horário de término de segunda a sexta é obrigatório.',
                'any.custom':
                    'O horário de término deve ser após o horário de início.',
            }),
        }).allow(null),
        mondayToFridaySecondary: Joi.object({
            startTime: TimeSchema.messages({
                'any.required':
                    'O horário secundário de início de segunda a sexta é obrigatório.',
            }),
            endTime: TimeSchema.custom((value, helpers) => {
                const startTime = helpers.state.ancestors[0].startTime;
                if (startTime && value <= startTime) {
                    return helpers.error('any.custom');
                }
                return value;
            }).messages({
                'any.required':
                    'O horário secundário de término de segunda a sexta é obrigatório.',
                'any.custom':
                    'O horário de término deve ser após o horário de início.',
            }),
        })
            .allow(null)
            .custom((value, helpers) => {
                const { mondayToFriday } = helpers.state.ancestors[0];

                if (value !== null && mondayToFriday === null) {
                    return helpers.error('any.custom');
                }

                return value;
            }),
        saturday: Joi.object({
            startTime: TimeSchema.messages({
                'any.required': 'O horário de início do sábado é obrigatório.',
                'any.custom':
                    'O horário secundário só pode ser especificado se o horário principal de segunda a sexta estiver definido.',
            }),
            endTime: TimeSchema.custom((value, helpers) => {
                const startTime = helpers.state.ancestors[0].startTime;

                if (startTime && value <= startTime) {
                    return helpers.error('any.custom');
                }

                return value;
            }).messages({
                'any.required': 'O horário de término do sábado é obrigatório.',
                'any.custom':
                    'O horário de término deve ser após o horário de início.',
            }),
        }).allow(null),
    })
        .custom((value, helpers) => {
            const { mondayToFriday, mondayToFridaySecondary, saturday } = value;
            if (!mondayToFriday && !mondayToFridaySecondary && !saturday) {
                return helpers.error('any.custom');
            }
            return value;
        })
        .messages({
            'any.required': 'O horário de estágio é obrigatória.',
            'any.custom':
                'Pelo menos um horário deve ser especificado: segunda a sexta ou aos sábados.',
        }),
    workSituation: Joi.string()
        .valid('onsite', 'hybrid', 'remote')
        .required()
        .messages({
            'any.required': 'A situação de trabalho é obrigatória.',
            'string.base': 'A situação de trabalho deve ser uma string.',
            'any.only':
                'A situação de trabalho deve ser "onsite", "hybrid" ou "remote".',
        }),
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
