// Description: Form component for creating new equipment entries.

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
import { useEffect, useState } from "react";
import axios from "axios";
import { CaretDownFilled, PlusOutlined } from "@ant-design/icons";
import { Category } from "../../types/category";

const { TextArea } = Input;

interface CreateEquipmentFormProps {
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    headline?: string;
    category: string;
    description: string;
    routePath: string;
    ipUrl: string;
}

const CreateEquipmentForm: React.FC<CreateEquipmentFormProps> = ({
    onUpdate,
}: CreateEquipmentFormProps) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<Category[]>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Category[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`
                );
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
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
        form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title="Add Equipment" placement="topLeft">
                <Button
                    type="primary"
                    size="middle"
                    iconPosition="end"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    shape="round"
                >Add New Equipment</Button>
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
                    <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="Headline"
                        name="headline"
                    >
                        <Input size="small" />
                    </Form.Item>
                       <Form.Item<FieldType>
                        style={{ width: "100%" }}
                        label="IP Address or URL"
                        name="ipUrl"
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
                            <Select
                                size="small"
                                suffixIcon={<CaretDownFilled />}
                                options={categories?.map((category) => ({
                                    value: category._id,
                                    label: category.name,
                                }))}
                            />
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

export default CreateEquipmentForm;
