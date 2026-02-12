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
        const response = await axios.get<Announcement[]>(
            `${import.meta.env.VITE_BACKEND_URL}/announcements`,
            { params: { status: statuses ? statuses.join(",") : undefined } },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching announcements:", error);
        throw new Error(error.response?.data.message || "Failed to retrieve announcements.");
    }
};

/**
 * Updates an existing announcement by its unique identifier with the provided details.
 * @param announcementId - The unique identifier of the announcement to be updated.
 * @param updatedAnnouncement - An object containing the updated details of the announcement. This should include properties such as title, type, status, imageName, description, createdBy, dateCreated, lastUpdatedBy, and dateLastUpdated.
 * @returns - A promise that resolves to the updated Announcement object.
 */
export const editAnnouncementById = async (
    announcementId: string,
    updatedAnnouncement: Partial<Announcement>,
) => {
    if (announcementId === "") {
        throw new Error("Announcement ID not found.");
    }
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/announcements/${announcementId}`,
            updatedAnnouncement,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating announcement:", error);
        throw new Error(error.response?.data.message || "Failed to update announcement.");
    }
};

/**
 * Creates a new announcement with the provided details.
 * @param newAnnouncement - An object containing the details of the announcement to be created. This should include properties such as title, type, status, imageName, description, createdBy, dateCreated, lastUpdatedBy, and dateLastUpdated.
 * @returns - A promise that resolves to the created Announcement object.
 */
export const createAnnouncement = async (
    newAnnouncement: Partial<Announcement>,
) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/announcements`,
            newAnnouncement,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating announcement:", error);
        throw new Error(error.response?.data.message || "Failed to create announcement.");
    }
};

/**
 * Deletes an announcement by its unique identifier.
 * @param announcementId - The unique identifier of the announcement to delete.
 * @returns - A promise that resolves when the announcement is deleted.
 */
export const deleteAnnouncementById = async (announcementId: string) => {
    try {
        if (announcementId === "") {
            throw new Error("Announcement ID not found.");
        }
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/announcements/${announcementId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting announcement:", error);
        throw new Error(error.response?.data.message || "Failed to delete announcement.");
    }
};
