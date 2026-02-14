// Description: Form component for editing existing issue reports.

import { useState } from "react";

import { Button, Form, FormProps, Input, Modal, Select, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";

import HasAccess from "../routing/HasAccess";
import { Issue, WithIssue } from "../../types/issue";
import { useAllUsers } from "../../hooks/useUsers";
import { useEditIssueById } from "../../hooks/useIssues";

const EditIssueForm: React.FC<WithIssue> = ({ issue }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { data: users } = useAllUsers();
    const { mutateAsync: editIssueById } = useEditIssueById();
    const onFinish: FormProps<Issue>["onFinish"] = async (values) => {
        if (!issue) return;

        await editIssueById({ issueId: issue.uuid, editedIssue: values });

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
                    onClick={() => setIsModalOpen(true)}
                />
            </Tooltip>
            <Modal
                title="Edit Issue"
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
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
                        <Form.Item<Issue> name="assignedTo" label="Assigned To">
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
                        <Input.TextArea size="small" rows={6} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditIssueForm;
