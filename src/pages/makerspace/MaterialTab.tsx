import { useEffect, useState } from "react";
import axios from "axios";

import { Flex, Space } from "antd";
import MaterialForm from "../../components/forms/MaterialForm";
import HasAccess from "../../components/rbac/HasAccess";
import MaterialTable from "../../components/tables/MaterialTable";

import { Material } from "../../types/material";
import { useAllMaterials } from "../../hooks/material";

const MaterialTab: React.FC = () => {
    const {data: materials, refetch} = useAllMaterials();

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex
                style={{ width: "100%" }}
                justify="space-between"
                align="center"
            >
                <h2>MATERIALS</h2>
                <HasAccess roles={["admin", "moderator"]}>
                    <MaterialForm onSubmit={refetch} />
                </HasAccess>
            </Flex>
            <MaterialTable refresh={refetch} materials={materials} />
        </Space>
    );
};

export default MaterialTab;
