import { Form } from "./element";
import { CONTENT } from "./spec";
import { Language } from "./types";

let url = new URL(window.location.href);
let lang = url.searchParams.get("lang") as Language;
lang = ["en", "nb"].indexOf(lang) >= 0 ? lang : "nb";

let root = document.getElementById("ulykkesskjema");
let form = new Form();

Object.entries(CONTENT).forEach(([id, content]) => {
    switch (content.type) {
        case "TextContent": {
            root.appendChild(form.createTextContent(content, lang));
            break;
        }
        case "TextInput": {
            root.appendChild(form.createTextInput(id, content, lang));
            break;
        }
        case "Help": {
            root.appendChild(form.createHelpText(content, lang));
            break;
        }
        case "Map": {
            form.createMapInput(root, content, lang);
            break;
        }
        case "Date": {
            root.appendChild(form.createDateInput(id, content, lang));
            break;
        }
        case "KdvSelect": {
            root.appendChild(form.createKdvSelect(id, content, lang));
            break;
        }
        case "Select": {
            root.appendChild(form.createSelect(id, content, lang));
            break;
        }
        case "Integer": {
            root.appendChild(form.createInteger(id, content, lang));
            break;
        }
        case "KdvInteger": {
            root.appendChild(form.createKdvInteger(id, content, lang));
            break;
        }
        case "Image": {
            root.appendChild(form.createImage(id, content, lang));
            break;
        }
        case "Button": {
            let button = form.createButton(content, lang);
            root.appendChild(button);
            break;
        }
        case "SubmitMessage": {
            root.appendChild(form.createSubmitMessage(content, lang));
            break;
        }
    }
})