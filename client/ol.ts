import * as Layer from "./ol/layer";
import Map from "ol/Map";
import { getCenter } from "./ol/layer";


// Keeps track of the number of times basemap tiles has failed to load.
let backoff_counter_bw: Record<string, number> = {};

class MapContainer {
    map: Map;
    accuracyCircle: HTMLDivElement;
    accuracy = 0;

    constructor(target: HTMLDivElement) {
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

        this.accuracyCircle = document.createElement("div");
        this.accuracyCircle.classList.add("map-circle");
        target.appendChild(this.accuracyCircle);
        map.on("moveend", () => this.setAccuracy(this.accuracy));
    
        this.map = map;
    }

    setAccuracy(accuracy: number) {
        this.accuracy = accuracy
        if (accuracy && accuracy > 0) {
            let resolution = this.map.getView().getResolution();
            let size = 2 * accuracy / resolution;
            this.accuracyCircle.style.display = "block";
            this.accuracyCircle.style.width = `${size}px`;
            this.accuracyCircle.style.height = `${size}px`;
            this.accuracyCircle.style.top = `calc(50% - ${size/2}px)`;
            this.accuracyCircle.style.left = `calc(50% - ${size/2}px)`;
            this.accuracyCircle.style.borderRadius = `${size/2}px`;
            this.accuracyCircle.style.borderWidth = size > 2 ? "1px" : "0";
        } else {
            this.accuracyCircle.style.display = "none";
        }
        console.log(this.accuracyCircle.outerHTML);
    }

    getCenter() {
        return getCenter(this.map);
    }
}

export { MapContainer };