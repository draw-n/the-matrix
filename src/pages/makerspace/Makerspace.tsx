// Description: Makerspace page component that displays equipment and materials tabs.
import { Space, Tabs, TabsProps } from "antd";

import "./equipment.css";

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
