// Description: Form component for creating new issue reports.

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";

import {
    Button,
    Form,
    Select,
    Input,
    message,
    FormProps,
    Tooltip,
    Modal,
} from "antd";
import { CaretDownFilled, PlusOutlined } from "@ant-design/icons";

import SelectEquipment from "./SelectEquipment";

import { Category } from "../../types/category";
import "./issues.css";
import { useAllCategories } from "../../hooks/category";
import { CommonFormProps } from "../../types/common";
import { Issue } from "../../types/issue";

const { TextArea } = Input;


const CreateIssueForm: React.FC<CommonFormProps> = ({
    onSubmit,
}: CommonFormProps) => {
    const [form] = Form.useForm();
    const {data: categories} = useAllCategories();
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const { user } = useAuth();

    const onFinishFailed = () => {
        message.error("Missing one or more fields.");
    };

    const onFinish: FormProps<Issue>["onFinish"] = async (values) => {
        try {
            const newIssue = {
                equipment: values.equipmentId,
                description: `${values.initialDescription}\n${values.description}`,
                createdBy: user?.uuid,
                dateCreated: new Date(),
            };
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issues`,
                newIssue
            );
            setIsModalOpen(false);
            onSubmit();
        } catch (error) {
            console.error("Problem creating an issue: ", error);
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
            <Tooltip title={"Add Issue"}>
                <Button
                    type="primary"
                    size="middle"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    iconPosition="end"
                    shape={"round"}
                >
                    Add New Issue
                </Button>
            </Tooltip>

            <Modal
                title={"Add Issue"}
                open={isModalOpen}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        style={{ width: "100%" }}
                        label="Equipment Category"
                        name="categoryId"
                        rules={[
                            {
                                required: true,
                                message: "Please select a type of equipment.",
                            },
                        ]}
                    >
                        <Select
                            size="small"
                            suffixIcon={<CaretDownFilled />}
                            options={categories?.map((category) => ({
                                value: category.uuid,
                                label: category.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.categoryId !== currentValues.categoryId
                        }
                    >
                        {({ getFieldValue }) => {
                            const categoryId = getFieldValue("category");

                            return categoryId ? (
                                <>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="Select the Equipment with the Issue"
                                        name="equipment"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select the equipment experiencing the issue.",
                                            },
                                        ]}
                                    >
                                        <SelectEquipment categoryId={categoryId} />
                                    </Form.Item>
                                    <Form.Item<Issue>
                                        style={{ width: "100%" }}
                                        label="What is the issue? Select the one that is the most applicable."
                                        name="initialDescription"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please add a description for the issue.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            size="small"
                                            suffixIcon={<CaretDownFilled />}
                                            options={[
                                                ...(categories
                                                    ?.find(
                                                        (item) =>
                                                            item.uuid ===
                                                            categoryId
                                                    )
                                                    ?.defaultIssues?.map(
                                                        (issue) => ({
                                                            value: issue,
                                                            label: issue,
                                                        })
                                                    ) || []),
                                                {
                                                    value: "There is another issue not covered by the other options. Please elaborate below.",
                                                    label: "There is another issue not covered by the other options. Please elaborate below.",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </>
                            ) : null; // Hide when "option2" is selected
                        }}
                    </Form.Item>

                    <Form.Item<Issue>
                        style={{ width: "100%" }}
                        label="Please Provide More Details About the Issue"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description for the issue.",
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

export default CreateIssueForm;
