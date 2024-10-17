import { useEffect, useState } from "react";
import EquipmentForm from "./EquipmentForm";
import { Col, Flex, Row } from "antd";
import EquipmentCard from "./EquipmentCard";
import axios from "axios";

interface Equipment {
    _id: string;
    name: string;
    type: string;
    status: string;
    description: string;
}

const ManageEquipment: React.FC = () => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                setEquipments(responseUpdates.data);
            } catch (error) {
                console.error("Fetching equipment failed:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1>MANAGE EQUIPMENT</h1>

            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>All Makerspace Equipment</h2>
                <EquipmentForm onUpdate={() => {}} />
            </Flex>

            <Row gutter={16}>
                {equipments.map((equipment: Equipment) => {
                    return (
                        <Col span={6}>
                            <EquipmentCard
                                _id={equipment._id}
                                status={equipment.status}
                                name={equipment.name}
                                type={equipment.type}
                                description={equipment.description}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default ManageEquipment;
