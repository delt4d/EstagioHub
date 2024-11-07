import Joi, { ValidationError } from 'joi';
import { MapperDictionary } from './utils';

export function mapObject<From extends object, To extends object>(
    sourceObject: From,
    mapper: MapperDictionary<From, To>,
    ignoreError: boolean = false
): To {
    const result: Partial<To> = {};

    for (const toKey in mapper) {
        const fromKey = mapper[toKey];

        if (typeof fromKey === 'function') {
            try {
                result[toKey] = fromKey(sourceObject);
            } catch (err) {
                if (!ignoreError) throw err;
            }
        } else if (typeof fromKey === 'string' && fromKey in sourceObject) {
            result[toKey] = sourceObject[
                fromKey as keyof From
            ] as unknown as To[typeof toKey];
        }
    }

    return result as To;
}

export function validateSchema<T>(
    validationSchema: Joi.ObjectSchema<T>,
    value?: any
): T {
    const validationResult = validationSchema.validate(value);

    if (validationResult.error) {
        throw new ValidationError(
            validationResult.error.message,
            validationResult.error.details,
            validationResult.warning
        );
    }

    return validationResult.value;
}
