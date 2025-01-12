import { Input, Form, Flex, Button, Select, Modal, Switch, Tag } from "antd";
import { FormProps } from "antd";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

interface MaterialFormProps {
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    shortName: string;
    type: string;
    description: string;
    properties: string[];
    remotePrintAvailable: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const MaterialForm: React.FC<MaterialFormProps> = ({
    onUpdate,
}: MaterialFormProps) => {
    const [name, setName] = useState("");
    const [shortName, setShortName] = useState("");
    const [type, setType] = useState("");
    const [properties, setProperties] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [remotePrintAvailable, setRemotePrintAvailable] = useState(false);

    const [inputValue, setInputValue] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const newMaterial = {
                name: name,
                type: type,
                shortName: shortName,
                description: description,
                properties: properties,
                remotePrintAvailable: remotePrintAvailable,
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/materials`,
                newMaterial
            );
            onUpdate();
        } catch (error) {
            console.error("Error creating new update:", error);
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Handle input change
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    // Handle input keydown event
    const handleKeyDown = (e: any) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (inputValue.trim() && !properties.includes(inputValue.trim())) {
                setProperties([...properties, inputValue.trim()]);
                setInputValue("");
            }
        }
    };

    // Handle tag deletion
    const handleDeleteTag = (tagToDelete: any) => {
        setProperties(properties.filter((tag) => tag !== tagToDelete));
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                <PlusOutlined />
            </Button>
            <Modal
                title="Add New Materials"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
            >
                <Form
                    name="basic"
                    layout="vertical"
                    style={{ width: "100%" }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name for the material.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="ex. Polylactic Acid"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Item>
                    <Flex gap="10px">
                        <Form.Item<FieldType>
                            style={{ width: "50%" }}
                            label="Short Name"
                            name="shortName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a name for the material.",
                                },
                            ]}
                        >
                            <Input
                                placeholder="ex. PLA"
                                onChange={(e) => setShortName(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item<FieldType>
                            style={{ width: "50%" }}
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category type.",
                                },
                            ]}
                        >
                            <Select
                                onChange={setType}
                                options={[
                                    {
                                        value: "filament",
                                        label: "Filament",
                                    },
                                    { value: "resin", label: "Resin" },
                                    { value: "powder", label: "Powder" },
                                ]}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Properties"
                        name="properties"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add properties for the material.",
                            },
                        ]}
                    >
                        <Input
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type and press Enter or comma to add tags"
                            style={{ width: "100%" }}
                        />
                        {properties.map((tag, index) => (
                            <Tag
                                key={index}
                                closable
                                onClose={() => handleDeleteTag(tag)}
                                style={{ margin: 4 }}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </Form.Item>

                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description to the equipment.",
                            },
                        ]}
                    >
                        <TextArea
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label={null}
                        name="remotePrintAvailable"
                        rules={[
                            {
                                required: true,
                                message: "Please select an option.",
                            },
                        ]}
                    >
                        <Flex gap="10px" align="center">
                            <Switch
                                value={remotePrintAvailable}
                                onChange={setRemotePrintAvailable}
                            />
                            <p>Will it be available for remote printing?</p>
                        </Flex>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default MaterialForm;
