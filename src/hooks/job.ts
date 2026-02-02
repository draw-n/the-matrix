import { useQuery } from "@tanstack/react-query";
import { getAllJobs, getJobChartData } from "../api/job";

export const useAllJobs = (status?: string, equipmentId?: string, userId?: string) => {
    return useQuery({
        queryKey: ["jobs", equipmentId, userId],
        queryFn: async () => getAllJobs(status, equipmentId, userId),
    });
}

export const useJobChartData = (userId?: string) => {
    return useQuery({
        queryKey: ["jobChartData", userId],
        queryFn: async () => getJobChartData(userId),
    });
}