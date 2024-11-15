import Joi from 'joi';
import { InStartNewInternshipDto } from '../dtos/internship';

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
