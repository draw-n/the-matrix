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

export const deleteMaterial = async (materialId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/materials/${materialId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting material:", error);
    }
};
