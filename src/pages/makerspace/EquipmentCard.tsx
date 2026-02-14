// Description: EquipmentCard component for displaying equipment information in a card format.

import { Button, Card, Flex, Skeleton, Space, Tag, Typography } from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    FrownOutlined,
    PauseCircleOutlined,
} from "@ant-design/icons";

import { gold, gray, green, purple, red } from "@ant-design/colors";
import type { EquipmentStatus, WithEquipment } from "../../types/equipment";
import { useNavigate } from "react-router-dom";
import { useCategoryById } from "../../hooks/useCategories";

const statusStyles: Record<
    EquipmentStatus,
    { color: string; icon: React.ReactNode }
> = {
    available: {
        color: green[4],
        icon: <CheckCircleOutlined />,
    },
    error: {
        color: red[4],
        icon: <CloseCircleOutlined />,
    },
    paused: {
        color: gold[4],
        icon: <PauseCircleOutlined />,
    },
    busy: {
        color: purple[4],
        icon: <ClockCircleOutlined />,
    },
    offline: {
        color: gray[2],
        icon: <FrownOutlined />,
    },
};

const EquipmentCard: React.FC<WithEquipment> = ({ equipment }) => {
    const { data: category, isLoading } = useCategoryById(
        equipment ? equipment?.categoryId : "",
    );

    const navigate = useNavigate();

    return (
        <>
            <Card  style={{ height: "100%" }}>
                {isLoading ? (
                    <Skeleton active />
                ) : (
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
                            <Tag
                                color={category?.color}
                                style={{ textTransform: "uppercase" }}
                            >
                                {category?.name}
                            </Tag>

                            <h3>
                                <Typography.Paragraph
                                    style={{
                                        font: "inherit",
                                        fontFamily: "inherit",
                                        fontSize: "inherit",
                                        margin: 0,
                                    }}
                                >
                                    {equipment?.name}
                                </Typography.Paragraph>
                            </h3>
                            <p>{equipment?.headline}</p>
                        </Space>
                        <Flex
                            justify="space-between"
                            align="end"
                            style={{ width: "100%" }}
                        >
                            <Tag
                                style={{ textTransform: "capitalize" }}
                                color={
                                    statusStyles[
                                        (equipment?.status as EquipmentStatus) ||
                                            "offline"
                                    ].color
                                }
                                bordered
                                icon={
                                    statusStyles[
                                        (equipment?.status as EquipmentStatus) ||
                                            "offline"
                                    ].icon
                                }
                            >
                                {equipment?.status}
                            </Tag>

                            <Button
                                variant="outlined"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() =>
                                    navigate(
                                        `/makerspace/${equipment?.routePath}`,
                                    )
                                }
                            >
                                More
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Card>
        </>
    );
};

export default EquipmentCard;
