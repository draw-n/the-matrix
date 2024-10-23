import { Badge, Button, Card, Flex, Input, Select, Tag } from "antd";
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
            <Card
                className="equipment-card"
                title={
                    <Flex justify="space-between" align="center">
                        <Tag style={{ textTransform: "uppercase" }}>
                            {editType}
                        </Tag>
                        <Flex
                            justify="center"
                            style={{ textTransform: "capitalize" }}
                            align="center"
                            gap="10px"
                        >
                            {showStatus()}
                            {equipment.status}
                        </Flex>
                    </Flex>
                }
                bordered={false}
            >
                <Flex vertical justify="start" align="start" gap="5px">
                    <h2>
                        <Paragraph>{editName} </Paragraph>
                    </h2>

                    <Flex justify="center" style={{ width: "100%" }}>
                        <Button
                            type="primary"
                            onClick={() =>
                                navigate(`/equipment/${equipment.routePath}`)
                            }
                        >
                            More Details
                        </Button>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};

export default EquipmentCard;
