import { Input, Form, Flex, Button, Select, Modal, Tooltip } from "antd";
import { FormProps } from "antd";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

interface AnnouncementFormProps {
    onUpdate: () => void;
}

interface FieldType {
    type: string;
    description: string;
}

const { TextArea } = Input;

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onUpdate }) => {
    const { user } = useAuth();
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const newUpdate = {
                type: type,
                description: description,
                createdBy: user?._id,
                dateCreated: Date(),
                status: "posted"
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/announcements`,
                newUpdate
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
            <Tooltip title="Make a New Announcement">
                <Button
                    type="primary"
                    className="primary-button-filled"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>
            <Modal
                title="Create a New Announcement"
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
                        label="Type of Update"
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
                                { value: "event", label: "Event" },
                                { value: "classes", label: "Classes" },
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
                                    "Please add a description to the announcement.",
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

export default AnnouncementForm;
