import axios from "axios";
import { Material } from "../types/material";

/**
 * Retrieves all materials, optionally filtered by category.
 * @param categoryId - The unique identifier of the category to filter materials by.
 * @returns - A promise that resolves to an array of Material objects.
 */
export const getAllMaterials = async (
    categoryId?: string,
    remotePrintAvailable?: boolean,
) => {
    try {
        let query = "";
        if (categoryId) {
            query = `?category=${categoryId}`;
        }
        const response = await axios.get<Material[]>(
            `${import.meta.env.VITE_BACKEND_URL}/materials`,
            {
                params: {
                    categoryId: categoryId,
                    remotePrintAvailable: remotePrintAvailable,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
    }
};

/**
 * Deletes a material by its unique identifier.
 * @param materialId - The unique identifier of the material to delete.
 * @returns - A promise that resolves when the material is deleted.
 */
export const deleteMaterial = async (materialId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/materials/${materialId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting material:", error);
    }
};

export const editMaterialById = async (
    materialId: string,
    values: Partial<Material>,
) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/materials/${materialId}`,
            values,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating material:", error);
    }
};

export const createMaterial = async (newMaterial: Partial<Material>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/materials`,
            newMaterial,
        );
        return response.data;
    } catch (error) {
        console.error("Error creating material:", error);
    }
};
