import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Flex, List, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { Category } from "../../types/Category";
import axios from "axios";
import EditDefaultIssue from "./EditDefaultIssue";
import { Equipment } from "../../types/Equipment";
import { Material } from "../../types/Material";
import ConfirmAction from "../../components/ConfirmAction";
import CategoryForm from "./CategoryForm";

interface EditCategoryProps {
    category: Category;
    onUpdate: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
    category,
    onUpdate,
}: EditCategoryProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [defaultIssues, setDefaultIssues] = useState<string[]>(
        category.defaultIssues || []
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/equipment?category=${
                        category._id
                    }`
                );
                setEquipment(response.data);
                setIsLoading(true);
            } catch (error) {
                console.error(error);
            }
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/materials?category=${
                        category._id
                    }`
                );
                setMaterials(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [category]);

    const updateIssueAtIndex = (index: number, newIssue: string) => {
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
        updateCategory();
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

    const deleteCategory = async () => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/categories/${category._id}`
            );
            message.success(response.data.message);
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        updateCategory();
    }, [defaultIssues]);

    const updateCategory = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/categories/${
                    category._id
                }`,
                { ...category, defaultIssues }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between">
                <h2>{category.name}</h2>
                <Flex justify="end" gap="middle">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        icon={<SettingOutlined />}
                        size="small"
                    >
                        Settings
                    </Button>
                    <CategoryForm
                        onUpdate={onUpdate}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        category={category}
                    />
                    <ConfirmAction
                        target={
                            <Button icon={<DeleteOutlined />} size="small" danger>
                                Delete
                            </Button>
                        }
                        actionSuccess={deleteCategory}
                        title={`Delete the ${category.name} Category`}
                        headlineText="Deleting this category will also delete its associated equipment and materials."
                        confirmText={`Are you sure you wish to delete the ${category.name} category?`}
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
                                                    (item) => item.name
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
                                                    (item) => item.name
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
                    updateCategory={updateCategory}
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
