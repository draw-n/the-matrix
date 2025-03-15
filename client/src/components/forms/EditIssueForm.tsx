import { CaretDownFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, Modal, Select, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { TextArea } = Input;

interface EditIssueFormProps {
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    category: string;
    description: string;
    routePath: string;
}

const EditIssueForm: React.FC<EditIssueFormProps> = ({onUpdate}: EditIssueFormProps) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
       
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/equipment`,
                values
            );
            onUpdate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error creating new update:", error);
        }
    };

    const handleOk = async () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields()
        setIsModalOpen(false);
    };
    return (
        <>
            <Tooltip title="Add Equipment" placement="topLeft">
                <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                />
            </Tooltip>
            <Modal
                title="Add Equipment"
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
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please add a description to the announcement.",
                            },
                        ]}
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Flex gap="small">
                        <Form.Item<FieldType>
                            style={{ width: "100%" }}
                            label="Route Path"
                            name="routePath"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please add a route path (ex. voron-1).",
                                },
                            ]}
                        >
                            <Input addonBefore="/makerspace/" size="small" />
                        </Form.Item>
                        <Form.Item<FieldType>
                            style={{ width: "100%" }}
                            label="Category"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a category type.",
                                },
                            ]}
                        >
                            
                        </Form.Item>
                    </Flex>

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
