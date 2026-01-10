import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getCategory } from "../api/category";

export const useAllCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => getAllCategories(),
    });
};

export const useCategory = (categoryId?: string) => {
    return useQuery({
        queryKey: ["category", categoryId],
        queryFn: async () => getCategory(categoryId),
        enabled: !!categoryId,
    });
};
