// Description: Form component for creating new equipment entries.
import { useEffect, useState } from "react";

import {
    Input,
    Form,
    Button,
    Select,
    Modal,
    Tooltip,
    FormProps,
    Flex,
    UploadFile,
    Upload,
    message,
    UploadProps,
} from "antd";
import {
    CaretDownFilled,
    EditOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import HelpField from "./components/HelpField";
import axios from "axios";
import { User, WithUser } from "../../types/user";
import { useAllDepartments, useEditUserById } from "../../hooks/useUsers";
import { Equipment } from "../../types/equipment";
import { useAuth } from "../../contexts/AuthContext";

const UserForm: React.FC<WithUser> = ({ user }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { mutateAsync: editUserById } = useEditUserById();
    const [uploadedFile, setUploadedFile] = useState<UploadFile[]>([]);
    const { data: departments } = useAllDepartments();
    const { user: currentUser } = useAuth();
    const onFinish: FormProps["onFinish"] = async (values) => {
        if (user) {
            const editedUser: User = {
                ...user,
                ...values,
                graduationDate: values.graduationYear
                    ? new Date(values.graduationYear, 5, 30).toISOString()
                    : undefined,
            };
            await editUserById({
                userId: user.uuid,
                editedUser,
                file: uploadedFile[0]?.originFileObj,
            });
        } else {
            message.error("User information is missing. Cannot submit form.");
        }
        setIsModalOpen(false);
        form.resetFields();
    };

    useEffect(() => {
        if (!user || !user.imageName) return;
        const fileName = user.imageName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/images/users/${fileName}`;

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
    }, [user]);

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
            <Tooltip title={user ? "Edit User" : "Add User"}>
                <Button
                    type="primary"
                    size="middle"
                    color={user ? "blue" : "primary"}
                    variant="solid"
                    style={{
                        boxShadow: "none",
                    }}
                    icon={user ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    iconPlacement="end"
                    shape={user ? "circle" : "round"}
                >
                    {user ? null : "Add New User"}
                </Button>
            </Tooltip>

            <Modal
                title={user ? "Edit User" : "Add User"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                centered
                styles={{
                    body: {
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 200px)",
                        paddingRight: "16px",
                    },
                }}
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    name="basic"
                    layout="vertical"
                    colon={false}
                    style={{ width: "100%" }}
                    initialValues={{
                        ...user,
                        graduationYear: user?.graduationDate
                            ? new Date(user.graduationDate).getFullYear()
                            : undefined,
                    }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Flex gap="small">
                        <Form.Item<User>
                            style={{ width: "100%" }}
                            label="First Name"
                            name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a first name to the user.",
                                },
                            ]}
                        >
                            <Input size="small" />
                        </Form.Item>
                        <Form.Item<User>
                            style={{ width: "100%" }}
                            label="Last Name"
                            name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a last name to the user.",
                                },
                            ]}
                        >
                            <Input size="small" />
                        </Form.Item>
                    </Flex>
                    <Form.Item<User>
                        style={{ width: "100%" }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please add an email to the user.",
                            },
                            {
                                pattern: /^[a-zA-Z0-9._%+-]+@vanderbilt\.edu$/i,
                                message:
                                    "Please enter a valid Vanderbilt email address!",
                            },
                        ]}
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Form.Item
                        required
                        label="Departments/Majors"
                        name="departments"
                    >
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            options={departments?.map((dept) => ({
                                value: dept,
                                label: dept,
                            }))}
                        />
                    </Form.Item>
                    <Flex gap="small">
                        <Form.Item
                            required
                            label="Status"
                            name="status"
                            style={{ width: "100%" }}
                        >
                            <Select
                                style={{ width: "100%" }}
                                options={[
                                    {
                                        value: "undergraduate",
                                        label: "Undergraduate",
                                    },
                                    { value: "graduate", label: "Graduate" },
                                    { value: "faculty", label: "Faculty" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            required
                            label="Graduation Year"
                            name="graduationYear"
                            style={{ width: "100%" }}
                        >
                            <Select
                                style={{ width: "100%" }}
                                options={Array.from({ length: 4 }, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return {
                                        value: year,
                                        label: year,
                                    };
                                })}
                            />
                        </Form.Item>
                    </Flex>
                    {currentUser?.access === "admin" && (
                        <Form.Item required label="Access Level" name="access">
                            <Select
                                style={{ width: "100%" }}
                                options={[
                                    { label: "Novice", value: "novice" },
                                    {
                                        label: "Proficient",
                                        value: "proficient",
                                    },
                                    { label: "Expert", value: "expert" },
                                    { label: "Moderator", value: "moderator" },
                                    { label: "Admin", value: "admin" },
                                ]}
                            />
                        </Form.Item>
                    )}

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

export default UserForm;
