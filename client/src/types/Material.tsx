export interface Material {
    _id: string;
    name: string;
    shortName: string;
    category: string;
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
