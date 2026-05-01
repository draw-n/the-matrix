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
    } catch (error: any) {
        console.error("Error fetching issues:", error);
        
        throw new Error(error.response?.data.message || "Failed to retrieve materials.");
    }
};

/**
 * Deletes a material by its unique identifier.
 * @param materialId - The unique identifier of the material to delete.
 * @returns - A promise that resolves when the material is deleted.
 */
export const deleteMaterialById = async (materialId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/materials/${materialId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting material:", error);
        throw new Error(error.response?.data.message || "Failed to delete material.");
    }
};

/**
 * Updates an existing material with the provided values.
 * @param materialId - The unique identifier of the material to be updated.
 * @param values - An object containing the updated material data.
 * @returns - A promise that resolves to the updated Material object.
 */
export const editMaterialById = async (
    materialId: string,
    editedMaterial: Partial<Material>,
) => {
    if (materialId === "") {
        throw new Error("Material ID not found.");
    }
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/materials/${materialId}`,
            editedMaterial,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating material:", error);
        throw new Error(error.response?.data.message || "Failed to update material.");
    }
};

/**
 * Creates a new material with the provided details.
 * @param newMaterial - An object containing the details of the material to be created. This should include properties such as name, shortName, categoryId, properties, description, remotePrintAvailable, and optionally temperatures.
 * @returns - A promise that resolves to the created Material object.
 */
export const createMaterial = async (newMaterial: Partial<Material>) => {

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/materials`,
            newMaterial,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating material:", error);
        throw new Error(error.response?.data.message || "Failed to create material.");
    }
};
