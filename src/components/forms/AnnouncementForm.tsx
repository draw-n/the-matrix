// Description: Announcement form component for creating and editing announcements.

import { useState } from "react";
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

import type {
    Announcement,
    AnnouncementStatus,
    WithAnnouncement,
} from "../../types/announcement";
import { CommonFormProps } from "../../types/common";
import {
    useEditAnnouncementById,
    useCreateAnnouncement,
} from "../../hooks/announcement";

const { TextArea } = Input;

type AnnouncementFormProps = WithAnnouncement & CommonFormProps;

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
    announcement,
    onSubmit,
}: AnnouncementFormProps) => {
    const [form] = Form.useForm();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { mutateAsync: editAnnouncementById } = useEditAnnouncementById();
    const { mutateAsync: createAnnouncement } = useCreateAnnouncement();
    const onFinish: FormProps<Announcement>["onFinish"] = async (values) => {
        if (announcement) {
            const editedAnnouncement: Announcement = {
                ...values,
                lastUpdatedBy: user?.uuid || announcement.createdBy,
                dateLastUpdated: new Date(),
            };
            await editAnnouncementById({
                announcementId: announcement.uuid,
                editedAnnouncement: editedAnnouncement,
            });
        } else {
            const announcement = {
                ...values,
                createdBy: user?.uuid,
                dateCreated: new Date(),
                status: "posted" as AnnouncementStatus,
            };
            await createAnnouncement(announcement);
            form.resetFields();
        }
        onSubmit();
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
                    size="middle"
                    icon={announcement ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    iconPosition="end"
                    shape={announcement ? "circle" : "round"}
                >
                    {announcement ? null : "Add New Announcement"}
                </Button>
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
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
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
                        <Form.Item<Announcement>
                            style={{ width: "50%" }}
                            name="title"
                            label="Title"
                        >
                            <Input size="small" />
                        </Form.Item>
                        <Form.Item<Announcement>
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

                    <Form.Item<Announcement>
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
