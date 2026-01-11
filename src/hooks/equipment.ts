import { useQuery } from "@tanstack/react-query";
import { getAllEquipment } from "../api/equipment";

export const useAllEquipment = (category?: string) => {
    return useQuery({
        queryKey: ["equipment", category],
        queryFn: async () => getAllEquipment(category),
    });
};