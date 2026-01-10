import { useQuery } from "@tanstack/react-query";
import { getAllMaterials } from "../api/material";

export const useAllMaterials = (categoryId?: string) => {
    return useQuery({
        queryKey: ["materials", categoryId],
        queryFn: async () => getAllMaterials(categoryId),
    });
}