import * as Layer from "./ol/layer";
import Map from "ol/Map";
import { getCenter } from "./ol/layer";


// Keeps track of the number of times basemap tiles has failed to load.
let backoff_counter_bw: Record<string, number> = {};

function initMap(target: HTMLDivElement): Map {
    let backoff_counter: Record<string, number> = {};

    let baseLayer = Layer.createBaseLayer('topo4', backoff_counter);

    let layers = [
        baseLayer,
    ];

    let map = Layer.createMap(layers, target);

    let centerCross = document.createElement("img");
    centerCross.classList.add("map-center");
    centerCross.src = "./static/img/crosshairs_red.svg";
    target.appendChild(centerCross);

    return map;
}

export { initMap, getCenter };