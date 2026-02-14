import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createEquipment,
    deleteEquipmentById,
    editEquipmentById,
    getAllEquipment,
    getEquipmentById,
} from "../api/equipment";
import { Equipment } from "../types/equipment";
import { message } from "antd";

/**
 * Retrieves a list of all equipment, optionally filtered by category.
 * @param categoryId - The unique identifier of the category to filter equipment by.
 * @returns - A React Query object containing the equipment data, loading state, and error state.
 */
export const useAllEquipment = (categoryId?: string) => {
    return useQuery({
        queryKey: ["equipment", categoryId],
        queryFn: async () => getAllEquipment(categoryId),
    });
};

/**
 * Retrieves a single piece of equipment by its unique identifier.
 * @param equipmentId - The unique identifier of the equipment to retrieve.
 * @returns - A React Query object containing the equipment data, loading state, and error state.
 */
export const useEquipmentById = (equipmentId: string) => {
    return useQuery({
        queryKey: ["equipment", equipmentId],
        queryFn: async () => getEquipmentById(equipmentId),
        enabled: !!equipmentId,
    });
};

/**
 * Hook to edit a piece of equipment by its unique identifier.
 * @returns - A mutation object that can be used to update a piece of equipment and handle success or error states.
 */
export const useEditEquipmentById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            equipmentId,
            editedEquipment,
        }: {
            equipmentId: string;
            editedEquipment: Partial<Equipment>;
        }) => editEquipmentById(equipmentId, editedEquipment),
        onSuccess: ({ equipmentId }) => {
            queryClient.invalidateQueries({ queryKey: ["equipment"] });
            queryClient.invalidateQueries({
                queryKey: ["equipment", equipmentId],
            });
            message.success("Equipment updated successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to update equipment.");
        },
    });
};

/**
 * Hook to create a new piece of equipment with the provided details.
 * @returns - A mutation object that can be used to create a piece of equipment and handle success or error states.
 */

export const useCreateEquipment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ newEquipment }: { newEquipment: Partial<Equipment> }) =>
            createEquipment(newEquipment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipment"] });
            message.success("Equipment created successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to create equipment.");
        },
    });
};

/**
 * Hook to delete a piece of equipment by its unique identifier.
 * @param equipmentId - The unique identifier of the equipment to delete.
 * @returns - A mutation object that can be used to delete a piece of equipment and handle success or error states.
 */

export const useDeleteEquipmentById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ equipmentId }: { equipmentId: string }) =>
            deleteEquipmentById(equipmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipment"] });
            message.success("Equipment deleted successfully.");
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to delete equipment.");
        },
    });
};
