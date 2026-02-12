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
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        
        throw new Error(error.response?.data.message || "Failed to retrieve categories.");
    }
};

/**
 * Retrieves a category by its unique identifier.
 * @param categoryId - The unique identifier of the category to retrieve.
 * @returns - A promise that resolves to a Category object if found, or undefined if no categoryId is provided.
 */
export const getCategoryById = async (categoryId: string) => {
    try {
        if (categoryId === "") {
            throw new Error("Category ID not found.");
        }
        const response = await axios.get<Category>(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching category:", error);
        throw new Error(error.response?.data.message || "Failed to fetch category.");
    }
};

/**
 * Creates a new category with the provided details.
 * @param newCategory - An object containing the details of the category to be created.
 * @returns - A promise that resolves to the created Category object.
 */
export const createCategory = async (newCategory: Partial<Category>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/categories`,
            newCategory,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating category:", error);
        throw new Error(error.response?.data.message || "Failed to create category.");
    }
};

/**
 * Updates an existing category with the provided values.
 * @param categoryId - The unique identifier of the category to be updated.
 * @param editedCategory - An object containing the updated values for the category.
 * @returns - A promise that resolves to the updated Category object.
 */
export const editCategoryById = async (
    categoryId: string,
    editedCategory: Partial<Category>,
) => {
    if (categoryId === "") {
        throw new Error("Category ID not found.");
    }
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
            editedCategory,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating category:", error);
        throw new Error(error.response?.data.message || "Failed to update category.");
    }
};

/**
 * Deletes a category by its unique identifier.
 * @param categoryId - The unique identifier of the category to delete.
 * @returns - A promise that resolves to the response data from the delete operation.
 */
export const deleteCategoryById = async (categoryId: string) => {
    if (categoryId === "") {
        throw new Error("Category ID not found.");
    }
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting category:", error);
        throw new Error(error.response?.data.message || "Failed to delete category.");
    }
};
