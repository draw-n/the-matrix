import {
    DeleteOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, Typography, Collapse, Flex, List, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { WithCategory } from "../../types/category";
import axios from "axios";
import EditDefaultIssue from "./EditDefaultIssue";

import ConfirmAction from "../../components/ConfirmAction";
import CategoryForm from "../../components/forms/CategoryForm";
import { useAllEquipment } from "../../hooks/equipment";
import { useAllMaterials } from "../../hooks/material";
import {
    useDeleteCategoryById,
    useEditCategoryById,
} from "../../hooks/category";


const { Title } = Typography;

const EditCategory: React.FC<WithCategory> = ({
    category,
}: WithCategory) => {
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
                <Title level={4}>{category?.name}</Title>
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

export default EditCategory;
