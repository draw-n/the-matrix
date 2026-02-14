import { useMutation, useQuery } from "@tanstack/react-query";
import {
    deleteUserById,
    editUserById,
    getAllDepartments,
    getAllUsers,
} from "../api/user";
import { User, UserAccess } from "../types/user";
import { message } from "antd";

/**
 * Hook to fetch all users, optionally filtered by their access levels.
 * @param accesses - An array of access levels to filter users by (e.g., ["admin", "user"]).
 * @returns - A React Query object containing the users data, loading state, and error state.
 */
export const useAllUsers = (accesses?: UserAccess[]) => {
    return useQuery({
        queryKey: ["users", accesses],
        queryFn: async () => getAllUsers(accesses),
    });
};

/**
 * Hook to fetch all departments.
 * @returns - A React Query object containing the departments data, loading state, and error state.
 */
export const useAllDepartments = () => {
    return useQuery({
        queryKey: ["departments"],
        queryFn: async () => getAllDepartments(),
    });
};

/**
 * Hook to edit a user by their unique identifier.
 * @returns - A mutation object that can be used to update a user and handle success or error states.
 */
export const useEditUserById = () => {
    return useMutation({
        mutationFn: ({
            userId,
            editedUser,
        }: {
            userId: string;
            editedUser: Partial<User>;
        }) => editUserById(userId, editedUser),

        onSuccess: () => {
            message.success("User updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update user.");
        },
    });
};

/**
 * Hook to delete a user by their unique identifier.
 * @returns - A mutation object that can be used to delete a user and handle success or error states.
 */
export const useDeleteUserById = () => {
    return useMutation({
        mutationFn: ({ userId }: { userId: string }) => deleteUserById(userId),
        onSuccess: () => {
            message.success("User deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete user.");
        },
    });
};
