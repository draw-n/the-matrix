import axios from "axios";
import { Equipment } from "../types/equipment";

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

/**
 * Saves the equipment changes made in edit mode.
 */
export const editEquipment = async (values: Equipment) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/equipment/${values.uuid}`,
            values,
        );
        return response.data;
    } catch (error) {
        console.error("Issue updating equipment", error);
    }
};
/**
 * Deletes the equipment and navigates back to the makerspace page.
 */
export const deleteEquipment = async (equipmentId?: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/equipment/${equipmentId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Issue deleting equipment", error);
    }
};
