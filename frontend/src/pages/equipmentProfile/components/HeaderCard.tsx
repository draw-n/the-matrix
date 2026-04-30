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
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

import {
    Equipment,
    EquipmentStatus,
    equipmentStatusStyles,
    WithEquipment,
} from "../../../types/equipment";

import HasAccess from "../../../components/routing/HasAccess";
import { EditableComponentProps } from "../../../types/common";
import { useAllCategories } from "../../../hooks/useCategories";

type HeaderCardProps = WithEquipment & EditableComponentProps<Equipment>;

const HeaderCard: React.FC<HeaderCardProps> = ({
    equipment,
    handleClick,
}: HeaderCardProps) => {
    const [form] = Form.useForm();
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [editMode, setEditMode] = useState(false);
    const { data: categories } = useAllCategories();

    const name = Form.useWatch("name", form);
    const headline = Form.useWatch("headline", form);
    const categoryId = Form.useWatch("categoryId", form);

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
            <Form
                colon={false}
                initialValues={{
                    name: equipment?.name,
                    headline: equipment?.headline,
                    categoryId: equipment?.categoryId,
                }}
                form={form}
                onFinish={() =>
                    handleClick &&
                    handleClick(editMode, setEditMode, form.getFieldsValue())
                }
            >
                <Flex align="space-between">
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
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input the name!",
                                        },
                                    ]}
                                    noStyle
                                >
                                    {editMode ? (
                                        <Input
                                            style={{
                                                color: "white",
                                                textTransform: "uppercase",
                                                fontSize: "inherit",
                                                fontWeight: "inherit",
                                                background: "transparent",
                                                borderColor: "white",
                                            }}
                                        />
                                    ) : (
                                        <span>{name}</span>
                                    )}
                                </Form.Item>
                            </Typography.Title>
                            <Form.Item name="categoryId" noStyle>
                                {editMode ? (
                                    <Select
                                        size="small"
                                        style={{
                                            width: "auto",
                                            minWidth: "fit-content",
                                            flexShrink: 0,
                                        }}
                                        popupMatchSelectWidth={false}
                                        options={categories?.map(
                                            (category) => ({
                                                label: category.name,
                                                value: category.uuid,
                                            }),
                                        )}
                                    />
                                ) : (
                                    <Tag
                                        color={
                                            categories?.find(
                                                (item) =>
                                                    item.uuid === categoryId,
                                            )?.color
                                        }
                                        variant="solid"
                                        style={{ textTransform: "uppercase" }}
                                    >
                                        {
                                            categories?.find(
                                                (item) =>
                                                    item.uuid === categoryId,
                                            )?.name
                                        }
                                    </Tag>
                                )}
                            </Form.Item>
                        </Flex>
                        <Flex style={{ width: "100%" }} vertical>
                            <p style={{ color: "white" }}>
                                <Form.Item
                                    name="headline"
                                    noStyle={!editMode}
                                    label={
                                        <span style={{ color: "white" }}>
                                            Headline
                                        </span>
                                    }
                                >
                                    {editMode ? (
                                        <Input
                                            style={{
                                                fontSize: "inherit",
                                                margin: "inherit",
                                                backgroundColor: "inherit",
                                                color: "white",
                                                fontWeight: "inherit",
                                                borderColor: "white",
                                            }}
                                        />
                                    ) : (
                                        <span>{headline}</span>
                                    )}
                                </Form.Item>
                            </p>
                        </Flex>
                    </Flex>
                    <Flex
                        vertical
                        justify="space-between"
                        gap="middle"
                        align="end"
                    >
                        <HasAccess roles={["admin", "moderator"]}>
                            <Button
                                shape="circle"
                                variant="text"
                                type="default"
                                ghost
                                htmlType="submit"
                                icon={
                                    editMode ? (
                                        <SaveOutlined />
                                    ) : (
                                        <EditOutlined />
                                    )
                                }
                            />
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
            </Form>
        </Card>
    );
};

export default HeaderCard;
