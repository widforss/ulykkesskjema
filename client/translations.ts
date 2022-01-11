import { makeRequest } from "./fetch";

const nbKdvUrl = "https://api.regobs.no/v5/KdvElements?langkey=1&isActive=true&sortOrder=true";
const enKdvUrl = "https://api.regobs.no/v5/KdvElements?langkey=2&isActive=true&sortOrder=true";
const nbAppUrl = "https://raw.githubusercontent.com/NVE/regObs4/develop/src/assets/i18n/nb.json";
const enAppUrl = "https://raw.githubusercontent.com/NVE/regObs4/develop/src/assets/i18n/en.json";
const nbHelpUrl = "https://raw.githubusercontent.com/NVE/regObs4/develop/src/assets/json/helptexts.nb.json";
const enHelpUrl = "https://raw.githubusercontent.com/NVE/regObs4/develop/src/assets/json/helptexts.en.json";


type App = {[key: string]: (App | string)};

interface Help {
    RegistrationTID: number,
    GeoHazardTID: number,
    LangKey: number,
    Text: string,
}

interface Kdv {
    [repository: string]: {
        [department: string]: {
            Id: number,
            Name: string,
        }[],
    }
}

type Translation = {
    kdv: Kdv,
    app: App,
    help: Help[],
}

interface Translations {
    en: Translation,
    nb: Translation,
}

export async function fetchTranslations() {
    let translations: Translations = {
        en: {
            kdv: null,
            help: null,
            app: null,
        },
        nb: {
            kdv: null,
            help: null,
            app: null,
        },
    };
    let urls: [string, (json: Kdv | App | Help[]) => void][] = [
        [nbKdvUrl, (json: Kdv) => translations["nb"]["kdv"] = json],
        [enKdvUrl, (json: Kdv) => translations["en"]["kdv"] = json],
        [nbAppUrl, (json: App) => translations["nb"]["app"] = json],
        [enAppUrl, (json: App) => translations["en"]["app"] = json],
        [nbHelpUrl, (json: Help[]) => translations["nb"]["help"] = json],
        [enHelpUrl, (json: Help[]) => translations["en"]["help"] = json],
    ];
    await Promise.all(urls.map(async ([url, callback]) => {
        let response: string = await makeRequest("GET", url);
        let json = JSON.parse(response);
        callback(json);
    }));
    return translations;
}