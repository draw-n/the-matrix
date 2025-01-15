import { useEffect, useState } from "react";
import EquipmentForm from "./EquipmentForm";
import { Col, Flex, Row } from "antd";
import EquipmentCard from "./EquipmentCard";
import axios from "axios";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

import "./equipment.css";
import MaterialForm from "./MaterialForm";
import MaterialTable from "./MaterialTable";

interface AllEquipmentProps {
    refreshEquipment: number;
    setRefreshEquipment: (item: number) => void;
}

const AllEquipment: React.FC<AllEquipmentProps> = ({
    refreshEquipment,
    setRefreshEquipment,
}) => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshMaterials, setRefreshMaterials] = useState<number>(0); // State for refresh count

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUpdates = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                setEquipments(responseUpdates.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching equipment failed:", error);
            }
        };

        fetchData();
    }, [refreshEquipment]);

    return (
        <>
            <h1>ALL EQUIPMENT</h1>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Flex
                        style={{ width: "100%" }}
                        justify="space-between"
                        align="center"
                    >
                        <h2>All Makerspace Equipment</h2>
                        <EquipmentForm
                            onUpdate={() =>
                                setRefreshEquipment(refreshEquipment + 1)
                            }
                        />
                    </Flex>
                    <Row gutter={[16, 16]}>
                        {equipments.map((equipment: Equipment, index) => {
                            return (
                                <Col span={8} key={index}>
                                    <EquipmentCard equipment={equipment} />
                                </Col>
                            );
                        })}
                    </Row>
                    <Flex
                        style={{ width: "100%" }}
                        justify="space-between"
                        align="center"
                    >
                        <h2>Manage Materials</h2>
                        <MaterialForm
                            onUpdate={() =>
                                setRefreshMaterials((prev) => prev + 1)
                            }
                        />
                    </Flex>

                    <MaterialTable
                        refresh={refreshMaterials}
                        setRefresh={setRefreshMaterials}
                    />
                </>
            )}
        </>
    );
};

export default AllEquipment;
