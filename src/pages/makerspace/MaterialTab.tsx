import { useEffect, useState } from "react";
import axios from "axios";

import { Flex, Space } from "antd";
import MaterialForm from "../../components/forms/MaterialForm";
import HasAccess from "../../components/rbac/HasAccess";
import MaterialTable from "../../components/tables/MaterialTable";

import { Material } from "../../types/material";

const MaterialTab: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const fetchData = async () => {
        try {
            const responseUpdates = await axios.get<Material[]>(
                `${import.meta.env.VITE_BACKEND_URL}/materials`
            );

            const formattedData = responseUpdates.data.map((item) => ({
                ...item,
                key: item._id,
            }));
            setMaterials(formattedData);
        } catch (error) {
            console.error("Fetching updates or issues failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>MATERIALS</h2>
                <HasAccess roles={["admin", "moderator"]}>
                    <MaterialForm onUpdate={fetchData} />
                </HasAccess>
            </Flex>
            <MaterialTable refreshTable={fetchData} materials={materials} />
        </Space>
    );
};

export default MaterialTab;
