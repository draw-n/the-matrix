import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteJobById,
    editJobById,
    getAllJobs,
    getFilamentUsedGrams,
    getJobChartData,
    reprintJobById,
} from "../api/job";
import { Job, JobStatus } from "../types/job";
import { message } from "antd";

/**
 * Hook to fetch all jobs, optionally filtered by their statuses, associated equipment, and user.
 * @param statuses - An array of job statuses to filter by (e.g., ["pending", "in_progress", "completed"]).
 * @param equipmentId - The unique identifier of the equipment to filter jobs by.
 * @param userId - The unique identifier of the user to filter jobs by.
 * @returns - A React Query object containing the jobs data, loading state, and error state.
 */
export const useAllJobs = (
    statuses?: JobStatus[],
    equipmentId?: string,
    userId?: string,
) => {
    return useQuery({
        queryKey: ["jobs", statuses, equipmentId, userId],
        queryFn: async () => getAllJobs(statuses, equipmentId, userId),
    });
};

/**
 * Hook to fetch job chart data for a specific user and time range.
 * @param userId - The unique identifier of the user to filter job chart data by.
 * @param days - The number of days to include in the job chart data.
 * @returns - A React Query object containing the job chart data, loading state, and error state.
 */
export const useJobChartData = (userId?: string, days?: number) => {
    return useQuery({
        queryKey: ["jobChartData", userId, days],
        queryFn: async () => getJobChartData(userId, days),
    });
};

/**
 * Hook to fetch the total grams of filament used by a specific user.
 * @param userId - The unique identifier of the user to filter filament usage data by.
 * @returns - A React Query object containing the filament usage data, loading state, and error state.
 */
export const useFilamentUsedGrams = (userId?: string) => {
    return useQuery({
        queryKey: ["filamentUsedGrams", userId],
        queryFn: async () => getFilamentUsedGrams(userId),
    });
};

/**
 * deleteJobById is a hook that provides a mutation function to delete a job by its unique identifier. It also handles the success and error states of the mutation, invalidating relevant queries to ensure the UI reflects the updated state after a job is deleted.
 * @returns - A mutation object that can be used to delete a job and handle success or error states.
 */
export const useDeleteJobById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["deleteJob"],
        mutationFn: async ({ jobId }: { jobId: string }) =>
            deleteJobById(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            message.success("Job deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete job.");
        },
    });
};

/**
 * Hook to edit a job by its unique identifier. It provides a mutation function that takes the job ID and the fields to be updated, and it handles the success and error states of the mutation. On success, it invalidates relevant queries to ensure the UI reflects the updated job data.
 * @returns - A mutation object that can be used to edit a job and handle success or error states.
 */
export const useEditJobById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["editJob"],
        mutationFn: async ({
            jobId,
            updatedFields,
        }: {
            jobId: string;
            updatedFields: Partial<Job>;
        }) => editJobById(jobId, updatedFields),
        // onSuccess receives (data, variables, context). Use variables.jobId to invalidate the specific job cache.
        onSuccess: (jobId) => {
            if (jobId) {
                queryClient.invalidateQueries({ queryKey: ["job", jobId] });
            }
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update job.");
        },
    });
};

/**
 * Hook to reprint a job by its unique identifier. It provides a mutation function that takes the job ID and triggers the reprint action, handling success and error states. On success, it invalidates relevant queries to ensure the UI reflects the updated job state.
 * @returns - A mutation object that can be used to reprint a job and handle success or error states. 
 */
export const useReprintJobById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["reprintJob"],
        mutationFn: async ({ jobId }: { jobId: string }) => reprintJobById(jobId),
        onSuccess: (jobId) => {
            if (jobId) {
                queryClient.invalidateQueries({ queryKey: ["job", jobId] });
            }
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to reprint job.");
        },
    });
};
