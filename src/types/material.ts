export interface Material {
    uuid: string;
    name: string;
    shortName: string;
    categoryId: string;
    properties: string[];
    description: string;
    remotePrintAvailable: boolean;
    temperatures?: FilamentTemperatures;
}

export interface WithMaterial {
    material?: Material;
}

export interface WithMaterials {
    materials?: Material[];
}

export interface WithMaterialId {
    materialId?: string;
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
