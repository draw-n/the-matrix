import { FilamentTemperatures } from "./Material";

export interface Equipment {
    _id: string;
    name: string;
    routePath: string;
    headline?: string;
    category: string;
    properties?: EquipmentProperties;
    status: string;
    description: string;
    imgSrc?: string;
    ipUrl?: string;
}

export type EquipmentStatus =
    | "available"
    | "paused"
    | "busy"
    | "error"
    | "offline";

export type EquipmentProperties = {
    nozzle?: number;
    material?: string;
};

export interface FilamentAdvancedSettings {
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
