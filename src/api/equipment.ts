import axios from "axios";
import { Equipment } from "../types/equipment";

/**
 * Retrieves all equipment, optionally filtered by category.
 * @param categoryId - The unique identifier of the category to filter equipment by.
 * @returns - A promise that resolves to an array of Equipment objects.
 */
export const getAllEquipment = async (categoryId?: string) => {
    try {
        let query = "";
        if (categoryId) {
            query = `?categoryId=${categoryId}`;
        }
        const response = await axios.get<Equipment[]>(
            `${import.meta.env.VITE_BACKEND_URL}/equipment${query}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment:", error);
    }
};

export const createEquipment = async (newEquipment: Partial<Equipment>) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/equipment`,
            newEquipment,
        );
        return response.data;
    } catch (error) {
        console.error("Error creating equipment:", error);
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
    } catch (error) {
        console.error("Error fetching equipment by ID:", error);
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
    } catch (error) {
        console.error("Error updating equipment", error);
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
    } catch (error) {
        console.error("Error deleting equipment", error);
    }
};
