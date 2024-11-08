export function toResult<T, E extends Error = Error>(
    promise: Promise<T>
): AsyncValueOrError<T, E> {
    return {
        async getValueAsync() {
            try {
                return await promise;
            } catch (error) {
                return error as E;
            }
        },

        async isErrorAsync() {
            const value = await this.getValueAsync();
            return value instanceof Error;
        },

        async isSuccessAsync() {
            const value = await this.getValueAsync();
            return !(value instanceof Error);
        },

        async orElseAsync<U>(alternative: U | Promise<U>) {
            try {
                return await promise;
            } catch {
                return await alternative;
            }
        },

        async orElseThrowAsync(cb) {
            try {
                return await promise;
            } catch (error) {
                const ex = cb ? cb(error as E) : (error as Error);
                throw ex instanceof Error ? ex : new Error(ex);
            }
        },

        async waitAsync() {
            await promise.catch(() => {});
        },

        async resolveAsync() {
            const transform = <T, E extends Error = Error>(
                value: T | E
            ): ValueOrError<T, E> => {
                if (value instanceof Error) {
                    return {
                        value,
                        isError: true,
                        isSuccess: false,
                        map: <U>(_: (val: T) => U) =>
                            transform<U, Error>(value),
                        orElse: <U>(alternative: U) => alternative,
                        orElseThrow(cb) {
                            if (cb) {
                                const ex = cb(value);
                                throw ex instanceof Error ? ex : new Error(ex);
                            }
                            throw value;
                        },
                        validate: <U = T>(
                            predicate: (val: T) => boolean,
                            error: Error
                        ) => transform<U, Error>(value),
                    };
                }

                return {
                    value,
                    isError: false,
                    isSuccess: true,
                    map: <U>(fn: (val: T) => U) =>
                        transform<U, Error>(fn(value)),
                    orElse: <U>(_: U) => value,
                    orElseThrow: () => value,
                    validate: <U = T>(
                        predicate: (val: T) => boolean,
                        error: Error
                    ) =>
                        predicate(value)
                            ? transform<U, Error>(value as unknown as U)
                            : transform<U, Error>(error),
                };
            };

            return await promise
                .then((value) => transform<T, E>(value))
                .catch((err) => transform<T, E>(err));
        },

        async getErrorAsync() {
            const value = await this.getValueAsync();
            return value instanceof Error ? value : null;
        },

        mapAsync<U>(fn: (val: T) => U | Promise<U>) {
            const newPromise = this.getValueAsync().then((value) => {
                if (value instanceof Error) throw value;
                return fn(value);
            });
            return toResult(newPromise);
        },

        validateAsync<U = T>(
            predicate: (val: T) => boolean | Promise<boolean>,
            error: Error
        ) {
            const newPromise = this.getValueAsync().then(async (value) => {
                if (value instanceof Error) throw value;
                if (!(await predicate(value))) throw error;
                return value as unknown as U;
            });
            return toResult(newPromise);
        },
    };
}

export function deepFreeze<T extends object>(obj: T): Immutable<T> {
    Object.keys(obj).forEach((key) => {
        const prop = obj[key as keyof T];
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });
    return Object.freeze(obj);
}

export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
    for (const key in source) {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (
            sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue)
        ) {
            target[key] = deepMerge(
                { ...targetValue } as T[Extract<keyof T, string>],
                sourceValue
            ) as T[Extract<keyof T, string>];
        } else {
            target[key] = sourceValue as T[Extract<keyof T, string>];
        }
    }
    return target;
}

export function is<T>(
    value: unknown,
    constructor: new (...args: any[]) => T
): value is T {
    return value instanceof constructor;
}

export type MergeReplace<T, U> = Omit<T, keyof U> & U;
export type Replace<
    T,
    U extends { [K in keyof T]?: T[K] | unknown },
> = MergeReplace<T, U>;

export type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Mapper<From extends object, To extends object> = {
    [K in keyof To]: keyof From | ((source: From) => To[K]);
};
export type ValueOrError<T, E extends Error = Error> =
    | {
          value: T;
          isError: false;
          isSuccess: true;
          orElseThrow: (cb?: (err: E) => E | string) => T;
          orElse: <U>(alternative: U) => T;
          map: <U>(fn: (val: T) => U) => ValueOrError<U, Error>;
          validate: <U = T>(
              predicate: (val: T) => boolean,
              error: Error
          ) => ValueOrError<U, Error>;
      }
    | {
          value: E;
          isError: true;
          isSuccess: false;
          orElseThrow: (cb?: (err: E) => E | string) => never;
          orElse: <U>(alternative: U) => U;
          map: <U>(fn: (val: T) => U) => ValueOrError<U, Error>;
          validate: <U = T>(
              predicate: (val: T) => boolean,
              error: Error
          ) => ValueOrError<U, Error>;
      };

export type AsyncValueOrError<T, E extends Error = Error> = {
    resolveAsync: () => Promise<ValueOrError<T, E>>;
    waitAsync: () => Promise<void>;
    getValueAsync: () => Promise<T | E>;
    getErrorAsync: () => Promise<E | null>;
    isErrorAsync: () => Promise<boolean>;
    isSuccessAsync: () => Promise<boolean>;
    orElseThrowAsync: (cb?: (err: E) => E | string) => Promise<T>;
    orElseAsync: <U>(alternative: U | Promise<U>) => Promise<T | U>;
    validateAsync: <U = T>(
        predicate: (val: T) => boolean | Promise<boolean>,
        error: Error
    ) => AsyncValueOrError<U, Error>;
    mapAsync: <U>(
        fn: (val: T) => U | Promise<U>
    ) => AsyncValueOrError<U, Error>;
};
