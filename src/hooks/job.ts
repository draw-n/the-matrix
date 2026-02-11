import { useQuery } from "@tanstack/react-query";
import { getAllJobs, getFilamentUsedGrams, getJobChartData } from "../api/job";
import { JobStatus } from "../types/job";

/**
 * Hook to fetch all jobs, optionally filtered by their statuses, associated equipment, and user.
 * @param statuses - An array of job statuses to filter by (e.g., ["pending", "in_progress", "completed"]).
 * @param equipmentId - The unique identifier of the equipment to filter jobs by.
 * @param userId - The unique identifier of the user to filter jobs by.
 * @returns - A React Query object containing the jobs data, loading state, and error state.
 */
export const useAllJobs = (statuses?: JobStatus[], equipmentId?: string, userId?: string) => {
    return useQuery({
        queryKey: ["jobs", statuses, equipmentId, userId],
        queryFn: async () => getAllJobs(statuses, equipmentId, userId),
    });
}

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
}

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
}