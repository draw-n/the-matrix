import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllAnnouncements,
    editAnnouncementById,
    createAnnouncement,
    deleteAnnouncementById,
} from "../api/announcement";
import { Announcement, AnnouncementStatus } from "../types/announcement";
import { message } from "antd";

/**
 * Hook to fetch all announcements, optionally filtered by their statuses.
 * @param statuses - An array of announcement statuses to filter by (e.g., ["active", "archived"]).
 * @returns - A React Query object containing the announcements data, loading state, and error state.
 */
export const useAllAnnouncements = (statuses?: AnnouncementStatus[]) => {
    return useQuery({
        queryKey: ["announcements", statuses],
        queryFn: async () => getAllAnnouncements(statuses),
    });
};

/**
 * Hook to edit an announcement by its unique identifier.
 * @returns - A mutation object that can be used to update an announcement and handle success or error states.
 */
export const useEditAnnouncementById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            announcementId,
            editedAnnouncement,
        }: {
            announcementId: string;
            editedAnnouncement: Partial<Announcement>;
        }) => editAnnouncementById(announcementId, editedAnnouncement),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["announcements"],
            });
            message.success("Announcement updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update announcement.");
        },
    });
};

/**
 * Hook to create a new announcement with the provided details.
 * @returns - A mutation object that can be used to create an announcement and handle success or error states.
 */
export const useCreateAnnouncement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAnnouncement: Partial<Announcement>) =>
            createAnnouncement(newAnnouncement),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            message.success("Announcement created successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to create announcement.");
        },
    });
};

/**
 * Hook to delete an announcement by its unique identifier.
 * @returns - A mutation object that can be used to delete an announcement and handle success or error states.
 */
export const useDeleteAnnouncementById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ announcementId }: { announcementId: string }) =>
            deleteAnnouncementById(announcementId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            message.success("Announcement deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete announcement.");
        },
    });
};
