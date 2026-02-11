import axios from "axios";
import { Issue } from "../types/issue";

/**
 * Retrieves all issues, optionally filtered by status and/or equipment ID.
 * @param statuses - An array of issue statuses to filter by (e.g., ["open", "closed"]).
 * @param equipmentId - The unique identifier of the equipment to filter issues by.
 * @returns - A promise that resolves to an array of Issue objects.
 */
export const getAllIssues = async (
    statuses?: string[],
    equipmentId?: string,
) => {
    try {
        const response = await axios.get<Issue[]>(
            `${import.meta.env.VITE_BACKEND_URL}/issues`,
            {
                params: {
                    status: statuses ? statuses.join(",") : undefined,
                    equipmentId: equipmentId || undefined,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
    }
};

/**
 * Creates a new issue with the provided details.
 * @param newIssue - An object containing the details of the issue to be created. This should include properties such as equipmentId, initialDescription, createdBy, and optionally assignedTo.
 * @returns - A promise that resolves to the created Issue object.
 */
export const createIssue = async (newIssue: Partial<Issue>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/issues`,
            newIssue,
        );
        return response.data;
    } catch (error) {
        console.error("Problem creating an issue: ", error);
    }
};

export const editIssueById = async (issueId: string, updatedIssue: Partial<Issue>) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/issues/${issueId}`,
            updatedIssue,
        );
        return response.data;
    } catch (error) {
        console.error("Problem updating an issue: ", error);
    }
};

export const deleteIssueById = async (issueId: string) => {
    try {
        const response = await axios.delete(    
            `${import.meta.env.VITE_BACKEND_URL}/issues/${issueId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Problem deleting an issue: ", error);
    }
};