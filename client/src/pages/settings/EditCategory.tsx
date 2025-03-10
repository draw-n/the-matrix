import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Collapse,
    ColorPicker,
    Flex,
    Input,
    List,
    message,
    Modal,
    Space,
    Tag,
    Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { Category } from "../../types/Category";
import axios from "axios";
import EditDefaultIssue from "./EditDefaultIssue";
import { geekblue } from "@ant-design/colors";
import { Equipment } from "../../types/Equipment";
import { Material } from "../../types/Material";
import ConfirmAction from "../../components/ConfirmAction";

interface EditCategoryProps {
    category: Category;
    onUpdate: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
    category,
    onUpdate,
}: EditCategoryProps) => {
    const [defaultIssues, setDefaultIssues] = useState<string[]>(
        category.defaultIssues || []
    );
    const [color, setColor] = useState(category.color);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
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

    const deleteIssueAtIndex = (index: number) => {
        const updatedArray = [...defaultIssues.slice(0, index), ...defaultIssues.slice(index + 1)];
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
    }, [defaultIssues])

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
                    <ConfirmAction
                        target={
                            <Button icon={<DeleteOutlined />} danger>
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
