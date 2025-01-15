import { Input, Form, Flex, Button, Select, Modal, Tooltip } from "antd";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

interface CreateEquipmentFormProps {
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    type: string;
    description: string;
    routePath: string;
}

const { TextArea } = Input;

const CreateEquipmentForm: React.FC<CreateEquipmentFormProps> = ({
    onUpdate,
}: CreateEquipmentFormProps) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [routePath, setRoutePath] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const newEquipment = {
                name: name,
                type: type,
                description: description,
                routePath,
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/equipment`,
                newEquipment
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

    return (
        <>
            <Tooltip title="Add New Equipment">
                <Button
                    type="primary"
                    className="primary-button-filled"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Add New Equipment"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
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
                                message:
                                    "Please add a description to the announcement.",
                            },
                        ]}
                    >
                        <Input onChange={(e) => setName(e.target.value)} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Route Path"
                        name="routePath"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a route path (ex. voron-1).",
                            },
                        ]}
                    >
                        <Input onChange={(e) => setRoutePath(e.target.value)} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Type of Equipment"
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
                                    label: "Filament Printers",
                                },
                                { value: "resin", label: "Resin Printers" },
                                { value: "powder", label: "Powder Printers" },
                                {
                                    value: "subtractive",
                                    label: "Subtractive/Traditional Manufacturing",
                                },
                                {
                                    value: "computer",
                                    label: "Desktops/TV Monitor",
                                },
                                { value: "wiring", label: "Wiring Tools" },
                                { value: "other", label: "Other" },
                            ]}
                        />
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
                            rows={6}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateEquipmentForm;
