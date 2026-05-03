import { gold, gray, green, purple, red, } from "@ant-design/colors";
import { FilamentTemperatures } from "./material";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    FrownOutlined,
    PauseCircleOutlined,
} from "@ant-design/icons";

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
    key?: string;
    piUrl?: string;
    imageName?: string;
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

export const equipmentStatusStyles: Record<
    EquipmentStatus,
    { color: string; icon:React.ComponentType<any> }
> = {
    available: {
        color: green[4],
        icon: CheckCircleOutlined,
    },
    error: {
        color: red[4],
        icon: CloseCircleOutlined,
    },
    paused: {
        color: gold[4],
        icon: PauseCircleOutlined,
    },
    busy: {
        color: purple[4],
        icon: ClockCircleOutlined,
    },
    offline: {
        color: gray[2],
        icon: FrownOutlined,
    },
};

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
