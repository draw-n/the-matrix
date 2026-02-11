import axios from "axios";
import { User, UserAccess } from "../types/user";

/**
 * Retrieves all users, optionally filtered by access levels.
 * @param accesses - An array of access levels to filter users by (e.g., ["admin", "user"]).
 * @returns - A promise that resolves to an array of User objects.
 */
export const getAllUsers = async (accesses?: UserAccess[]) => {
    try {
        const response = await axios.get<User[]>(
            `${import.meta.env.VITE_BACKEND_URL}/users`,
            { params: { access: accesses ? accesses.join(",") : undefined } },
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

/**
 * Retrieves all departments.
 * @returns - A promise that resolves to an array of department names (strings).
 */
export const getAllDepartments = async () => {
    try {
        const response = await axios.get<string[]>(
            `${import.meta.env.VITE_BACKEND_URL}/users/departments`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
    }
};

export const editUserById = async (userId: string, values: Partial<User>) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
            values,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

export const deleteUserById = async (userId: string) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};
