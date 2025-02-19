import { useEffect, useState } from "react";
import CreateEquipmentForm from "../../components/forms/CreateEquipmentForm";
import { Col, Empty, Flex, Radio, Row, Space } from "antd";
import EquipmentCard from "./EquipmentCard";
import axios from "axios";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

import "./equipment.css";
import MaterialForm from "../../components/forms/CreateMaterialForm";
import MaterialTable from "../../components/tables/MaterialTable";
import { Category } from "../../types/Category";

interface AllEquipmentProps {
    refreshEquipment: number;
    setRefreshEquipment: (item: number) => void;
}

const AllEquipment: React.FC<AllEquipmentProps> = ({
    refreshEquipment,
    setRefreshEquipment,
}) => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshMaterials, setRefreshMaterials] = useState<number>(0); // State for refresh count
    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Equipment[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment`
                );
                setEquipments(
                    response.data.filter(
                        (equipment) => equipment.category === filter
                    )
                );

                setIsLoading(false);
            } catch (error) {
                console.error("Fetching equipment failed:", error);
            }
            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [refreshEquipment, filter]);

    return (
        <Space direction="vertical" size="middle" style={{width: "100%"}}>
            <h1>MAKERSPACE</h1>
            <p>
                Find all details related to the Digital Fabrication Lab
                makerspace, including the available equipment and materials we
                carry for all your creative needs!
            </p>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Flex
                        style={{ width: "100%" }}
                        justify="space-between"
                        align="center"
                    >
                        <h2>Equipment</h2>
                        <Flex gap="middle">
                            <Radio.Group
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                {categories?.map((category) => (
                                    <Radio.Button value={category._id}>
                                        {category.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                            <CreateEquipmentForm
                                onUpdate={() =>
                                    setRefreshEquipment(refreshEquipment + 1)
                                }
                            />
                        </Flex>
                    </Flex>
                    {equipments.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {equipments
                                .filter(
                                    (equipment) => equipment.category == filter
                                )
                                .map((equipment: Equipment, index) => {
                                    return (
                                        <Col span={8} key={index}>
                                            <EquipmentCard
                                                equipment={equipment}
                                            />
                                        </Col>
                                    );
                                })}
                        </Row>
                    ) : (
                        <Empty style={{ width: "100%" }} />
                    )}

                    <Flex
                        style={{ width: "100%" }}
                        justify="space-between"
                        align="center"
                    >
                        <h2>Materials</h2>
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
        </Space>
    );
};

export default AllEquipment;
