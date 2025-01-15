import React, { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import type { Announcement } from "../../types/Announcement";

interface EditAnnouncementFormProps {
    announcement: Announcement;
    onUpdate: () => void;
}

const { TextArea } = Input;

const EditAnnouncementForm: React.FC<EditAnnouncementFormProps> = ({
    announcement,
    onUpdate,
}: EditAnnouncementFormProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState(announcement.type);
    const [description, setDescription] = useState(announcement.description);

    const { user } = useAuth();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const editedAnnouncement = {
                id: announcement._id,
                description: description,
                createdBy: announcement.createdBy,
                dateCreated: announcement.dateCreated,
                type: type,
                lastUpdatedBy: user?._id,
                dateLastUpdated: Date(),
                status: announcement.status,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/announcements/${
                    announcement._id
                }`,
                editedAnnouncement
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
            <Button className="primary-button-filled" onClick={showModal}>
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

export default EditAnnouncementForm;
