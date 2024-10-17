import { Radio, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface SelectEquipmentProps {
    type: string;
    setID: (newValue: string) => void;
}

interface Equipment {
    type: string;
    name: string;
    _id: string;
}

const SelectEquipment: React.FC<SelectEquipmentProps> = ({
    type,
    setID,
}: SelectEquipmentProps) => {
    const [showEquipment, setShowEquipment] = useState<Equipment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                const filterEquipment: Equipment[] = response.data.filter(
                    (item) => item
                );
                setShowEquipment(filterEquipment);
            } catch (error) {
                console.error("Fetching updates or issues failed:", error);
            }
        };

        fetchData();
    }, [type]);

    return (
        <>
            <Radio.Group onChange={(e) => setID(e.target.value)} value={name}>
                <Space direction="vertical">
                    {showEquipment.map((equipment: Equipment) => {
                        return (
                            <Radio value={equipment._id}>
                                {equipment.name}
                            </Radio>
                        );
                    })}
                </Space>
            </Radio.Group>
        </>
    );
};

export default SelectEquipment;
