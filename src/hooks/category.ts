import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getCategoryById } from "../api/category";

/**
 * Hook to fetch all categories.
 * @returns - A React Query object containing the categories data, loading state, and error state.
 */
export const useAllCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => getAllCategories(),
    });
};

/**
 * Hook to fetch a category by its ID.
 * @param categoryId - The unique identifier of the category to retrieve.
 * @returns - A React Query object containing the category data, loading state, and error state.
 */
export const useCategoryById = (categoryId: string) => {
    return useQuery({
        queryKey: ["category", categoryId],
        queryFn: async () => getCategoryById(categoryId),
        enabled: !!categoryId,
    });
};
