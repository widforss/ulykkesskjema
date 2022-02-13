import {DateInput, HelpText, ImageInput, KdvIntegerInput, IntegerInput, KdvSelectInput, Language, MapInput, SelectInput, TextContent, TextInput, Button, SubmitMessage} from "./types";
import { fetchTranslations, Translations } from "./translations";
import { makeRequest } from "./fetch";
import { MapContainer } from "./ol";

interface Registration {
    DtObsTime: string,
    GeoHazardTID: number,
    ObsLocation: {
        Latitude: number,
        Longitude: number,
        Uncertainty: number,
    },
    Incident: {
        ActivityInfluencedTID: number,
        DamageExtentTID: number,
        Comment: string,
        IncidentURLs: {
            UrlLine: string,
            UrlDescription: string,
        }[]
    },
    AvalancheObs: {
        DtAvalancheTime: string,
        DestructiveSizeTID: number,
        AvalCauseTID: number,
        TerrainStartZoneTID: number,
        AvalancheTID: number,
    }
    Attachments: {
        AttachmentUploadId: string,
        GeoHazardTID: number,
        RegistrationTID: number,
    }[]
}

const global = window as any;
const SITEKEY = "6LcQ0nceAAAAALaEs5JSLdo-06QD1B6cZ87_QlJi";

const LANG_KEYS = {
    nb: 1,
    en: 2,
}

export class Form {
    registration: Registration = {
        DtObsTime: null,
        GeoHazardTID: 10,
        ObsLocation: {
            Latitude: null,
            Longitude: null,
            Uncertainty: null,
        },
        Incident: {
            ActivityInfluencedTID: null,
            DamageExtentTID: null,
            Comment: null,
            IncidentURLs: [],
        },
        AvalancheObs: {
            DtAvalancheTime: null,
            DestructiveSizeTID: null,
            AvalCauseTID: null,
            TerrainStartZoneTID: null,
            AvalancheTID: null,
        },
        Attachments: [],
    };

    specialQ: {[id: string]: string} = {};

    createTextContent(spec: TextContent, lang: Language): HTMLElement {
        let title = document.createElement(spec.level);
        title.innerHTML = spec.title[lang];
        if (spec.level != "h1") {
            title.classList.add("input-container");
        }
        return title;
    }

