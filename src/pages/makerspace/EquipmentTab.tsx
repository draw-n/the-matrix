// Description: EquipmentTab component for displaying and managing equipment in the makerspace.
import axios from "axios";
import { useEffect, useState } from "react";

import type { Category } from "../../types/category";
import type { Equipment } from "../../types/equipment";

import { Flex, Dropdown, Button, Row, Col, Empty, Space, Select } from "antd";
import CreateEquipmentForm from "../../components/forms/CreateEquipmentForm";
import HasAccess from "../../components/rbac/HasAccess";

import EquipmentCard from "./EquipmentCard";
import CaretDownFilled from "@ant-design/icons/lib/icons/CaretDownFilled";

const EquipmentTab = ({
    refreshEquipment,
}: {
    refreshEquipment: () => void;
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("");

    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get<Category[]>(
                `${import.meta.env.VITE_BACKEND_URL}/categories`
            );
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }

        if (filter) {
            try {
                const response = await axios.get<Equipment[]>(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/equipment?category=${filter}`
                );
                setEquipments(response.data);
            } catch (error) {
                console.error("Fetching equipment failed:", error);
            }
        } else {
            setFilter(categories[0]?._id);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filter]);
    return (
        <Space size="middle" direction="vertical" style={{ width: "100%" }}>
            <Flex gap="middle" align="center" justify="space-between">
                <h2>EQUIPMENT</h2>
                <Flex gap="middle" align="center">
                    {categories.length > 0 && (
                        <Select
                            popupMatchSelectWidth={false}
                            value={filter}
                            onChange={(e) => setFilter(e)}
                            size="middle"
                            suffixIcon={<CaretDownFilled />}
                            options={categories?.map((category) => ({
                                label: category.name,
                                value: category._id,
                            }))}
                        />
                    )}
                    <HasAccess roles={["admin", "moderator"]}>
                        <CreateEquipmentForm
                            onUpdate={() => {
                                refreshEquipment();
                                fetchData();
                            }}
                        />
                    </HasAccess>
                </Flex>
            </Flex>
            {equipments.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {equipments.map((equipment: Equipment, index) => {
                        return (
                            <Col span={24} lg={8} key={index}>
                                <EquipmentCard equipment={equipment} />
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <Empty style={{ width: "100%" }} />
            )}
        </Space>
    );
};

export default EquipmentTab;
