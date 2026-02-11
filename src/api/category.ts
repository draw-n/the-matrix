import axios from "axios";
import { Category } from "../types/category";

/**
 * Retrieves all categories.
 * @returns - A promise that resolves to an array of Category objects.
 */
export const getAllCategories = async () => {
    try {
        const response = await axios.get<Category[]>(
            `${import.meta.env.VITE_BACKEND_URL}/categories`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

/**
 * Retrieves a category by its unique identifier.
 * @param categoryId - The unique identifier of the category to retrieve.
 * @returns - A promise that resolves to a Category object if found, or undefined if no categoryId is provided.
 */
export const getCategoryById = async (categoryId: string) => {
    try {
        if (!categoryId) return;
        const response = await axios.get<Category>(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error);
    }
};

export const createCategory = async (newCategory: Partial<Category>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/categories`,
            newCategory,
        );
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
    }
};

export const editCategoryById = async (
    categoryId: string,
    values: Partial<Category>,
) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
            values,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
    }
};

/**
 * Deletes a category by its unique identifier.
 * @param categoryId - The unique identifier of the category to delete.
 * @returns - A promise that resolves to the response data from the delete operation.
 */
export const deleteCategoryById = async (categoryId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
    }
};
