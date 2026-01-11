import axios from "axios";
import { Material } from "../types/material";

export const getAllMaterials = async (categoryId?: string) => {
    try {
        let query = "";
        if (categoryId) {
            query = `?category=${categoryId}`;
        }
        const response = await axios.get<Material[]>(
            `${import.meta.env.VITE_BACKEND_URL}/materials${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
    }
};
