// Description: Form component for editing existing issue reports.

import axios from "axios";
import { useEffect, useState } from "react";

import { Button, Form, FormProps, Input, Modal, Select, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";

import HasAccess from "../rbac/HasAccess";
import { Issue, IssueStatus, WithIssue } from "../../types/issue";
import { User } from "../../types/user";
import { useAllUsers } from "../../hooks/user";
import { CommonFormProps } from "../../types/common";

const { TextArea } = Input;

type EditIssueFormProps = WithIssue & CommonFormProps;

const EditIssueForm: React.FC<EditIssueFormProps> = ({
    issue,
    onSubmit,
}: EditIssueFormProps) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { data: users } = useAllUsers();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const onFinish: FormProps<Issue>["onFinish"] = async (values) => {
        try {
            if (!issue) return;
            const editedIssue: Issue = {
                ...values,
                uuid: issue?.uuid,
                equipmentId: issue?.equipmentId,
                createdBy: issue?.createdBy,
                dateCreated: issue?.dateCreated,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issues/${issue.uuid}`,
                editedIssue
            );
            onSubmit();
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
                        status: issue?.status,
                        description: issue?.description,
                    }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<Issue>
                        style={{ width: "100%" }}
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Please select a status.",
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
                                    value: "in-progress",
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
                        <Form.Item<Issue>
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
                                    value: user.uuid,
                                    label: `${user.firstName} ${user.lastName}`,
                                }))}
                            />
                        </Form.Item>
                    </HasAccess>
                    
                    <Form.Item<Issue>
                        style={{ width: "100%" }}
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description to the issue.",
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
