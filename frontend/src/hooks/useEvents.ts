import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllEvents,
    editEventById,
    createEvent,
    deleteEventById,
} from "../api/event";
import { Event, EventStatus } from "../types/event";
import { message } from "antd";

/**
 * Hook to fetch all events, optionally filtered by their statuses.
 * @param statuses - An array of event statuses to filter by (e.g., ["active", "archived"]).
 * @returns - A React Query object containing the events data, loading state, and error state.
 */
export const useAllEvents = (statuses?: EventStatus[]) => {
    return useQuery({
        queryKey: ["events", statuses],
        queryFn: async () => getAllEvents(statuses),
    });
};

/**
 * Hook to edit an event by its unique identifier.
 * @returns - A mutation object that can be used to update an event and handle success or error states.
 */
export const useEditEventById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            eventId,
            updatedEvent,
            file,
        }: {
            eventId: string;
            updatedEvent: Partial<Event>;
            file?: File;
        }) => editEventById(eventId, updatedEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["events"],
            });
            message.success("Event updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update event.");
        },
    });
};

/**
 * Hook to create a new event with the provided details.
 * @returns - A mutation object that can be used to create an event and handle success or error states.
 */
export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            newEvent,
            file,
        }: {
            newEvent: Partial<Event>;
            file?: File;
        }) => createEvent(newEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            message.success("Event created successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to create event.");
        },
    });
};

/**
 * Hook to delete an event by its unique identifier.
 * @returns - A mutation object that can be used to delete an event and handle success or error states.
 */
export const useDeleteEventById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId }: { eventId: string }) =>
            deleteEventById(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            message.success("Event deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete event.");
        },
    });
};
