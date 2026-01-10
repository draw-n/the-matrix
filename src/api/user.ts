import axios from "axios";
import { User } from "../types/user";

export const getAllUsers = async (accesses?: string[]) => {
    try {
        let query = "";
        if (accesses && accesses.length > 0) {
            query = `?access=${accesses.join(",")}`;
        }
        const response = await axios.get<User[]>(
            `${import.meta.env.VITE_BACKEND_URL}/users${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};
