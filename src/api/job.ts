import axios from "axios";
import { Job } from "../types/job";

export const getAllJobs = async (
    status?: string,
    equipmentId?: string,
    userId?: string,
) => {
    try {
        let query = "";
        if (equipmentId && userId && status) {
            query += `equipmentId=${equipmentId}&userId=${userId}&status=${status}`;
        } else if (userId && status) {
            query += `userId=${userId}&status=${status}`;
        } else if (equipmentId && status) {
            query += `equipmentId=${equipmentId}&status=${status}`;
        } else if (userId && equipmentId) {
            query += `userId=${userId}&equipmentId=${equipmentId}`;
        } else if (equipmentId) {
            query += `equipmentId=${equipmentId}`;
        } else if (userId) {
            query += `userId=${userId}`;
        } else if (status) {
            query += `status=${status}`;
        }
        const response = await axios.get<Job[]>(
            `${import.meta.env.VITE_BACKEND_URL}/jobs?${query}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
};
