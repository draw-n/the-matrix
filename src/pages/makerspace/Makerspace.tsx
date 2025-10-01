import { useEffect, useState } from "react";
import CreateEquipmentForm from "../../components/forms/CreateEquipmentForm";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Empty,
    Flex,
    Radio,
    Row,
    Space,
    Tabs,
    TabsProps,
} from "antd";
import EquipmentCard from "./EquipmentCard";
import axios from "axios";
import Loading from "../../components/Loading";
import type { Equipment } from "../../types/Equipment";

import "./equipment.css";
import MaterialForm from "../../components/forms/MaterialForm";
import MaterialTable from "../../components/tables/MaterialTable";
import { Category } from "../../types/Category";
import HasAccess from "../../components/rbac/HasAccess";
import EquipmentTab from "./EquipmentTab";
import MaterialTab from "./MaterialTab";

interface MakerspaceProps {
    refreshEquipment: () => void;
}

const Makerspace: React.FC<MakerspaceProps> = ({ refreshEquipment }) => {
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Equipment",
            children: <EquipmentTab refreshEquipment={refreshEquipment} />,
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

export default Makerspace;
