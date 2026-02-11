import axios from "axios";
import { Announcement } from "../types/announcement";

/**
 * Retrieves all announcements, optionally filtered by status.
 * @param statuses - An array of announcement statuses to filter by (e.g., ["active", "archived"]).
 * @returns - A promise that resolves to an array of Announcement objects.
 * @throws - Logs an error if the API request fails.
 */
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
        console.error("Error fetching announcements:", error);
    }
};

/**
 * Updates an existing announcement by its unique identifier with the provided details.
 * @param announcementId - The unique identifier of the announcement to be updated.
 * @param updatedAnnouncement - An object containing the updated details of the announcement. This should include properties such as title, type, status, imageName, description, createdBy, dateCreated, lastUpdatedBy, and dateLastUpdated.
 * @returns - A promise that resolves to the updated Announcement object.
 */
export const editAnnouncementById = async (announcementId: string, updatedAnnouncement: Partial<Announcement>) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/announcements/${announcementId}`,
            updatedAnnouncement
        );
        return response.data;
    } catch (error) {
        console.error("Error updating announcement:", error);
    }
};

/**
 * Creates a new announcement with the provided details.
 * @param newAnnouncement - An object containing the details of the announcement to be created. This should include properties such as title, type, status, imageName, description, createdBy, dateCreated, lastUpdatedBy, and dateLastUpdated. 
 * @returns - A promise that resolves to the created Announcement object.
 */
export const createAnnouncement = async (newAnnouncement: Partial<Announcement>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/announcements`,
            newAnnouncement
        );
        return response.data;
    } catch (error) {
        console.error("Error creating announcement:", error);
    }
}

export const deleteAnnouncementById = async (announcementId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/announcements/${announcementId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting announcement:", error);
    }
};