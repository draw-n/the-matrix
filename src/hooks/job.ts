import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "../api/job";

export const useAllJobs = (equipmentId?: string, userId?: string) => {
    return useQuery({
        queryKey: ["jobs", equipmentId, userId],
        queryFn: async () => getAllJobs(equipmentId, userId),
    });
}