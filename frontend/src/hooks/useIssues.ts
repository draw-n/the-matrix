import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createIssue,
    deleteIssueById,
    editIssueById,
    getAllIssues,
} from "../api/issue";
import { Issue, IssueStatus } from "../types/issue";
import {message} from "antd";

/**
 * Hook to fetch all issues, optionally filtered by their statuses and associated equipment.
 * @param statuses - An array of issue statuses to filter by (e.g., ["open", "closed"]).
 * @param equipmentId - The unique identifier of the equipment to filter issues by.
 * @returns - A React Query object containing the issues data, loading state, and error state.
 */
export const useAllIssues = (
    statuses?: IssueStatus[],
    equipmentId?: string,
) => {
    return useQuery({
        queryKey: ["issues", statuses, equipmentId],
        queryFn: async () => getAllIssues(statuses, equipmentId),
    });
};

/**
 * Hook to create a new issue with the provided details.
 * @returns - A mutation object that can be used to create an issue and handle success or error states.
 */
export const useCreateIssue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ newIssue }: { newIssue: Partial<Issue> }) => createIssue(newIssue),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
            message.success("Issue created successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to create issue.");
        },
    });
};

/**
 * Hook to edit an issue by its unique identifier.
 * @returns - A mutation object that can be used to update an issue and handle success or error states.
 */
export const useEditIssueById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            issueId,
            editedIssue,
        }: {
            issueId: string;
            editedIssue: Partial<Issue>;
        }) => editIssueById(issueId, editedIssue),
        onSuccess: ({ issueId }) => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
            queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
            message.success("Issue updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update issue.");
        },
    });
};

/**
 * Hook to delete an issue by its unique identifier.
 * @returns - A mutation object that can be used to delete an issue and handle success or error states.
 */
export const useDeleteIssueById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ issueId }: { issueId: string }) =>
            deleteIssueById(issueId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
            message.success("Issue deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete issue.");
        },
    });
};
