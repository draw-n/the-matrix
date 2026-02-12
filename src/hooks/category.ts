import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createCategory,
    deleteCategoryById,
    editCategoryById,
    getAllCategories,
    getCategoryById,
} from "../api/category";
import { Category } from "../types/category";
import { message } from "antd";

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

/**
 * Hook to edit a category by its unique identifier.
 * @param categoryId - The unique identifier of the category to be updated.
 * @param editedCategory - An object containing the updated values for the category.
 * @returns - A mutation object that can be used to update a category and handle success or error states.
 */
export const useEditCategoryById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            categoryId,
            editedCategory,
        }: {
            categoryId: string;
            editedCategory: Partial<Category>;
        }) => editCategoryById(categoryId, editedCategory),
        onSuccess: ({ categoryId }) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({
                queryKey: ["category", categoryId],
            });
            message.success("Category updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update category.");
        },
    });
};

/**
 * Hook to create a new category with the provided details.
 * @returns -  A mutation object that can be used to create a category and handle success or error states.
 */
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCategory: Partial<Category>) =>
            createCategory(newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            message.success("Category created successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to create category.");
        },
    });
};

/**
 * Hook to delete a category by its unique identifier.
 * @returns - A mutation object that can be used to delete a category and handle success or error states.
 */
export const useDeleteCategoryById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({categoryId}: {categoryId: string}) => deleteCategoryById(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            message.success("Category deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete category.");
        },
    });
};
