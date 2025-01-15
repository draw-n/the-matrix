export interface Equipment {
    _id: string;
    name: string;
    routePath: string;
    type: string;
    properties?: { nozzle?: Number; materials?: string[] };
    status: string;
    description: string;
    imgSrc?: string;
}

export interface FilamentMoreSettings {
    infill: number;
    layerHeight: number;
    supports: string;
    temperatures: {
        extruder: {
            firstLayer: number;
            otherLayers: number;
        };
        bed: {
            firstLayer: number;
            otherLayers: number;
        };
    };
    horizontalShell: {
        topLayers: number;
        bottomLayers: number;
    };
    verticalShell: {
        perimeters: number;
    };
}
