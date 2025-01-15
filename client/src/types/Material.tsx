export interface Material {
    _id: string;
    name: string;
    shortName: string;
    type: string;
    properties: string[];
    description: string;
    remotePrintAvailable: boolean;
    temperatures?: FilamentTemperatures;
}

export interface FilamentTemperatures {
    extruder: {
        firstLayer: number;
        otherLayers: number;
    };
    bed: {
        firstLayer: number;
        otherLayers: number;
    };
}
