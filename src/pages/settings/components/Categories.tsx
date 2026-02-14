// Description: Categories component for managing and editing categories in the settings page.

import React, { useEffect, useState } from "react";
import { Button, Collapse, Flex, Input, List, Popconfirm, Space, Tabs, Tag, Tooltip, Typography } from "antd";
import CategoryForm from "../../../components/forms/CategoryForm";

import { useAllCategories, useDeleteCategoryById, useEditCategoryById } from "../../../hooks/useCategories";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { DeleteOutlined, PlusOutlined, SaveOutlined, SettingOutlined } from "@ant-design/icons";
import { WithCategory } from "../../../types/category";
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
        <Space size="middle" direction="vertical" style={{ width: "100%" }}>
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
    const [defaultIssues, setDefaultIssues] = useState<string[]>(
        category?.defaultIssues || [],
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: equipment } = useAllEquipment(category?.uuid);
    const { data: materials } = useAllMaterials(category?.uuid);
    const { mutateAsync: editCategoryById } = useEditCategoryById();
    const { mutateAsync: deleteCategoryById } = useDeleteCategoryById();

    const updateIssueAtIndex = (index: number, newIssue: string) => {
        // Update the issue at the specified index
        setDefaultIssues((prevIssues) => {
            if (prevIssues) {
                const updatedIssues = [...prevIssues];
                updatedIssues[index] = newIssue; // Update the issue at the given index
                return updatedIssues;
            }
            return prevIssues;
        });
    };

    const deleteIssueAtIndex = (index: number) => {
        const updatedArray = [
            ...defaultIssues.slice(0, index),
            ...defaultIssues.slice(index + 1),
        ];
        setDefaultIssues(updatedArray);
    };

    const addIssue = () => {
        const newIssue = ""; // You can customize how you get the new issue

        // Update defaultIssues while preventing duplicates
        setDefaultIssues((prevIssues) => {
            if (prevIssues) {
                let updatedIssues = new Set(prevIssues);
                updatedIssues.add(newIssue); // Add new issue
                return Array.from(updatedIssues); // Convert back to array
            }
            return [newIssue];
        });
    };

    useEffect(() => {
        editCategoryById({
            categoryId: category?.uuid || "",
            editedCategory: {
                ...category,
                defaultIssues: defaultIssues.filter(
                    (issue) => issue.length != 0,
                ),
            },
        });
    }, [defaultIssues]);

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

            {defaultIssues?.map((issue, index) => (
                <EditDefaultIssue
                    initialEditMode={issue === ""}
                    index={index}
                    issue={issue}
                    updateIssue={updateIssueAtIndex}
                    deleteIssue={deleteIssueAtIndex}
                    updateCategory={() =>
                        editCategoryById({
                            categoryId: category?.uuid || "",
                            editedCategory: {
                                ...category,
                                defaultIssues: defaultIssues.filter(
                                    (issue) => issue.length != 0,
                                ),
                            },
                        })
                    }
                />
            ))}

            <Flex justify="center">
                <Button onClick={addIssue} icon={<PlusOutlined />}>
                    Add Issue
                </Button>
            </Flex>
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


interface EditDefaultIssueProps {
    initialEditMode: boolean;
    issue: string;
    updateIssue: (index: number, item: string) => void;
    index: number;
    updateCategory: () => void;
    deleteIssue: (index: number) => void;
}

const EditDefaultIssue: React.FC<EditDefaultIssueProps> = ({
    issue,
    updateIssue,
    index,
    initialEditMode,
    updateCategory,
    deleteIssue,
}: EditDefaultIssueProps) => {
    const [editMode, setEditMode] = useState(initialEditMode);

    return (
        <Flex justify="space-between" gap="small">
            <Input
                onChange={(e) => updateIssue(index, e.target.value)}
                value={issue}
                disabled={!editMode}
            />
            {editMode ? (
                <Tooltip title="Save Issue">
                    <Button
                        size="small"
                        icon={<SaveOutlined />}
                        onClick={() => {
                            issue.trim() !== "" &&
                                updateCategory() &&
                                setEditMode(false);
                        }}
                    />
                </Tooltip>
            ) : (
                <Tooltip title="Edit Issue">
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                    />
                </Tooltip>
            )}

            <Tooltip title="Delete">
                <Popconfirm
                    placement="topRight"
                    title="Delete Common Issue"
                    description="Are you sure you want to delete this common issue?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => deleteIssue(index)}
                >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            </Tooltip>
        </Flex>
    );
};

export default Categories;
