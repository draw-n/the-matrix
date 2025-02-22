import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, Tooltip, FormProps } from "antd";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import type { Announcement } from "../../types/Announcement";
import { CaretDownFilled, EditOutlined } from "@ant-design/icons";

interface EditAnnouncementFormProps {
    announcement: Announcement;
    onUpdate: () => void;
}

interface FieldType {
    type: string;
    description: string;
}

const { TextArea } = Input;

const EditAnnouncementForm: React.FC<EditAnnouncementFormProps> = ({
    announcement,
    onUpdate,
}: EditAnnouncementFormProps) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useAuth();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            const editedAnnouncement: Announcement = {
                ...values,
                _id: announcement._id,
                createdBy: announcement.createdBy,
                dateCreated: announcement.dateCreated,
                lastUpdatedBy: user?._id || announcement.createdBy,
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
            setIsModalOpen(false);
        } catch (error) {
            console.error("Issue editing update", error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title="Edit">
                <Button
                    icon={<EditOutlined />}
                    className="primary-button-filled"
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Edit Update"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    initialValues={{
                        type: announcement.type,
                        description: announcement.description,
                    }}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item<FieldType> name="type" label="Type">
                        <Select
                            suffixIcon={<CaretDownFilled />}
                            options={[
                                { value: "event", label: "Event" },
                                { value: "classes", label: "Classes" },
                                { value: "other", label: "Other" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType> name="description" label="Description">
                        <TextArea rows={6} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditAnnouncementForm;
