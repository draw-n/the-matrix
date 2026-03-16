// Description: Announcement form component for creating and editing announcements.

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

import {
    Input,
    Form,
    Button,
    Select,
    Modal,
    Tooltip,
    FormProps,
    Flex,
    Upload,
    UploadFile,
    UploadProps,
    message,
} from "antd";
import {
    CaretDownFilled,
    EditOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";

import type {
    Announcement,
    AnnouncementStatus,
    WithAnnouncement,
} from "../../types/announcement";
import {
    useEditAnnouncementById,
    useCreateAnnouncement,
} from "../../hooks/useAnnouncements";
import axios from "axios";

const AnnouncementForm: React.FC<WithAnnouncement> = ({
    announcement,
}: WithAnnouncement) => {
    const [form] = Form.useForm();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { mutateAsync: editAnnouncementById } = useEditAnnouncementById();
    const { mutateAsync: createAnnouncement } = useCreateAnnouncement();
    const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);

    // If editing an existing announcement that already has an image on the server,
    // show it in the Upload component by adding a file entry with `url`.
    useEffect(() => {
        if (!announcement || !announcement.imageName) return;
        const fileName = announcement.imageName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/images/announcements/${fileName}`;

        let previewUrl: string | null = null;
        (async () => {
            try {
                const response = await axios.get(url, {
                    responseType: "blob",
                    withCredentials: true,
                });
                if (!response.data)
                    throw new Error(
                        `Failed to fetch image: ${response.status}`,
                    );
                const blob = await response.data;
                const file = new File([blob], fileName, {
                    type: blob.type || "application/octet-stream",
                });
                // create a preview so Upload shows the item as if it were local
                previewUrl = URL.createObjectURL(file);
                setUploadedFile([
                    {
                        uid: `server-${fileName}`,
                        name: fileName,
                        status: "done",
                        originFileObj: file,
                        url,
                        thumbUrl: previewUrl,
                    } as UploadFile,
                ]);
            } catch (err) {
                // Fallback to URL-only entry if fetching as blob fails
                setUploadedFile([
                    {
                        uid: `server-${fileName}`,
                        name: fileName,
                        status: "done",
                        url,
                        thumbUrl: url,
                    } as UploadFile,
                ]);
            }
        })();
        // cleanup preview URL when announcement changes or component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [announcement]);

    const onFinish: FormProps<Announcement>["onFinish"] = async (values) => {
        if (announcement) {
            const editedAnnouncement: Announcement = {
                ...values,
                lastUpdatedBy: user?.uuid || announcement.createdBy,
                dateLastUpdated: new Date(),
            };
            await editAnnouncementById({
                announcementId: announcement.uuid,
                updatedAnnouncement: editedAnnouncement,
                file: uploadedFile[0]?.originFileObj,
            });
        } else {
            const newAnnouncement = {
                ...values,
                createdBy: user?.uuid,
                dateCreated: new Date(),
                status: "posted" as AnnouncementStatus,
            };
            await createAnnouncement({
                newAnnouncement: newAnnouncement,
                file: uploadedFile[0]?.originFileObj,
            });
            form.resetFields();
        }
        setIsModalOpen(false);
    };

    const props: UploadProps = {
        beforeUpload: (file) => {
            // 1. Validate File Extension
            const isValidExtension =
                file.name.toLowerCase().endsWith(".jpg") ||
                file.name.toLowerCase().endsWith(".png") ||
                file.name.toLowerCase().endsWith(".gif") ||
                file.name.toLowerCase().endsWith(".bmp") ||
                file.name.toLowerCase().endsWith(".webp") ||
                file.name.toLowerCase().endsWith(".tiff") ||
                file.name.toLowerCase().endsWith(".raw") ||
                file.name.toLowerCase().endsWith(".svg") ||
                file.name.toLowerCase().endsWith(".jpeg");

            if (!isValidExtension) {
                message.error("Only image files are supported.");
                return Upload.LIST_IGNORE;
            }
            // 2. Validate File Size (50MB)
            const isLt50M = file.size / 1024 / 1024 < 50;

            if (!isLt50M) {
                message.error("File must be smaller than 50MB.");
                return Upload.LIST_IGNORE;
            }

            // 3. Update State
            setUploadedFile([
                {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                },
            ]);

            return false; // Prevent auto upload
        },
        onChange: ({ fileList }) => {
            setUploadedFile(fileList as UploadFile[]);
        },
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
                        <Input.TextArea size="small" rows={6} />
                    </Form.Item>
                    <Form.Item name="file">
                        <Upload
                            {...props}
                            fileList={uploadedFile}
                            listType="picture"
                        >
                            <Button
                                shape="round"
                                type="default"
                                icon={<UploadOutlined />}
                            >
                                Upload Image
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AnnouncementForm;
