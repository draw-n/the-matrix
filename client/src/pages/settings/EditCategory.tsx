import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Tooltip } from "antd";
import { useState } from "react";
import { Category } from "../../types/Category";
import axios from "axios";
import EditDefaultIssue from "./EditDefaultIssue";

interface EditCategoryProps {
    category: Category;
    onUpdate: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
    category,
    onUpdate,
}: EditCategoryProps) => {
    const [defaultIssues, setDefaultIssues] = useState<string[] | undefined>(
        category.defaultIssues
    );

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
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

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
            {JSON.stringify(defaultIssues)}
            <Flex justify="space-between">
                <h2>{category.name}</h2>
                <Flex justify="end">
                    <Button
                        onClick={deleteCategory}
                        icon={<DeleteOutlined />}
                        danger
                    >
                        Delete
                    </Button>
                </Flex>
            </Flex>

            {defaultIssues?.map((issue, index) => (
                <EditDefaultIssue
                    initialEditMode={issue === ""}
                    index={index}
                    issue={issue}
                    setIssue={updateIssueAtIndex}
                    updateCategory={updateCategory}
                />
            ))}

            <Flex justify="center">
                <Button onClick={addIssue} icon={<PlusOutlined />}>
                    Add Issue
                </Button>
            </Flex>
        </Flex>
    );
};

export default EditCategory;
