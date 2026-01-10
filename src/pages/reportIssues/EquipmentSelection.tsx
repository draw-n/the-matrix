// Description: EquipmentSelection component for selecting equipment based on the chosen category when reporting issues.
import axios from "axios";
import React, { useEffect, useState } from "react";
import CardSelection, {
    CardSelectionProps,
} from "../../components/CardSelection";
import { Flex } from "antd";
import { Equipment } from "../../types/equipment";
import { useAllEquipment } from "../../hooks/equipment";

interface EquipmentSelectionProps extends CardSelectionProps {
    category: string;
}

const EquipmentSelection: React.FC<EquipmentSelectionProps> = ({
    category,
    value,
    onChange,
}: EquipmentSelectionProps) => {
    const {data: equipments, isLoading} = useAllEquipment(category);

    return (
        <Flex gap="large" style={{width: "100%"}} vertical align="center" justify="center">
            <p>Select the equipment that experienced the issue.</p>
            <CardSelection
                value={value}
                onChange={onChange}
                options={
                    equipments?.map((c) => ({
                        label: c.name,
                        value: c._id,
                    })) || []
                }
            />
        
        </Flex>
    );
};

export default EquipmentSelection;
