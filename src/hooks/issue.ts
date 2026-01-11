import { useQuery } from "@tanstack/react-query";
import { getAllIssues } from "../api/issue";

export const useAllIssues = (statuses?: string[], equipmentId?: string) => {
    return useQuery({
        queryKey: ["issues", statuses, equipmentId],
        queryFn: async () => getAllIssues(statuses, equipmentId),
    });
}