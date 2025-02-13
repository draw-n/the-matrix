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
    const navigate = useNavigate();

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

    return (
        <>
            <Card
                className="equipment-card"
                bordered={false}
                style={{ height: "100%" }}
            >
                <Flex
                    vertical
                    justify="space-between"
                    align="start"
                    style={{ height: "100%", width: "100%" }}
                    gap="10px"
                >
                    <Space
                        direction="vertical"
                        style={{ width: "100%", flexGrow: 1 }}
                        size="small"
                    >
                        <Tag style={{ textTransform: "uppercase" }}>
                            {equipment.type}
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
                                {equipment.name}
                            </Paragraph>
                        </h3>
                        <p>{equipment.headline}</p>
                    </Space>
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
                                navigate(`/makerspace/${equipment.routePath}`)
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
