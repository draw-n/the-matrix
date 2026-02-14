// Description: HeaderCard component for displaying equipment header information.
import { useState } from "react";
import { Card, Flex, Tag, theme, Button, Input, Form, Select, Typography } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

import { Equipment, WithEquipment } from "../../../types/equipment";

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
        token: { colorPrimary},
    } = theme.useToken();
    const [editMode, setEditMode] = useState(false);
    const { data: categories } = useAllCategories();

    const name = Form.useWatch("name", form);
    const headline = Form.useWatch("headline", form);
    const categoryId = Form.useWatch("categoryId", form);

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
                <Flex
                    style={{ flex: 1 }}
                    vertical
                    align="flex-start"
                    gap="small"
                >
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
                                options={categories?.map((category) => ({
                                    label: category.name,
                                    value: category.uuid,
                                }))}
                            />
                        ) : (
                            <Tag style={{ textTransform: "uppercase" }}>
                                {
                                    categories?.find(
                                        (item) => item.uuid === categoryId,
                                    )?.name
                                }
                            </Tag>
                        )}
                    </Form.Item>

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
                <Flex justify="flex-end" align="center">
                    <HasAccess roles={["admin", "moderator"]}>
                        <Button
                            shape="circle"
                            variant="text"
                            type="default"
                            ghost
                            htmlType="submit"
                            icon={
                                editMode ? <SaveOutlined /> : <EditOutlined />
                            }
                        />
                    </HasAccess>
                </Flex>
            </Form>
        </Card>
    );
};

export default HeaderCard;
