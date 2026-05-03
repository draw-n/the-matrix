// Description: EquipmentCard component for displaying equipment information in a card format.

import { Button, Card, Flex, Skeleton, Space, Tag, Typography } from "antd";
import {
    ArrowRightOutlined,
    EyeOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import {
    type EquipmentStatus,
    type WithEquipment,
    equipmentStatusStyles,
} from "../../types/equipment";
import { useNavigate } from "react-router-dom";
import { useCategoryById } from "../../hooks/useCategories";
import ImageCard from "../equipmentProfile/components/ImageCard";

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
            <Card
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0, // 👈 VERY IMPORTANT
                    width: "100%",
                }}
                styles={{
                    header: { borderBottom: "none" },
                    cover: { padding: "0 1px", height: 150 },
                    body: {
                        display: "flex",
                        flexDirection: "column",
                        flex: 1, // 👈 fills remaining space
                    },
                }}
                cover={
                    equipment?.imageName ? (
                        <img
                            draggable={false}
                            alt={equipment?.name}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/equipment/${equipment.imageName}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "150px",
                                width: "100%",
                                background: "#efefef", // optional, looks nicer
                            }}
                        >
                            <SettingOutlined
                                style={{ fontSize: 64, color: "#bfbfbf" }}
                            />
                        </div>
                    )
                }
                title={
                    <Flex justify="space-between" align="center">
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
                            icon={<ArrowRightOutlined />}
                            variant="text"
                            type="text"
                            onClick={() =>
                                navigate(`/makerspace/${equipment?.routePath}`)
                            }
                        />
                    </Flex>
                }
            >
                {isLoading ? (
                    <Skeleton active />
                ) : (
                    <Card.Meta
                        description={
                            <Flex justify="space-between" align="center">
                                <Typography.Text
                                    style={{
                                        textTransform: "capitalize",
                                        color: "#a9a9a9",
                                        fontSize: "0.85em",
                                        overflowWrap: "anywhere", // 👈 stronger than break word
                                    }}
                                >
                                    {equipment?.headline}
                                </Typography.Text>
                            </Flex>
                        }
                        title={
                            <Flex
                                gap="middle"
                                align="start"
                                style={{ width: "100%", minWidth: 0 }}
                            >
                                <Typography.Text
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        whiteSpace: "normal", // 👈 allow wrapping
                                        overflowWrap: "anywhere", // 👈 break long words if needed
                                    }}
                                >
                                    {equipment?.name}
                                </Typography.Text>

                                <Tag
                                    style={{
                                        fontSize: 10,
                                        flexShrink: 0,
                                        textTransform: "uppercase",
                                    }}
                                    color={category?.color}
                                >
                                    {category?.name}
                                </Tag>
                            </Flex>
                        }
                    />
                )}
            </Card>
        </>
    );
};

export default EquipmentCard;
