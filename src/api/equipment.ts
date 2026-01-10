import axios from "axios";
import { Equipment } from "../types/equipment";

export const getAllEquipment = async (category?: string) => {
    try {
        let query = "";
        if (category) {
            query = `?category=${category}`;
        }
        const response = await axios.get<Equipment[]>(
            `${import.meta.env.VITE_BACKEND_URL}/equipment${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching routes:", error);
    }
};
