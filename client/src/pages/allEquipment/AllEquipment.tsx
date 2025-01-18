import { useEffect, useState } from "react";
import CreateEquipmentForm from "../../components/forms/CreateEquipmentForm";
import { Col, Flex, Radio, Row } from "antd";
import EquipmentCard from "./EquipmentCard";
import axios from "axios";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

import "./equipment.css";
import MaterialForm from "../../components/forms/CreateMaterialForm";
import MaterialTable from "../../components/tables/MaterialTable";

interface AllEquipmentProps {
    refreshEquipment: number;
    setRefreshEquipment: (item: number) => void;
}

const AllEquipment: React.FC<AllEquipmentProps> = ({
    refreshEquipment,
    setRefreshEquipment,
}) => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [filter, setFilter] = useState<string>("filament");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshMaterials, setRefreshMaterials] = useState<number>(0); // State for refresh count

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                setEquipments(
                    response.data.filter(
                        (equipment) => equipment.type === filter
                    )
                );

                console.log(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Fetching equipment failed:", error);
            }
        };

        fetchData();
    }, [refreshEquipment, filter]);

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
                        <Flex gap="middle">
                            <Radio.Group
                                onChange={(e) => setFilter(e.target.value)}
                                defaultValue="filament"
                            >
                                <Radio.Button value="filament">
                                    Filament
                                </Radio.Button>
                                <Radio.Button value="resin">Resin</Radio.Button>
                                <Radio.Button value="powder">
                                    Powder
                                </Radio.Button>
                            </Radio.Group>
                            <CreateEquipmentForm
                                onUpdate={() =>
                                    setRefreshEquipment(refreshEquipment + 1)
                                }
                            />
                        </Flex>
                    </Flex>
                    <Row gutter={[16, 16]}>
                        {equipments
                            .filter((equipment) => equipment.type == filter)
                            .map((equipment: Equipment, index) => {
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
