import {
    Button,
    ColorPicker,
    Flex,
    Form,
    FormProps,
    Input,
    message,
    Modal,
    Select,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { Category } from "../../types/Category";
import randomColor from "randomcolor";

interface CategoryFormProps {
    category?: Category;
    isModalOpen: boolean;
    setIsModalOpen: (item: boolean) => void;
    onUpdate: () => void;
}

interface FieldType {
    name: string;
    properties: string[];
    color: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    category,
    isModalOpen,
    setIsModalOpen,
    onUpdate,
}: CategoryFormProps) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        form.submit();
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            if (category) {
                const editedCategory: Category = {
                    _id: category._id,
                    defaultIssues: category.defaultIssues,
                    ...values,
                };
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/categories/${
                        category._id
                    }`,
                    editedCategory
                );
                message.success(response.data.message);
            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/categories`,
                    values
                );
                message.success("Category successfully created!");
                form.resetFields();
            }

            setIsModalOpen(false);
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            onOk={handleOk}
            title={category ? "Edit Category" : "Add Category"}
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
                initialValues={
                    category
                        ? {
                              name: category.name,
                              properties: category.properties,
                              color: category.color,
                          }
                        : {
                              name: "",
                              properties: [],
                              color: randomColor(),
                          }
                }
            >
                <Flex style={{ width: "100%" }} justify="space-between">
                    <Form.Item<FieldType>
                        style={{ width: "50%" }}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name for the category.",
                            },
                        ]}
                        label="Category Name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="color"
                        label="Color"
                        rules={[
                            {
                                required: true,
                                message: "Please add a color for the category.",
                            },
                        ]}
                    >
                        <ColorPicker
                            value={form.getFieldValue("color")}
                            onChange={(e) => {
                                form.setFieldsValue({ color: e.toHexString() }); // Ensures color stays as a hex string
                            }}
                            showText
                        />
                    </Form.Item>
                </Flex>

                <Form.Item<FieldType> name="properties" label="Properties">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        options={[
                            { value: "temperature", label: "Temperature" },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;
