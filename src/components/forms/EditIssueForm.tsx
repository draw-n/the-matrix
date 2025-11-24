import { EditOutlined } from "@ant-design/icons";
import {
    Button,
    Flex,
    Form,
    FormProps,
    Input,
    Modal,
    Select,
    Tooltip,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Issue } from "../../types/Issue";
import { User } from "../../hooks/AuthContext";
import HasAccess from "../rbac/HasAccess";

const { TextArea } = Input;

interface EditIssueFormProps {
    issue: Issue;
    onUpdate: () => void;
}

interface FieldType {
    status: string;
    description: string;
    assignedTo: string[];
}

const EditIssueForm: React.FC<EditIssueFormProps> = ({
    issue,
    onUpdate,
}: EditIssueFormProps) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get<User[]>(
                `${import.meta.env.VITE_BACKEND_URL}/users?access=admin`
            );
            setUsers(response.data);
        };
        fetchData();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            const editedIssue: Issue = {
                _id: issue._id,
                equipment: issue.equipment,
                createdBy: issue.createdBy,
                dateCreated: issue.dateCreated,
                ...values,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issues/${issue._id}`,
                editedIssue
            );
            onUpdate();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating new update:", error);
        }
    };

    const handleOk = async () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };
    return (
        <>
            <Tooltip title="Edit Issue" placement="topLeft">
                <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    icon={<EditOutlined />}
                    onClick={showModal}
                />
            </Tooltip>
            <Modal
                title="Edit Issue"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    name="basic"
                    layout="vertical"
                    style={{ width: "100%" }}
                    initialValues={{
                        status: issue.status,
                        description: issue.description,
                    }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Please select a category type.",
                            },
                        ]}
                    >
                        <Select
                            options={[
                                {
                                    value: "open",
                                    label: "Open",
                                },
                                {
                                    value: "in progress",
                                    label: "In Progress",
                                },
                                {
                                    value: "completed",
                                    label: "Completed",
                                },
                            ]}
                        />
                    </Form.Item>
                    <HasAccess roles={["admin"]}>
                        <Form.Item<FieldType>
                            name="assignedTo"
                            label="Assigned To"
                        >
                            <Select
                                size="small"
                                mode="multiple"
                                showSearch
                                allowClear
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                options={users?.map((user) => ({
                                    value: user._id,
                                    label: `${user.firstName} ${user.lastName}`,
                                }))}
                            />
                        </Form.Item>
                    </HasAccess>

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
                        <TextArea size="small" rows={6} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditIssueForm;
