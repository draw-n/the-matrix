import axios from "axios";
import { Issue } from "../types/issue";

export const getAllIssues = async (
    statuses?: string[],
    equipmentId?: string
) => {
    try {
        let query = "";

        if (statuses && statuses.length > 0) {
            query += `?status=${statuses.join(",")}`;
        } else if (equipmentId) {
            query += `?equipmentId=${equipmentId}`;
        } else if (statuses && statuses.length > 0 && equipmentId) {
            query += `?status=${statuses.join(",")}&equipmentId=${equipmentId}`;
        }
        const response = await axios.get<Issue[]>(
            `${import.meta.env.VITE_BACKEND_URL}/issues${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
    }
};

export const createIssue = async (newIssue: Partial<Issue>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/issues`,
            newIssue
        );
        return response.data;
    } catch (error) {
        console.error("Problem creating an issue: ", error);
    }
};
