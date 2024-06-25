import { afterPluginsLoaded, isSupportedCadesVersion, isSupportedCSPVersion } from '../utils';
import { getSystemInfo, TSystemInfo } from './get-system-info';

export const isValidSystemSetup = afterPluginsLoaded(async (): Promise<boolean> => {
    let systemInfo: TSystemInfo;

    try {
        systemInfo = await getSystemInfo();
    } catch (error) {
        console.error(error);

        throw new Error('Настройки ЭП на данной машине не верны');
    }

    if (!isSupportedCadesVersion(systemInfo.cadesVersion)) {
        throw new Error('Не поддерживаемая версия плагина');
    }

    if (!isSupportedCSPVersion(systemInfo.cspVersion)) {
        throw new Error('Не поддерживаемая версия CSP');
    }

    return true;
});