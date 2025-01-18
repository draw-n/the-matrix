import { Input, Form, Button, Select, Modal, Tooltip } from "antd";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface CreateAnnouncementFormProps {
    onUpdate: () => void;
}

interface FieldType {
    type: string;
    description: string;
}

const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({
    onUpdate,
}: CreateAnnouncementFormProps) => {
    const { user } = useAuth();

    const [type, setType] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
                status: "posted",
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/announcements`,
                newUpdate
            ); //TODO: add a success vs error and relay that information
            onUpdate();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating new update:", error);
        }
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

export default CreateAnnouncementForm;
