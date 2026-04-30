import axios from "axios";
import { Job, JobStatus } from "../types/job";
import { FilamentAdvancedSettings } from "../types/equipment";
import { Material } from "../types/material";

/**
 * Retrieves all jobs, optionally filtered by status, equipment ID, and/or user ID.
 * @param statuses - An array of job statuses to filter by (e.g., ["ready", "completed"]).
 * @param equipmentId - The unique identifier of the equipment to filter jobs by.
 * @param userId - The unique identifier of the user to filter jobs by.
 * @returns - A promise that resolves to an array of Job objects.
 */
export const getAllJobs = async (
    statuses?: JobStatus[],
    equipmentId?: string,
    userId?: string,
) => {
    try {
        const response = await axios.get<Job[]>(
            `${import.meta.env.VITE_BACKEND_URL}/jobs?`,
            {
                params: {
                    userId,
                    equipmentId,
                    status: statuses ? statuses.join(",") : undefined,
                },
            },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching jobs:", error);

        throw new Error(
            error.response?.data.message || "Failed to fetch jobs.",
        );
    }
};

/**
 * Retrieves chart data for jobs, optionally filtered by user ID and number of days.
 * @param userId - The unique identifier of the user to filter job data by.
 * @param days - The number of days to include in the chart data (e.g., 7 for the last week).
 * @returns - A promise that resolves to an object containing the job chart data, which may include properties such as job counts by status and dates.
 */
export const getJobChartData = async (userId?: string, days?: number) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/chart-data`,
            {
                params: {
                    userId,
                    days,
                },
            },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching job chart data:", error);
        throw new Error(
            error.response?.data.message || "Failed to fetch job chart data.",
        );
    }
};

/**
 * Retrieves the total filament used in grams for a specific user.
 * @param userId - The unique identifier of the user to filter filament usage data by.
 * @returns - A promise that resolves to the total filament used in grams for the specified user. If no userId is provided, it may return the total filament used across all users or undefined, depending on the backend implementation.
 */
export const getFilamentUsedGrams = async (userId?: string) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/filament-usage`,
            {
                params: {
                    userId,
                },
            },
        );
        return response.data.totalFilamentUsed;
    } catch (error: any) {
        console.error("Error fetching filament usage data:", error);
        throw new Error(
            error.response?.data.message ||
                "Failed to fetch filament usage data.",
        );
    }
};

/**
 * Creates a new job with the provided details.
 * @param newJob - An object containing the details of the job to be created. This should include properties such as equipmentId, userId, gcodeFileName, and optionally filamentUsedGrams and estimatedTimeSeconds.
 * @returns - A promise that resolves to the created Job object.
 */
export const createJob = async (newJob: {
    fileName: string;
    material?: Material;
    options: FilamentAdvancedSettings;
    userId: string;
}) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/jobs`,
            newJob,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating job:", error);
        throw new Error(
            error.response?.data.message || "Failed to create job.",
        );
    }
};

/**
 * Edits an existing job by its unique identifier with the provided updates.
 * @param jobId - The unique identifier of the job to be edited.
 * @param updates - An object containing the properties of the job that need to be updated. This can include any subset of the Job properties such as status, filamentUsedGrams, estimatedTimeSeconds, etc.
 * @returns - A promise that resolves to the updated Job object after the changes have been applied. If the job with the specified ID does not exist, it may throw an error or return undefined, depending on the backend implementation.
 * @throws - Throws an error if the job cannot be edited due to reasons such as the job not existing, validation errors, or server issues. The error message will provide details about the failure.
 */
export const editJobById = async (jobId: string, updates: Partial<Job>) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`,
            updates,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error editing job:", error);
        throw new Error(
            error.response?.data.message || "Failed to edit job.",
        );
    }
};

/**
 * Deletes a job by its unique identifier.
 * @param jobId - The unique identifier of the job to be deleted.
 * @returns - A promise that resolves to a success message or the deleted Job object, depending on the backend implementation. If the job with the specified ID does not exist, it may throw an error or return undefined.
 */
export const deleteJobById = async (jobId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting job:", error);
        throw new Error(
            error.response?.data.message || "Failed to delete job.",
        );
    }
};

/**
 * Reprints a job by its unique identifier. This function sends a request to the backend to create a new job based on the details of an existing job, effectively allowing the user to reprint a previous job without having to go through the entire job creation process again.
 * @param jobId - The unique identifier of the job to be reprinted.
 * @returns - A promise that resolves to the newly created Job object that is based on the original job's details. If the job with the specified ID does not exist, it may throw an error or return undefined, depending on the backend implementation.
 */
export const reprintJobById = async (jobId: string) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error reprinting job:", error);
        throw new Error(
            error.response?.data.message || "Failed to reprint job.",
        );
    }
}
