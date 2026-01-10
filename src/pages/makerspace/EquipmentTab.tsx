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
import { useAllEquipment } from "../../hooks/equipment";
import { useAllCategories } from "../../hooks/category";

const EquipmentTab = () => {
    const { data: categories } = useAllCategories();
    const [filter, setFilter] = useState<string>(
        categories ? categories[0]._id : ""
    );

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
                                value: category._id,
                            }))}
                        />
                    )}
                    <HasAccess roles={["admin", "moderator"]}>
                        <CreateEquipmentForm
                            onUpdate={() => {
                                refetch();
                            }}
                        />
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

export default EquipmentTab;