    createHelpText(spec: HelpText, lang: Language, translations: Translations): HTMLElement {
        let text = document.createElement("div");
        let textContent = translations[lang].help.filter((entry) => 
            entry.RegistrationTID == spec.registration
            && entry.GeoHazardTID == spec.geohazard
            && entry.LangKey == LANG_KEYS[lang]
        )[0].Text;
        textContent = textContent
            .replace(/\#/g, "")
            .replace(/\n/g, "<br>");
        text.innerHTML = textContent;
        text.classList.add("help-text");
        text.classList.add("input-container");
        return text;
    }

    createTextInput(id: string, spec: TextInput, lang: Language): HTMLElement {
        let elemType;
        switch (spec.length) {
            case "long": {
                let [container, input] = createInput<HTMLTextAreaElement>("textarea", `${spec.title[lang]}:`, id);
                input.classList.add("textarea-input");
                input.oninput = () => setInput(input.value, spec.key, this.registration);
                return container;
            }
            case "short": {
                let [container, input] = createInput<HTMLInputElement>("input", `${spec.title[lang]}:`, id);
                input.oninput = () => setInput(input.value, spec.key, this.registration);
                input.type = "text";
                return container;
            }
            case "url": {
                let [container, input] = createInput<HTMLInputElement>("input", `${spec.title[lang]}:`, id);
                input.oninput = () => setUrl(input.value, spec.key, this.registration);
                input.type = "text";
                return container;
            }
        }
    }

    createMapInput(parent: HTMLElement, spec: MapInput, lang: Language): HTMLDivElement {
        let container = document.createElement("div");
        let mapDiv = document.createElement("div");
        mapDiv.classList.add("input-container");
        container.classList.add("input-container");
        mapDiv.classList.add("map-input");
        parent.appendChild(container);
        container.appendChild(mapDiv);

        let map = new MapContainer(mapDiv);
        let setLocation = () => {
            let coord = map.getCenter();
            this.registration.ObsLocation.Latitude = coord.y;
            this.registration.ObsLocation.Longitude = coord.x;
        }
        map.map.on("moveend", setLocation);
        setLocation();

        let [selectContainer, select] = createInput<HTMLSelectElement>("select", `${spec.accuracyTitle[lang]}:`, null);
        container.appendChild(selectContainer);
        select.onchange = () => {
            if (!isNaN(Number(select.value))) {
                this.registration.ObsLocation.Uncertainty = Number(select.value);
                map.setAccuracy(this.registration.ObsLocation.Uncertainty);
            } else {
                this.registration.ObsLocation.Uncertainty = null;
                map.setAccuracy(null);
            }
        };
        let emptyOption = document.createElement("option");
        select.appendChild(emptyOption);
        Object.entries(spec.accuracy).forEach(([key, entry]) => {
            let option = document.createElement("option");
            select.appendChild(option);
            option.value = key;
            option.innerText = entry[lang];
        });

        return container;
    }

    createDateInput(id: string, spec: DateInput, lang: Language): HTMLElement {
        let [container, input] = createInput<HTMLInputElement>("input", `${spec.title[lang]}:`, id);
        input.onchange = () => spec.keys.forEach((key) => setInput(
            dateUtcString(new Date(input.value)),
            key,
            this.registration
        ));
        if (spec.mandatory) {
            input.classList.add("mandatory-input");
        }
        input.type = "datetime-local"
        input.min = dateString(spec.after);
        input.max = dateString(spec.before);
        input.value = dateString(spec.before);
        if (spec.mandatory) {
            input.classList.add("mandatory-input");
        }
        input.dispatchEvent(new Event("change"));
        return container;
    }

    createKdvSelect(id: string, spec: KdvSelectInput, lang: Language, translations: Translations): HTMLElement {
        let translation: any = translations[lang].app;
        let titleKey = [...spec.titleKey];
        while (titleKey.length) {
            translation = translation[titleKey.shift()]
        }
        let titleText: string = translation;

        let kdv: any = translations[lang].kdv;
        let selectKey = [...spec.selectKey];
        while (selectKey.length) {
            kdv = kdv[selectKey.shift()];
        }
        let entries: {Id: number, Name: string}[] = kdv;

        let [container, select] = createInput<HTMLSelectElement>("select", `${titleText}:`, id);
        select.oninput = () => setInput(Number(select.value), spec.key, this.registration);
        entries.forEach((entry) => {
            let option = document.createElement("option");
            select.appendChild(option);
            option.value = entry.Id.toString();
            option.innerText = entry.Id ? entry.Name : "";
        });

        return container;
    }

    createSelect(id: string, spec: SelectInput, lang: Language): HTMLElement {
        let [container, select] = createInput<HTMLSelectElement>("select", `${spec.title[lang]}:`, id);
        select.onchange = () => {
            if (select.value !== null) {
                this.specialQ[id] = `${spec.title[lang]}: ${select.value}`;
            } else {
                delete this.specialQ[id]
            }
        }
        let emptyOption = document.createElement("option");
        select.appendChild(emptyOption);
        spec.select.forEach((entry) => {
            let option = document.createElement("option");
            select.appendChild(option);
            option.value = entry[lang];
            option.innerText = entry[lang];
        });
        return container;
    }

    createInteger(id: string, spec: IntegerInput, lang: Language): HTMLElement {
        let [container, input] = createInput<HTMLInputElement>("input", `${spec.title[lang]}:`, id);
        input.oninput = () => {
            let value = Number(input.value);
            if (isNaN(value) || spec.min > value || spec.max < value) {
                input.classList.add("invalid-input");
            } else {
                input.classList.remove("invalid-input");
                this.specialQ[id] = `${spec.title[lang]}: ${input.value}`;
            }
        }
        input.type = "number";
        input.min = spec.min.toString();
        input.max = spec.max.toString();
        input.step = "1";
        return container;
    }

    createKdvInteger(id: string, spec: KdvIntegerInput, lang: Language, translations: Translations): HTMLElement {
        let translation: any = translations[lang].app;
        let titleKey = [...spec.titleKey];
        while (titleKey.length) {
            translation = translation[titleKey.shift()]
        }
        let titleText: string = translation;

        let [container, input] = createInput<HTMLInputElement>("input", `${titleText}:`, id);
        input.oninput = () => {
            let value = Number(input.value);
            if (isNaN(value) || spec.min > value || spec.max < value) {
                input.classList.add("invalid-input");
            } else {
                input.classList.remove("invalid-input");
                input.oninput = () => {
                    let value = Number(input.value);
                    value = spec.preprocessing ? spec.preprocessing(value) : value;
                    setInput(Number(input.value), spec.key, this.registration);
                }
            }
        }
        input.type = "number";
        input.min = spec.min.toString();
        input.max = spec.max.toString();
        input.step = "1";
        return container;
    }

    createImage(id: string, spec: ImageInput, lang: Language): HTMLElement {
        let [container, input] = createInput<HTMLInputElement>("input", `${spec.title[lang]}:`, id);
        input.onchange = async () => {
            if (!input.files) {
                return;
            }
            if (container.lastElementChild && container.lastElementChild.classList.contains("spinner")) {
                container.lastElementChild.remove();
            }

            let numberOfChildren = container.children.length;
            let titleDiv = container.children[numberOfChildren - 3];
            let errorDiv = numberOfChildren > 3 ? container.children[numberOfChildren - 4] : null;
            if (errorDiv && errorDiv.classList.contains("red")) {
                errorDiv.remove();
            }

            let file = input.files[0];
            let image = new Image(this.registration, spec, file, lang);
            
            let spinner = document.createElement("img");
            container.appendChild(spinner);
            spinner.classList.add("spinner");
            spinner.src = "./static/img/spinner.gif";

            image.promise.then(() => {
                spinner.remove();
                container.insertBefore(image.dom, titleDiv);
            }, () => {
                spinner.remove();
                let errorMsg = document.createElement("div");
                errorMsg.innerText = spec.error[lang];
                errorMsg.classList.add("red");
                container.insertBefore(errorMsg, titleDiv);
            });
            input.value = "";
            
        }
        input.type = "file";
        input.accept = "image/png, image/jpeg";
        return container;
    }

    createButton(spec: Button, lang: Language): HTMLElement {
        let container = document.createElement("div");
        container.classList.add("input-container");
        let captchaContainer = document.createElement("div");
        captchaContainer.classList.add("input-container");
        container.appendChild(captchaContainer);
        let button = document.createElement("button");
        button.classList.add("hidden");
        container.appendChild(button);

        let captchaId = global.grecaptcha.render(captchaContainer, {
            sitekey: SITEKEY,
            callback: () => button.classList.remove("hidden"),
            "expired-callback": () => button.classList.add("hidden"),
        });

        button.onclick = () => {
            if (container.lastElementChild && container.lastElementChild.classList.contains("red")) {
                container.lastElementChild.remove();
            }
            if(container.firstElementChild && container.firstElementChild.classList.contains("spinner")) {
                container.firstElementChild.remove();
            }
            let comment = this.registration.Incident.Comment ? this.registration.Incident.Comment : "";
            let qString = Object.values(this.specialQ).join(" ● ");
            this.registration.Incident.Comment = qString ? `${qString} ● ${comment}` : comment;
            let captchaResponse = global.grecaptcha.getResponse(captchaId);
            let body = {reg: this.registration, captcha: captchaResponse};
            let request = makeRequest("POST", "./api/registration", JSON.stringify(body));

            let spinner = document.createElement("img");
            container.appendChild(spinner);
            spinner.classList.add("spinner");
            spinner.src = "./static/img/spinner.gif";

            request.then(() => {
                spinner.remove();
                Array.from(document.getElementsByClassName("input-container")).forEach(container => {
                    (container as HTMLElement).classList.toggle("hidden");
                });
            }, () => {
                spinner.remove();
                let errorDiv = document.createElement("div");
                container.insertBefore(errorDiv, button);
                errorDiv.innerText = spec.error[lang];
                errorDiv.classList.add("red");
            });
        }
        button.type = "button";
        button.innerText = spec.title[lang];
        return container;
    }

    createSubmitMessage(spec: SubmitMessage, lang: Language): HTMLElement {
        let container = document.createElement("div");
        container.classList.add("input-container");
        container.classList.add("submit-message");
        container.classList.add("hidden");
        container.innerHTML = spec.title[lang];
        return container;
    }
}

interface ImageAttachment {
    AttachmentUploadId: string,
    GeoHazardTID: number,
    RegistrationTID: number,
    Comment?: string,
    Copyright?: string,
    Photographer?: string,
}

class Image {
    attachment: ImageAttachment;
    registration: Registration;
    dom: HTMLDivElement = document.createElement("div");
    fieldDiv: HTMLDivElement = document.createElement("div");
    promise: Promise<string>;

