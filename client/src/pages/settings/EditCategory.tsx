import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    ColorPicker,
    Flex,
    Input,
    Modal,
    Space,
    Tooltip,
} from "antd";
import { useState } from "react";
import { Category } from "../../types/Category";
import axios from "axios";
import EditDefaultIssue from "./EditDefaultIssue";
import { geekblue } from "@ant-design/colors";

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
    const [color, setColor] = useState(category.color);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        deleteCategory();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
        setIsColorPickerOpen(false);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/categories/${
                    category._id
                }`,
                { ...category, defaultIssues, color }
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
                    <ColorPicker
                        defaultValue={category.color || geekblue[5]}
                        showText
                        allowClear
                        onOpenChange={setIsColorPickerOpen}
                        open={isColorPickerOpen}
                        onChange={(e) => setColor(e.toHexString())}
                        panelRender={(panel) => (
                            <Flex vertical gap="small">
                                {panel}

                                <Flex justify="end">
                                    <Button onClick={updateCategory}>
                                        Save
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                    />

                    <Button
                        onClick={showModal}
                        icon={<DeleteOutlined />}
                        danger
                    >
                        Delete
                    </Button>
                    <>
                        <Modal
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            centered
                            title={`Delete the ${category.name} Category`}
                        >
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                                size="small"
                            >
                                <p>
                                    Deleting this category will also delete its
                                    associated equipment and materials.
                                </p>
                                <p>
                                    <b>
                                        Are you sure you wish to delete the{" "}
                                        {category.name} category?
                                    </b>
                                </p>
                            </Space>
                        </Modal>
                    </>
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
