import { useQuery } from "@tanstack/react-query";
import { getAllIssues } from "../api/issue";
import { IssueStatus } from "../types/issue";

/**
 * Hook to fetch all issues, optionally filtered by their statuses and associated equipment.
 * @param statuses - An array of issue statuses to filter by (e.g., ["open", "closed"]).
 * @param equipmentId - The unique identifier of the equipment to filter issues by.
 * @returns - A React Query object containing the issues data, loading state, and error state.
 */
export const useAllIssues = (statuses?: IssueStatus[], equipmentId?: string) => {
    return useQuery({
        queryKey: ["issues", statuses, equipmentId],
        queryFn: async () => getAllIssues(statuses, equipmentId),
    });
}