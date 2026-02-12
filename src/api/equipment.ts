import axios from "axios";
import { Equipment } from "../types/equipment";

/**
 * Retrieves all equipment, optionally filtered by category.
 * @param categoryId - The unique identifier of the category to filter equipment by.
 * @returns - A promise that resolves to an array of Equipment objects.
 */
export const getAllEquipment = async (categoryId?: string) => {
    try {
        const response = await axios.get<Equipment[]>(
            `${import.meta.env.VITE_BACKEND_URL}/equipment`, { params: { categoryId } },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching equipment:", error);
        
        throw new Error(error.response?.data.message || "Failed to retrieve equipment.");
    }
};

/**
 * Creates a new piece of equipment with the provided details.
 * @param newEquipment - An object containing the details of the equipment to be created.
 * @returns - A promise that resolves to the created Equipment object.
 */
export const createEquipment = async (newEquipment: Partial<Equipment>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/equipment`,
            newEquipment,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating equipment:", error);
        throw new Error(error.response?.data.message || "Failed to create equipment.");
    }
};

/**
 * Retrieves a single piece of equipment by its unique identifier.
 * @param equipmentId - The unique identifier of the equipment to retrieve.
 * @returns - A promise that resolves to an Equipment object if found, or undefined if no equipmentId is provided.
 */
export const getEquipmentById = async (equipmentId: string) => {
    try {
        const response = await axios.get<Equipment>(
            `${import.meta.env.VITE_BACKEND_URL}/equipment/${equipmentId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching equipment by ID:", error);
        throw new Error(error.response?.data.message || "Failed to fetch equipment by ID.");
    }
};

/**
 * Updates an existing piece of equipment with the provided values.
 * @param values - The updated equipment data.
 * @returns - A promise that resolves to the updated Equipment object.
 */
export const editEquipmentById = async (equipmentId: string, values: Partial<Equipment>) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/equipment/${equipmentId}`,
            values,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating equipment", error);
        throw new Error(error.response?.data.message || "Failed to update equipment.");
    }
};
/**
 * Deletes a piece of equipment by its unique identifier.
 * @param equipmentId - The unique identifier of the equipment to delete.
 * @returns - A promise that resolves when the equipment is deleted.
 */
export const deleteEquipmentById = async (equipmentId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/equipment/${equipmentId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting equipment", error);
        throw new Error(error.response?.data.message || "Failed to delete equipment.");
    }
};
