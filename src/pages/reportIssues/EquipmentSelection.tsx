import axios from "axios";
import React, { useEffect, useState } from "react";
import { Category } from "../../types/Category";
import CardSelection, {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex } from "antd";
import { Equipment } from "../../types/Equipment";

interface EquipmentSelectionProps extends CardSelectionProps {
    category: string;
}

const EquipmentSelection: React.FC<EquipmentSelectionProps> = ({
    category,
    value,
    onChange,
}: EquipmentSelectionProps) => {
    const [showEquipment, setShowEquipment] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/equipment?category=${category}`
                );
                setShowEquipment(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };
        if (onChange) {
            onChange("");
        }

        if (category) {
            fetchData();
        }
    }, [category]);

    return (
        <Flex gap="large" style={{width: "100%"}} vertical align="center" justify="center">
            <p>Select the equipment that experienced the issue.</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={
                    showEquipment?.map((c) => ({
                        label: c.name,
                        value: c._id,
                    })) || []
                }
            />
        
        </Flex>
    );
};

export default EquipmentSelection;
