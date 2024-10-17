import React, { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";

interface EditModalProps {
    defaultType: string;
    defaultDescription: string;
    id: string;
    createdBy: string;
    dateCreated: Date;
    onUpdate: () => void;
}

const { TextArea } = Input;

const EditModal: React.FC<EditModalProps> = ({
    defaultType,
    defaultDescription,
    id,
    createdBy,
    dateCreated,
    onUpdate
}: EditModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState(defaultType);
    const [description, setDescription] = useState(defaultDescription);

    const { user } = useAuth();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const editedUpdate = {
                id: id,
                description: description,
                createdBy: createdBy,
                dateCreated: dateCreated,
                type: type,
                lastUpdatedBy: user?._id,
                dateLastUpdated: Date(),
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/updates/${id}`,
                editedUpdate
            );
            onUpdate();
        } catch (error) {
            console.error("Issue editing update", error);
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Edit
            </Button>
            <Modal
                title="Edit Update"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="Type">
                        <Select
                            value={type}
                            onChange={setType}
                            options={[
                                { value: "event", label: "Event" },
                                { value: "classes", label: "Classes" },
                                { value: "other", label: "Other" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Description">
                        <TextArea
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditModal;
