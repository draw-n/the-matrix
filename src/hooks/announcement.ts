import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements } from "../api/announcement";
import { AnnouncementStatus } from "../types/announcement";

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