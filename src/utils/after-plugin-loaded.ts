import { Certificate } from '../api';

type UnPromisify<T> = T extends Promise<infer R> ? R : T;

let isSetLogLevel = false;
let isPluginLoaded = false;

export const afterPluginsLoaded = <T extends (...args: any[]) => any>(
    fn: T
): ((...args: Parameters<T>) => Promise<UnPromisify<ReturnType<T>>>) => {
    const canPromise = Boolean(window.Promise);

    return async function (
        this: Certificate,
        ...args: Parameters<T>
    ): Promise<UnPromisify<ReturnType<T>>> {
        if (!isPluginLoaded) {
            try {
                require('../vendor/cadesplugin_api');
            } catch (error) {
                throw new Error('Ошибка при подключении модуля для работы с Cades plugin');
            }

            isPluginLoaded = true;
        }

        const { cadesplugin } = window;

        if (!canPromise) {
            throw new Error('Необходим полифилл для Promise');
        }

        if (!cadesplugin) {
            throw new Error('Не подключен модуль для работы с Cades plugin');
        }

        if (!isSetLogLevel) {
            cadesplugin.set_log_level(cadesplugin.LOG_LEVEL_ERROR);

            isSetLogLevel = true;
        }

        try {
            await cadesplugin;
        } catch (error) {
            throw new Error('Ошибка при инициализации модуля для работы с Cades plugin');
        }

        return await fn.apply(this, args);
    };
};
