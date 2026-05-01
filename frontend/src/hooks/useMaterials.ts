import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createMaterial,
    deleteMaterialById,
    editMaterialById,
    getAllMaterials,
} from "../api/material";
import { message } from "antd";
import { Material } from "../types/material";

/**
 * Hook to fetch all materials, optionally filtered by category.
 * @param categoryId - The unique identifier of the category to filter materials by.
 * @returns - A React Query object containing the materials data, loading state, and error state.
 */
export const useAllMaterials = (
    categoryId?: string,
    remotePrintAvailable?: boolean,
) => {
    return useQuery({
        queryKey: ["materials", categoryId, remotePrintAvailable],
        queryFn: async () => getAllMaterials(categoryId, remotePrintAvailable),
    });
};

/**
 * Hook to delete a material by its unique identifier.
 * @returns - A mutation object that can be used to delete a material and handle success or error states.
 */
export const useDeleteMaterialById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ materialId }: { materialId: string }) =>
            deleteMaterialById(materialId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["materials"] });
            message.success("Material deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete material.");
        },
    });
};

/**
 * Hook to edit a material by its unique identifier.
 * @returns - A mutation object that can be used to update a material and handle success or error states.
 */
export const useEditMaterialById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            materialId,
            editedMaterial,
        }: {
            materialId: string;
            editedMaterial: Partial<Material>;
        }) => editMaterialById(materialId, editedMaterial),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["materials"] });
            message.success("Material updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update material.");
        },
    });
};

/**
 * Hook to create a new material with the provided details.
 * @returns - A mutation object that can be used to create a material and handle success or error states.
 */
export const useCreateMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ newMaterial }: { newMaterial: Partial<Material> }) =>
            createMaterial(newMaterial),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["materials"] });
            message.success("Material created successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to create material.");
        },
    });
};
