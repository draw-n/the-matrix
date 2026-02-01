export interface Job {
    uuid: string;
    equipmentId: string;
    userId: string;
    status: JobStatus;
    gcodeFileName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type JobStatus = "queued" | "sent";

export interface WithJob {
    job?: Job;
}