    constructor(
        registration: Registration,
        spec: ImageInput,
        photo: File,
        lang: Language,
    ) {
        let reader = new FileReader();
        let formData = new FormData();
        formData.append("file", photo, photo.name);

        this.registration = registration;
        this.promise = makeRequest("POST", "./api/attachment", formData);

        this.dom.classList.add("image-container");
        this.fieldDiv.classList.add("image-field-container");
        this.dom.appendChild(this.fieldDiv);

        reader.onload = async () => {
            let id: string;
            try {
                id = JSON.parse(await this.promise);
            } catch {
                return;
            }

            this.attachment = {
                AttachmentUploadId: id,
                GeoHazardTID: spec.geohazard,
                RegistrationTID: spec.registration,
            }

            let img = document.createElement("img");
            this.dom.insertBefore(img, this.fieldDiv);
            img.src = reader.result as string;
            img.classList.add("input-thumbnail");
            this.registration.Attachments.push(this.attachment);

            let cross = document.createElement("div");
            cross.classList.add("img-close")
            this.dom.appendChild(cross);
            cross.innerText = "╳";
            cross.onclick = this.remove.bind(this);

            this.createFields(spec, lang);
        };
        reader.readAsDataURL(photo);


    }

    remove() {
        this.dom.remove();
        let index = this.registration.Attachments.indexOf(this.attachment);
        this.registration.Attachments.splice(index, 1);
    }

