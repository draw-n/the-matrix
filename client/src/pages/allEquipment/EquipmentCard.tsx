import { Badge, Button, Card, Flex, Input, Select, Space, Tag } from "antd";
import { useAuth, type User } from "../../hooks/AuthContext";
import { Switch, Typography } from "antd";

import { useState } from "react";
import axios from "axios";
import type { Equipment } from "../../types/Equipment";
import { useNavigate } from "react-router-dom";
import {
    CheckCircleTwoTone,
    ClockCircleTwoTone,
    CloseCircleTwoTone,
    PauseCircleTwoTone,
} from "@ant-design/icons";

interface EquipmentCardProps {
    equipment: Equipment;
}

const { Paragraph } = Typography;

const EquipmentCard: React.FC<EquipmentCardProps> = ({
    equipment,
}: EquipmentCardProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>(equipment.name);
    const [editType, setEditType] = useState<string>(equipment.type);
    const [editDescription, setEditDescription] = useState<string>(
        equipment.description
    );

    const navigate = useNavigate();
    const handleClick = () => {
        if (editMode) {
            changeEquipment();
        }
        setEditMode((prev) => !prev);
    };

    const showStatus = () => {
        switch (equipment.status) {
            case "working":
                return <CheckCircleTwoTone twoToneColor="#5FAE4D" />;
                break;
            case "broken":
                return <CloseCircleTwoTone twoToneColor="#B94D4D" />;
                break;
            case "fixing":
                return <PauseCircleTwoTone twoToneColor="#D6C94D" />;
                break;
            case "updating":
                return <ClockCircleTwoTone twoToneColor="#6B8DA3" />;
                break;
            default:
                return "";
                break;
        }
    };

    const changeEquipment = async () => {
        try {
            const editedEquipment = {
                _id: equipment._id,
                name: editName,
                type: editType,
                description: editDescription,
                status: equipment.status,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/${equipment._id}`,
                editedEquipment
            );
        } catch (error) {
            console.error("Issue updating user", error);
        }
    };

    return (
        <>
            <Card className="equipment-card" bordered={false}>
                <Flex vertical justify="start" align="start">
                    <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size="small"
                    >
                        <Tag style={{ textTransform: "uppercase" }}>
                            {editType}
                        </Tag>

                        <h3>
                            <Paragraph
                                style={{
                                    font: "inherit",
                                    fontFamily: "inherit",
                                    fontSize: "inherit",
                                    margin: 0,
                                }}
                            >
                                {editName}
                            </Paragraph>
                        </h3>

                        <Flex justify="space-between" style={{ width: "100%" }}>
                            <Flex
                                justify="center"
                                style={{ textTransform: "capitalize" }}
                                align="center"
                                gap="10px"
                            >
                                {showStatus()}
                                {equipment.status}
                            </Flex>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() =>
                                    navigate(
                                        `/equipment/${equipment.routePath}`
                                    )
                                }
                            >
                                More Details
                            </Button>
                        </Flex>
                    </Space>
                </Flex>
            </Card>
        </>
    );
};

export default EquipmentCard;
