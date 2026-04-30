// Description: EquipmentCard component for displaying equipment information in a card format.

import { Button, Card, Flex, Skeleton, Space, Tag, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import {
    type EquipmentStatus,
    type WithEquipment,
    equipmentStatusStyles,
} from "../../types/equipment";
import { useNavigate } from "react-router-dom";
import { useCategoryById } from "../../hooks/useCategories";

const EquipmentCard: React.FC<WithEquipment> = ({ equipment }) => {
    const { data: category, isLoading } = useCategoryById(
        equipment ? equipment?.categoryId : "",
    );

    const navigate = useNavigate();
    const Icon =
        equipmentStatusStyles[
            (equipment?.status as EquipmentStatus) || "offline"
        ].icon;
    return (
        <>
            <Card style={{ height: "100%" }}>
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
                            vertical
                            style={{ width: "100%", flexGrow: 1 }}
                            size="small"
                        >
                            <Tag
                                color={category?.color}
                                variant="solid"
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
                                style={{ textTransform: "uppercase" }}
                                variant="outlined"
                                color={
                                    equipmentStatusStyles[
                                        (equipment?.status as EquipmentStatus) ||
                                            "offline"
                                    ].color
                                }
                                icon={<Icon />}
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
