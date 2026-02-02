import { FilamentTemperatures } from "./material";

export interface Equipment {
    uuid: string;
    name: string;
    routePath: string;
    headline?: string;
    categoryId: string;
    properties?: EquipmentProperties;
    status: string;
    description: string;
    imgSrc?: string;
    ipUrl?: string;
    remotePrintAvailable?: boolean;
    cameraUrl?: string;
}

export interface WithEquipment {
    equipment?: Equipment;
}

export interface WithEquipments {
    equipments?: Equipment[];
}

export interface WithEquipmentId {
    equipmentId?: string;
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
