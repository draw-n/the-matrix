import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllEvents,
    editEventById,
    createEvent,
    deleteEventById,
} from "../api/event";
import { Event, EventStatus, EventType } from "../types/event";
import { message } from "antd";

/**
 * Hook to fetch all events, optionally filtered by their types.
 * @param types - An array of event types to filter by (e.g., ["office hours", "meeting"]).
 * @returns - A React Query object containing the events data, loading state, and error state.
 */
export const useAllEvents = (types?: EventType[], startDate?: Date, endDate?: Date) => {
    return useQuery({
        queryKey: ["events", types, startDate, endDate],
        queryFn: async () => getAllEvents(types, startDate, endDate),
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
    
        }: {
            newEvent: Partial<Event>;
        }) => createEvent(newEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
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
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete event.");
        },
    });
};
