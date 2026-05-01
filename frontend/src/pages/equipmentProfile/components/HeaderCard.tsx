// Description: HeaderCard component for displaying equipment header information.
import { useState } from "react";
import {
    Card,
    Flex,
    Tag,
    theme,
    Button,
    Input,
    Form,
    Select,
    Typography,
    Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";

import {
    Equipment,
    EquipmentStatus,
    equipmentStatusStyles,
    WithEquipment,
} from "../../../types/equipment";

import HasAccess from "../../../components/routing/HasAccess";
import { useAllCategories } from "../../../hooks/useCategories";
import ImageCard from "./ImageCard";
import EquipmentForm from "../../../components/forms/EquipmentForm";
import ConfirmAction from "../../../components/common/ConfirmAction";
import { useDeleteEquipmentById } from "../../../hooks/useEquipment";

const HeaderCard: React.FC<WithEquipment> = ({ equipment }: WithEquipment) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const { data: categories } = useAllCategories();
    const { mutateAsync: deleteEquipmentById } = useDeleteEquipmentById();

    const Icon =
        equipmentStatusStyles[
            (equipment?.status as EquipmentStatus) || "offline"
        ].icon;

    return (
        <Card
            style={{
                background: colorPrimary,
                color: "white",
                border: "none",
            }}
        >
            <Flex align="space-between" gap="large">
                {equipment?.imageName && (
                    <ImageCard equipment={equipment} height={100} width={100} />
                )}
                <Flex
                    style={{ flex: 1 }}
                    vertical
                    align="space-between"
                    gap="small"
                >
                    <Flex gap="large" align="center">
                        <Typography.Title
                            level={1}
                            style={{
                                margin: 0,
                                color: "white",
                                textTransform: "uppercase",
                            }}
                        >
                            <span>{equipment?.name}</span>
                        </Typography.Title>

                        <Tag
                            color={
                                categories?.find(
                                    (item) =>
                                        item.uuid === equipment?.categoryId,
                                )?.color
                            }
                            variant="solid"
                            style={{ textTransform: "uppercase" }}
                        >
                            {
                                categories?.find(
                                    (item) =>
                                        item.uuid === equipment?.categoryId,
                                )?.name
                            }
                        </Tag>
                    </Flex>
                    <Flex style={{ width: "100%" }} vertical>
                        <p style={{ color: "white" }}>
                            <span>{equipment?.headline}</span>
                        </p>
                    </Flex>
                </Flex>
                <Flex vertical justify="space-between" gap="middle" align="end">
                    <HasAccess roles={["admin", "moderator"]}>
                        <Flex gap="small" align="center" justify="end">
                            <EquipmentForm equipment={equipment} />
                            <ConfirmAction
                                target={
                                    <Tooltip title={`Delete Equipment`}>
                                        <Button
                                            danger
                                            style={{
                                                boxShadow: "none",
                                            }}
                                            variant="solid"
                                            type="primary"
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                        />
                                    </Tooltip>
                                }
                                actionSuccess={() =>
                                    equipment
                                        ? deleteEquipmentById({
                                              equipmentId:
                                                  equipment?.uuid || "",
                                          })
                                        : undefined
                                }
                                title={`Delete the ${equipment?.name} Equipment`}
                                headlineText="Deleting this equipment will also delete its associated issues."
                                confirmText={`Are you sure you wish to delete the ${equipment?.name} equipment?`}
                            />
                        </Flex>
                    </HasAccess>

                    <Tag
                        className="tag-transparent"
                        style={{
                            textTransform: "uppercase",
                            backgroundColor: "transparent !important",
                        }}
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
                </Flex>
            </Flex>
        </Card>
    );
};

export default HeaderCard;