    createFields(spec: ImageInput, lang: Language) {
        let [commentContainer, commentInput] =
            createInput<HTMLInputElement>("input", `${spec.comment[lang]}:`, null);
        let [copyrightContainer, copyrightInput] =
            createInput<HTMLInputElement>("input", `${spec.copyright[lang]}:`, null);
        let [photographerContainer, photographerInput] =
            createInput<HTMLInputElement>("input", `${spec.photographer[lang]}:`, null);
        this.fieldDiv.appendChild(commentContainer);
        this.fieldDiv.appendChild(copyrightContainer);
        this.fieldDiv.appendChild(photographerContainer);
        commentInput.onchange =
            () => this.attachment.Comment = commentInput.value != "" ? commentInput.value : null;
        copyrightInput.onchange =
            () => this.attachment.Copyright = copyrightInput.value != "" ? copyrightInput.value : null;
        photographerInput.onchange =
            () => this.attachment.Photographer = photographerInput.value != "" ? photographerInput.value : null;
    }
}

function createInput<T extends HTMLElement>(
        elemType: string,
        titleText:     string,
        id: string,
    ): [HTMLDivElement, T] {
        let container = document.createElement("div");
        let title = document.createElement("span");
        let input = document.createElement(elemType) as T;
        container.appendChild(title);
        container.appendChild(document.createElement("br"));
        container.appendChild(input);
        container.classList.add("input-container");
        title.classList.add("input-title");
        title.innerText = titleText;
        input.id = id;
        return [container, input];
    }

function setInput(input: string | number, key: string[], registration: Registration) {
    let outermostObject: any = registration;
    key = [...key];
    while (key.length > 1) {
        outermostObject = outermostObject[key.shift()];
    }
    outermostObject[key.shift()] = input != "" ? input : null;
}

function setUrl(input: string | number, key: string[], registration: Registration) {
    let outermostObject: any = registration;
    key = [...key];
    while (key.length > 1) {
        outermostObject = outermostObject[key.shift()];
    }
    let url = {
        UrlDescription: "",
        UrlLine: input,
    }
    outermostObject[key.shift()] = [url];
}

function dateString(date: Date): string {
    let year = date.getFullYear().toString();
    let month = `0${date.getMonth() + 1}`.slice(-2);
    let day = `0${date.getDate()}`.slice(-2);
    let hour = `0${date.getHours()}`.slice(-2);
    let minute = `0${date.getMinutes()}`.slice(-2);
    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function dateUtcString(date: Date): string {
    let year = date.getUTCFullYear().toString();
    let month = `0${date.getUTCMonth() + 1}`.slice(-2);
    let day = `0${date.getUTCDate()}`.slice(-2);
    let hour = `0${date.getUTCHours()}`.slice(-2);
    let minute = `0${date.getUTCMinutes()}`.slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}+00:00`;
}