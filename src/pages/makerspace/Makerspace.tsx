// Description: Makerspace page component that displays equipment and materials tabs.

import { useEffect, useState } from "react";

import type { Equipment } from "../../types/equipment";

import { Flex, Tabs, TabsProps, Row, Col, Empty, Space, Select } from "antd";
import CreateEquipmentForm from "../../components/forms/CreateEquipmentForm";
import HasAccess from "../../components/routing/HasAccess";

import EquipmentCard from "./EquipmentCard";
import { CaretDownFilled } from "@ant-design/icons";
import { useAllEquipment } from "../../hooks/useEquipment";
import { useAllCategories } from "../../hooks/useCategories";

import MaterialForm from "../../components/forms/MaterialForm";
import MaterialTable from "../../components/tables/MaterialTable";

import { useAllMaterials } from "../../hooks/useMaterials";

const Makerspace: React.FC = () => {
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Equipment",
            children: <EquipmentTab />,
        },
        {
            key: "2",
            label: "Materials",
            children: <MaterialTab />,
        },
    ];

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <p>
                Find all details related to the Digital Fabrication Lab
                makerspace, including the available equipment and materials we
                carry for all your creative needs!
            </p>
            <Tabs defaultActiveKey="1" items={items} />
        </Space>
    );
};

const EquipmentTab = () => {
    const { data: categories } = useAllCategories();
    const [filter, setFilter] = useState<string>("");

    // Set filter to categories[0].uuid when categories are loaded
    useEffect(() => {
        if (categories && categories.length > 0) {
            setFilter(categories[0].uuid);
        }
    }, [categories]);

    const { data: equipments, isLoading, refetch } = useAllEquipment(filter);

    return (
        <Space size="middle" direction="vertical" style={{ width: "100%" }}>
            <Flex gap="middle" align="center" justify="space-between">
                <h2>EQUIPMENT</h2>
                <Flex gap="middle" align="center">
                    {categories && categories.length > 0 && (
                        <Select
                            popupMatchSelectWidth={false}
                            value={filter}
                            onChange={(e) => setFilter(e)}
                            size="middle"
                            suffixIcon={<CaretDownFilled />}
                            options={categories?.map((category) => ({
                                label: category.name,
                                value: category.uuid,
                            }))}
                        />
                    )}
                    <HasAccess roles={["admin", "moderator"]}>
                        <CreateEquipmentForm />
                    </HasAccess>
                </Flex>
            </Flex>
            {equipments && equipments.length > 0 ? (
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

const MaterialTab: React.FC = () => {
    const { data: materials } = useAllMaterials();

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>MATERIALS</h2>
                <HasAccess roles={["admin", "moderator"]}>
                    <MaterialForm />
                </HasAccess>
            </Flex>
            <MaterialTable materials={materials} />
        </Space>
    );
};

export default Makerspace;
