import { useQuery } from "@tanstack/react-query";
import { getAllEquipment, getEquipmentById } from "../api/equipment";

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
}