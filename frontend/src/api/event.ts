import axios from "axios";
import { Event, EventType } from "../types/event";

/**
 * Retrieves all events, optionally filtered by status.
 * @param statuses - An array of event statuses to filter by (e.g., ["upcoming", "past"]).
 * @returns - A promise that resolves to an array of Event objects.
 * @throws - Logs an error if the API request fails.
 */
export const getAllEvents = async (types?: EventType[], startDate?: Date, endDate?: Date) => {
    try {
        const response = await axios.get<Event[]>(
            `${import.meta.env.VITE_BACKEND_URL}/events`,
            { params: { type: types ? types.join(",") : undefined, startDate, endDate } },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching events:", error);
        throw new Error(
            error.response?.data.message || "Failed to retrieve events.",
        );
    }
};

/**
 * Updates an existing event by its unique identifier with the provided details.
 * @param eventId - The unique identifier of the event to be updated.
 * @param updatedEvent - An object containing the updated details of the event. This should include properties such as title, type, status, imageName, description, createdBy, dateCreated, lastUpdatedBy, and dateLastUpdated.
 * @returns - A promise that resolves to the updated Event object.
 */
export const editEventById = async (
    eventId: string,
    updatedEvent: Partial<Event>,
) => {
    if (eventId === "") {
        throw new Error("Event ID not found.");
    }
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
            updatedEvent,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating event:", error);
        throw new Error(
            error.response?.data.message || "Failed to update event.",
        );
    }
};

/**
 * Creates a new event with the provided details.
 * @param newEvent - An object containing the details of the event to be created. This should include properties such as title, type, status, imageName, description, createdBy, dateCreated, lastUpdatedBy, and dateLastUpdated.
 * @returns - A promise that resolves to the created Event object.
 */
export const createEvent = async (
    newEvent: Partial<Event>,
) => {
    try {

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/events`,
            newEvent,
        
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating event:", error);
        throw new Error(
            error.response?.data.message || "Failed to create event.",
        );
    }
};

/**
 * Deletes an event by its unique identifier.
 * @param eventId - The unique identifier of the event to delete.
 * @returns - A promise that resolves when the event is deleted.
 */
export const deleteEventById = async (eventId: string) => {
    try {
        if (eventId === "") {
            throw new Error("Event ID not found.");
        }
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting event:", error);
        throw new Error(
            error.response?.data.message || "Failed to delete event.",
        );
    }
};
