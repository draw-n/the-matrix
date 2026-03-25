// Description: Categories component for managing and editing categories in the settings page.

import React, { useEffect, useState } from "react";
import {
    Button,
    Collapse,
    Flex,
    Form,
    FormProps,
    Input,
    List,
    Popconfirm,
    Space,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import CategoryForm from "../../../components/forms/CategoryForm";

import {
    useAllCategories,
    useDeleteCategoryById,
    useEditCategoryById,
} from "../../../hooks/useCategories";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {
    DeleteOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    SaveOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Category, WithCategory } from "../../../types/category";
import { useAllEquipment } from "../../../hooks/useEquipment";
import { useAllMaterials } from "../../../hooks/useMaterials";
import ConfirmAction from "../../../components/common/ConfirmAction";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
    {
        label: "None",
        children: <p>No categories available.</p>,
        key: "1",
        closable: false,
    },
];

const Categories: React.FC = () => {
    const [activeKey, setActiveKey] = useState("0");
    const [items, setItems] = useState(initialItems);
    const { data: categories, refetch } = useAllCategories();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    useEffect(() => {
        if (!categories || categories.length === 0) {
            setItems(initialItems);
            return;
        }
        const formattedData = categories.map(
            (category: any, index: number) => ({
                label: category.name,
                children: <EditCategory category={category} />,
                key: String(index),
                closable: false,
            }),
        );
        setItems(formattedData);
    }, [categories]);

    const add = () => {
        setIsModalOpen(true);
    };

    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: "add" | "remove",
    ) => {
        if (action === "add") {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <Space size="middle" vertical style={{ width: "100%" }}>
            <h2>CATEGORIES</h2>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
            />
            <CategoryForm
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
            />
        </Space>
    );
};

const EditCategory: React.FC<WithCategory> = ({ category }: WithCategory) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: equipment } = useAllEquipment(category?.uuid);
    const { data: materials } = useAllMaterials(category?.uuid);
    const { mutateAsync: editCategoryById } = useEditCategoryById();
    const { mutateAsync: deleteCategoryById } = useDeleteCategoryById();
    const [editMode, setEditMode] = useState(false);

    const onFinish: FormProps<Category>["onFinish"] = async (values) => {
        if (category) {
            const editedCategory: Category = {
                ...category,
                defaultIssues: values.defaultIssues,
            };
            await editCategoryById({
                categoryId: category.uuid,
                editedCategory,
            });
        }
    };

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between">
                <Typography.Title level={4}>{category?.name}</Typography.Title>
                <Flex justify="end" gap="middle">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        icon={<SettingOutlined />}
                        size="small"
                    >
                        Settings
                    </Button>
                    <CategoryForm
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        category={category}
                    />
                    <ConfirmAction
                        target={
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            >
                                Delete
                            </Button>
                        }
                        actionSuccess={() =>
                            deleteCategoryById({
                                categoryId: category?.uuid || "",
                            })
                        }
                        title={`Delete the ${category?.name} Category`}
                        headlineText="Deleting this category will also delete its associated equipment and materials."
                        confirmText={`Are you sure you wish to delete the ${category?.name} category?`}
                        children={
                            <Collapse
                                size="small"
                                items={[
                                    {
                                        key: "1",
                                        label: "Equipment",
                                        children: (
                                            <List
                                                size="small"
                                                dataSource={equipment?.map(
                                                    (item) => item.name,
                                                )}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        {item}
                                                    </List.Item>
                                                )}
                                            />
                                        ),
                                    },
                                    {
                                        key: "2",
                                        label: "Materials",
                                        children: (
                                            <List
                                                size="small"
                                                dataSource={materials?.map(
                                                    (item) => item.name,
                                                )}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        {item}
                                                    </List.Item>
                                                )}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        }
                    />
                </Flex>
            </Flex>

            <Form
                form={form}
                onFinish={onFinish}
                initialValues={{ defaultIssues: category?.defaultIssues || [] }}
            >
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Typography.Title level={5}>
                            Default Issues
                        </Typography.Title>
                        <Button
                            type="primary"
                            shape="circle"
                            onClick={() => {
                                if (editMode) {
                                    form.submit();
                                }
                                setEditMode(!editMode);
                            }}
                            icon={
                                editMode ? <SaveOutlined /> : <EditOutlined />
                            }
                        />
                    </Flex>
                </Form.Item>

                <Form.List
                    name="defaultIssues"
                    rules={[
                        {
                            validator: async (_, names) => {
                                if (!names || names.length < 2) {
                                    return Promise.reject(
                                        new Error("At least 2 passengers"),
                                    );
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field) => (
                                <Form.Item required={false} key={field.key}>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        gap="small"
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={[
                                                "onChange",
                                                "onBlur",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message:
                                                        "Please input this default issue or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input disabled={!editMode} />
                                        </Form.Item>
                                        {fields.length > 1 && editMode ? (
                                            <Button
                                                color="red"
                                                variant="text"
                                                shape="circle"
                                                icon={<MinusCircleOutlined />}
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        ) : null}
                                    </Flex>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Flex justify="center">
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Issue
                                    </Button>
                                </Flex>

                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>

            <h3>Equipment</h3>
            <Flex wrap>
                {equipment?.map((item) => (
                    <Tag>{item.name}</Tag>
                ))}
            </Flex>
            <h3>Materials</h3>
            <Flex wrap>
                {materials?.map((item) => (
                    <Tag>{item.name}</Tag>
                ))}
            </Flex>
        </Flex>
    );
};

export default Categories;
