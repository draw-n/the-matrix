import axios from "axios";
import { Equipment } from "../types/equipment";

export const getAllEquipment = async (categoryId?: string) => {
    try {
        let query = "";
        if (categoryId) {
            query = `?categoryId=${categoryId}`;
        }
        const response = await axios.get<Equipment[]>(
            `${import.meta.env.VITE_BACKEND_URL}/equipment${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment:", error);
    }
};
