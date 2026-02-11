import { useQuery } from "@tanstack/react-query";
import { getAllMaterials } from "../api/material";

/**
 * Hook to fetch all materials, optionally filtered by category.
 * @param categoryId - The unique identifier of the category to filter materials by.
 * @returns - A React Query object containing the materials data, loading state, and error state.
 */
export const useAllMaterials = (
    categoryId?: string,
    remotePrintAvailable?: boolean,
) => {
    return useQuery({
        queryKey: ["materials", categoryId, remotePrintAvailable],
        queryFn: async () => getAllMaterials(categoryId, remotePrintAvailable),
    });
};
