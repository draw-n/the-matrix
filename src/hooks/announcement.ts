import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements } from "../api/announcement";

export const useAllAnnouncements = (statuses?: string[]) => {
    return useQuery({
        queryKey: ["announcements", statuses],
        queryFn: async () => getAllAnnouncements(statuses),
    });
};