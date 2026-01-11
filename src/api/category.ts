import axios from "axios";
import { Category } from "../types/category";

export const getAllCategories = async () => {
    try {
        const response = await axios.get<Category[]>(
            `${import.meta.env.VITE_BACKEND_URL}/categories`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

export const getCategory = async (categoryId?: string) => {
    try {
        if (!categoryId) return;
        const response = await axios.get<Category>(
            `${import.meta.env.VITE_BACKEND_URL}/categories/${categoryId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error);
    }
};
