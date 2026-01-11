import axios from "axios";
import { Announcement } from "../types/announcement";

export const getAllAnnouncements = async (statuses?: string[]) => {
    try {
        let query = "";
        if (statuses && statuses.length > 0) {
            query = `?status=${statuses.join(",")}`;
        }
        const response = await axios.get<Announcement[]>(
            `${import.meta.env.VITE_BACKEND_URL}/announcements${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching routes:", error);
    }
};
