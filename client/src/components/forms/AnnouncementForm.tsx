import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext";

import {
    Input,
    Form,
    Button,
    Select,
    Modal,
    Tooltip,
    FormProps,
    Flex,
} from "antd";
import { CaretDownFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";

import type { Announcement } from "../../types/Announcement";

const { TextArea } = Input;

interface AnnouncementFormProps {
    announcement?: Announcement;
    onUpdate: () => void;
}

interface FieldType {
    type: string;
    title: string;
    description: string;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
    announcement,
    onUpdate,
}: AnnouncementFormProps) => {
    const [form] = Form.useForm();
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        form.submit();
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            if (announcement) {
                const editedAnnouncement: Announcement = {
                    ...values,
                    _id: announcement._id,
                    createdBy: announcement.createdBy,
                    dateCreated: announcement.dateCreated,
                    lastUpdatedBy: user?._id || announcement.createdBy,
                    dateLastUpdated: new Date(),
                    status: announcement.status,
                };
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/announcements/${
                        announcement._id
                    }`,
                    editedAnnouncement
                );
            } else {
                const announcement = {
                    createdBy: user?._id,
                    dateCreated: new Date(),
                    status: "posted",
                    ...values,
                };
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/announcements`,
                    announcement
                );
                form.resetFields();
            }

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
            <Tooltip
                title={announcement ? "Edit Announcement" : "Add Announcement"}
                placement="topLeft"
            >
                <Button
                    type="primary"
                    size="small"
                    icon={announcement ? <EditOutlined /> : <PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>
            <Modal
                styles={{
                    body: {
                        scrollbarGutter: "stable && both-edges",
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 200px)",
                    },
                }}
                title={announcement ? "Edit Announcement" : "Add Announcement"}
                open={isModalOpen}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                    style={{ width: "100%" }}
                    autoComplete="off"
                    preserve={false}
                    initialValues={
                        announcement
                            ? {
                                  type: announcement.type,
                                  title: announcement.title,
                                  description: announcement.description,
                              }
                            : {
                                  type: null,
                                  title: "",
                                  description: "",
                              }
                    }
                >
                    <Flex justify="space-between" gap="small">
                        <Form.Item<FieldType>
                            style={{ width: "50%" }}
                            name="title"
                            label="Title"
                        >
                            <Input size="small" />
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
                                size="small"
                                suffixIcon={<CaretDownFilled />}
                                options={[
                                    { value: "event", label: "Event" },
                                    { value: "classes", label: "Classes" },
                                    { value: "other", label: "Other" },
                                ]}
                            />
                        </Form.Item>
                    </Flex>

                    <Form.Item<FieldType>
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
                        <TextArea size="small" rows={6} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AnnouncementForm;
