import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/user";

export const useAllUsers = (accesses?: string[]) => {
    return useQuery({
        queryKey: ["users", accesses],
        queryFn: async () => getAllUsers(accesses),
    });
};
