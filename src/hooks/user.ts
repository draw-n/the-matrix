import { useQuery } from "@tanstack/react-query";
import { getAllDepartments, getAllUsers } from "../api/user";
import { UserAccess } from "../types/user";

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
}

