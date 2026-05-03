import * as THREE from "three";

export interface Job {
    uuid: string;
    equipmentId: string;
    userId: string;
    status: JobStatus;
    gcodeFileName: string;
    filamentUsedGrams?: number;
    estimatedTimeSeconds?: number;
    finishedSnapshotName?: string;
    createdAt?: Date;
    uploadedAt?: Date;
    finishedAt?: Date;
    order?: number;
}

export type JobStatus =
    | "queued"
    | "ready"
    | "printing"
    | "completed"
    | "failed";

export interface WithJob {
    job?: Job;
}

export interface WithJobs {
    jobs?: Job[];
}

export interface MeshFace {
    id?: number;
    centroid: THREE.Vector3;
    normal: THREE.Vector3;
    ellipseAxis?: THREE.Vector3;
    ellipseCenter?: THREE.Vector3;
    ellipseRadii?: [number, number];
    ellipseRotation?: number;
}
