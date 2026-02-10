export interface Job {
    uuid: string;
    equipmentId: string;
    userId: string;
    status: JobStatus;
    gcodeFileName: string;
    filamentUsedGrams?: number;
    estimatedTimeSeconds?: number;
    createdAt?: Date;
    updatedAt?: Date;
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
