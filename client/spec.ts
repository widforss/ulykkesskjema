import {Form} from "./types";

const NOW = new Date();

export const CONTENT: Form = {
    title: {
        type: "TextContent",
        level: "h1",
        title: {
            en: "Report avalanche incident",
            nb: "Rapportere skredhendelse",
        }
    },
    help: {
        type: "Help",
        registration: 26,
        geohazard: 10,
    },
    map: {
        type: "Map",
    },
    date: {
        type: "Date",
        title: {
            en: "Date and time",
            nb: "Dato og tid",
        },
        before: NOW,
        after: new Date(NOW.getFullYear() - 1, NOW.getMonth(), NOW.getDate()),
        keys: [["DtObsTime"], ['AvalancheObs', 'DtAvalancheTime']],
        mandatory: true,
    },
    activity: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "INCIDENT", "ACTIVITY"],
        selectKey: ["KdvRepositories", "Snow_ActivityInfluencedKDV"],
        key: ["Incident", "ActivityInfluencedTID"],
    },
    damageExtent: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "INCIDENT", "DAMAGE_EXTENT"],
        selectKey: ["KdvRepositories", "DamageExtentKDV"],
        key: ["Incident", "DamageExtentTID"],
    },
    groundActivity: {
        type: "Select",
        title: {
            en: "Ground activity",
            nb: "Bakkeaktivitet",
        },
        select: [
            {
                en: "Uphill",
                nb: "Oppover",
            },
            {
                en: "Downhill",
                nb: "Nedover",
            },
            {
                en: "Standing still",
                nb: "Stillestående",
            },
            {
                en: "Traversing",
                nb: "Kryssende",
            },
            {
                en: "High marking",
                nb: "High-marking",
            },
            {
                en: "Travel in runout zone",
                nb: "Ferdsel i utløpsområder",
            },
            {
                en: "Travel on ridge",
                nb: "Ferdsel på rygg",
            },
            {
                en: "Other",
                nb: "Annet",
            },
            {
                en: "Unknown",
                nb: "Ukjent",
            }
        ]
    },
    numberInvolved: {
        type: "Integer",
        title: {
            en: "Number involved",
            nb: "Antall involverte"
        },
        min: 0,
        max: 50,
    },
    numberBuried: {
        type: "Integer",
        title: {
            en: "Number buried",
            nb: "Antall skredtatte"
        },
        min: 0,
        max: 50,
    },
    numberDead: {
        type: "Integer",
        title: {
            en: "Number dead",
            nb: "Antall døde"
        },
        min: 0,
        max: 50,
    },
    numberInjured: {
        type: "Integer",
        title: {
            en: "Number injured",
            nb: "Antall skadede"
        },
        min: 0,
        max: 50,
    },
    avalancheSize: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "SNOW", "AVALANCHE_OBS", "DESTRUCTIVE_SIZE"],
        selectKey: ["KdvRepositories", "Snow_DestructiveSizeKDV"],
        key: ["AvalancheObs", "DestructiveSizeTID"]
    },
    weakLayer: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "SNOW", "AVALANCHE_OBS", "AVAL_CAUSE"],
        selectKey: ["KdvRepositories", "Snow_AvalCauseKDV"],
        key: ["AvalancheObs", "AvalCauseTID"]
    },
    terrainType: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "SNOW", "AVALANCHE_OBS", "TERRAIN_START_ZONE"],
        selectKey: ["KdvRepositories", "Snow_TerrainStartZoneKDV"],
        key: ["AvalancheObs", "TerrainStartZoneTID"]
    },
    avalancheType: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "SNOW", "AVALANCHE_OBS", "AVALANCHE_TYPE"],
        selectKey: ["KdvRepositories", "Snow_AvalancheKDV"],
        key: ["AvalancheObs", "AvalancheTID"]
    },
    avalancheGear: {
        type: "Select",
        title: {
            en: "Avalanche gear?",
            nb: "Skredutstyr?",
        },
        select: [
            {
                en: "Yes",
                nb: "Ja",
            },
            {
                en: "No",
                nb: "Nei",
            },
            {
                en: "Partially",
                nb: "Delvis",
            }
        ]
    },
    association: {
        type: "Select",
        title: {
            en: "Local or traveller?",
            nb: "Lokal eller på reise?"
        },
        select: [
            {
                en: "Local",
                nb: "Lokalboende",
            },
            {
                en: "Lives in region",
                nb: "Bor i regionen",
            },
            {
                en: "Lives in Norway",
                nb: "Bor i Norge",
            },
            {
                en: "Foreigner",
                nb: "Utlenning",
            },
            {
                en: "Unknown",
                nb: "Ukjent",
            }
        ],
    },
    comment: {
        type: "TextInput",
        length: "long",
        title: {
            en: "Comment",
            nb: "Kommentar",
        },
        key: ["Incident", "Comment"]
    },
    image: {
        type: "Image",
        title: {
            en: "Upload image",
            nb: "Last opp bilde",
        },
        geohazard: 10,
        registration: 11,
        comment: {
            en: "Comment",
            nb: "Kommentar",
        },
        photographer: {
            en: "Photographer",
            nb: "Fotograf",
        },
        copyright: {
            en: "Copyright",
            nb: "Opphavsrett",
        },
        error: {
            en: "Could not upload image!",
            nb: "Klarte ikke å laste opp bilde!",
        }
    },
    url: {
        type: "TextInput",
        length: "url",
        title: {
            en: "URL",
            nb: "URL",
        },
        key: ["Incident", "IncidentURLs"]
    },
    submit: {
        type: "Button",
        title: {
            en: "Submit",
            nb: "Registrer",
        },
        error: {
            en: "Submission failed!",
            nb: "Innsending misslyktes",
        }
    },
    submitMessage: {
        type: "SubmitMessage",
        title: {
            en: 'Thank you for your submission. <a href=".?lang=en">Click here</a> to return to the form.',
            nb: 'Takk for din registrering. <a href=".?lang=nb">Klikke her</a> for å gå tilbake til skjemaet.',
        }
    },
}