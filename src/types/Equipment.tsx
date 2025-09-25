import { FilamentTemperatures } from "./Material";

export interface Equipment {
    _id: string;
    name: string;
    routePath: string;
    headline?: string;
    category: string;
    properties?: { nozzle?: Number; materials?: string[] };
    status: string;
    description: string;
    imgSrc?: string;
    ipUrl?: string;
}

export interface FilamentMoreSettings {
    infill: number;
    layerHeight: number;
    supports: boolean;
    temperatures: FilamentTemperatures;
    horizontalShell: {
        topLayers: number;
        bottomLayers: number;
    };
    verticalShell: {
        perimeters: number;
    };
}

export interface RemotePrint {
    date: Date,
    fileName: string
}