import { Certificate } from './certificate';
import { afterPluginsLoaded } from '../../utils';

export const getCadesProp = afterPluginsLoaded(async function (
    this: Certificate,
    propName: string
) {
    const cadesCertificate = this.cadesCertificate;

    let propertyValue;

    try {
        propertyValue = cadesCertificate[propName];
    } catch (error) {
        throw new Error('Ошибка при обращении к свойству сертификата');
    }

    return propertyValue;
});
