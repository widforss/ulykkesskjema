import {Form} from "./types";

const NOW = new Date();

export const CONTENT: Form = {
    title: {
        type: "TextContent",
        level: "h1",
        title: {
            en: "Report avalanche incident anonymously",
            nb: "Rapportere skredhendelse anonymt",
        }
    },
    help: {
        type: "TextContent",
        level: "div",
        title: {
            en: `
                <p>
                    We want to collect as much information as possible about accidents, near misses, and other
                    incidents related to snow avalanches. The information will be used as a part of Varsoms
                    preventive work to avoid avalanche incidents in the future.
                </p>
                <p>
                    Feel free to fill in as many fields as possible about the conditions around the avalanche.
                    You can submit information about the avalanche itself, the cause, and the course of action,
                    as well as reflections on how you could have avoided the avalanche? How much information you
                    want to submit is up to you.
                </p>
                <p>
                    If there are several relevant choices under "damage extent", choose the one with the most
                    significant social consequence.
                </p>
                <p>
                    Information submitted in this form will be published on
                    <a href="https://www.regobs.no/">www.regobs.no</a> by the user “Ulykkesskjema”.
                </p>
                <p>
                    Remember to focus on learning and facts. Do not speculate or assign blame. All information
                    submitted must be anonymised. Information you wish to share exclusively with the Avalanche
                    Warning Service should be sent to
                    <a href="mailto:snoskredvarslingen@nve.no">snoskredvarslingen@nve.no</a>. Thanks for sharing!
                </p>
            `,
            nb: `
                <p>
                    Vi ønsker å samle inn så mye informasjon som mulig om ulykker, nestenulykker og andre hendelser
                    knyttet til snøskred. Dette vil være en del av det forebyggende arbeidet med å unngå
                    skredhendelser i framtiden.
                </p>
                <p>
                    Her kan du registrere fakta om selve skredet, om årsaken og forløpet, samt refleksjoner om
                    hvordan skredet kunne vært unngått? Hvor mye informasjon du ønsker å legge til der er opp til
                    deg. Fyll gjerne ut så mange felt som mulig slik at vi får god info om forholdene rundt skredet,
                    som også er viktig for de som skriver varslene.
                </p>
                <p>
                    Hvis det er flere valg som er aktuelle under "skadeomfang" velger du det som gir størst
                    samfunnsmessig konsekvens.
                </p>
                <p>
                    Informasjonen som blir sendt inn via dette skjemaet vil bli publisert på
                    <a href="https://www.regobs.no/">www.regobs.no</a> under brukeren «Ulykkesskjema».
                </p>
                <p>
                    Husk å fokusere på læring og fakta, ikke spekuler eller fordel skyld. All informasjon som
                    registreres skal være anonymisert. Informasjon du kun skal dele med Snøskredvarslingen sendes
                    <a href="mailto:snoskredvarslingen@nve.no">snoskredvarslingen@nve.no</a>. Tusen takk for at dere
                    deler!
                </p>
            `,
        }
    },
    map: {
        type: "Map",
        accuracyTitle: {
            en: "Spatial accuracy",
            nb: "Stedsnøyaktighet",
        },
        accuracy: {
            0: {
                en: "Exact",
                nb: "Eksakt",
            },
            100: {
                en: "100 m",
                nb: "100 m",
            },
            500: {
                en: "500 m",
                nb: "500 m",
            },
            1000: {
                en: "1 km",
                nb: "1 km",
            },
            '-1': {
                en: "More than 1 km",
                nb: "Mer enn 1 km",
            }
        }
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
            en: "Phase of tour",
            nb: "Turfase",
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
    avalancheTrigger: {
        type: "KdvSelect",
        titleKey: ["REGISTRATION", "SNOW", "AVALANCHE_OBS", "AVALANCHE_TRIGGER"],
        selectKey: ["KdvRepositories", "Snow_AvalancheTriggerKDV"],
        key: ["AvalancheObs", "AvalancheTriggerTID"]
    },
    fractureHeight: {
        type: "KdvInteger",
        titleKey: ["REGISTRATION", "SNOW", "AVALANCHE_OBS", "FRACTURE_HEIGTH"],
        preprocessing: (value) => value / 100,
        min: 0,
        max: 1000,
        key: ["AvalancheObs", "FractureHeight"],
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
            nb: "Lokal eller tilreisende"
        },
        select: [
            {
                en: "Local",
                nb: "Lokal",
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
                en: "Foreign tourist",
                nb: "Utenlandsk turist",
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