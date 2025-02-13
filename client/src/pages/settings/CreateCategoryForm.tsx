import { Button, Form, FormProps, Input, Modal } from "antd";
import axios from "axios";
import { useState } from "react";

interface CreateCategoryFormProps {
    isModalOpen: boolean;
    setIsModalOpen: (item: boolean) => void;
    onUpdate: () => void;
}

interface FieldType {
    name: string;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
    isModalOpen,
    setIsModalOpen,
    onUpdate,
}: CreateCategoryFormProps) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        form.submit();
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/categories`,
                values
            );
            setIsModalOpen(false);
            onUpdate();
            form.resetFields();
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
            title="New Category"
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <Form onFinish={onFinish} form={form} layout="vertical">
                <Form.Item<FieldType>
                    name="name"
                    required
                    label="Category Name"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCategoryForm;
