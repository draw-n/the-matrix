import { useQuery } from "@tanstack/react-query";
import { getAllJobs, getFilamentUsedGrams, getJobChartData } from "../api/job";

export const useAllJobs = (statuses?: string[], equipmentId?: string, userId?: string) => {
    return useQuery({
        queryKey: ["jobs", statuses, equipmentId, userId],
        queryFn: async () => getAllJobs(statuses, equipmentId, userId),
    });
}

export const useJobChartData = (userId?: string, days?: number) => {
    return useQuery({
        queryKey: ["jobChartData", userId, days],
        queryFn: async () => getJobChartData(userId, days),
    });
}

export const useFilamentUsedGrams = (userId?: string) => {
    return useQuery({
        queryKey: ["filamentUsedGrams", userId],
        queryFn: async () => getFilamentUsedGrams(userId),
    });
}