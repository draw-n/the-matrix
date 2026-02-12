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
    } catch (error: any) {
        console.error("Error fetching users:", error);

        throw new Error(
            error.response?.data.message || "Failed to fetch users.",
        );
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
    } catch (error: any) {
        console.error("Error fetching departments:", error);
        throw new Error(
            error.response?.data.message || "Failed to fetch departments.",
        );
    }
};

/**
 * Updates an existing user with the provided values.
 * @param userId - The unique identifier of the user to be updated.
 * @param editedUser - An object containing the updated user data.
 * @returns - A promise that resolves to the updated User object.
 */
export const editUserById = async (
    userId: string,
    editedUser: Partial<User>,
) => {
    if (userId === "") {
        throw new Error("User ID not found.");
    }
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
            editedUser,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating user:", error);
        throw new Error(
            error.response?.data.message || "Failed to update user.",
        );
    }
};

/**
 * Deletes a user by their unique identifier.
 * @param userId - The unique identifier of the user to delete.
 * @returns - A promise that resolves when the user is deleted.
 */
export const deleteUserById = async (userId: string) => {
    if (userId === "") {
        throw new Error("User ID not found.");
    }
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting user:", error);
        throw new Error(
            error.response?.data.message || "Failed to delete user.",
        );
    }
};
