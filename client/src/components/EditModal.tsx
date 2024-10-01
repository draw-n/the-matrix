import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";

interface EditModalProps {
    defaultType: string;
    defaultDescription: string;
}

const EditModal: React.FC<EditModalProps> = ({
    defaultType,
    defaultDescription,
}: EditModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState(defaultType);
    const [description, setDescription] = useState(defaultDescription);
    setType(defaultType); // TODO: delete
    setDescription(defaultDescription);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Edit
            </Button>
            <Modal
                title="Edit Update"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item>
                        <Input value={type} />
                    </Form.Item>
                    <Form.Item>
                        <Input value={description} />
                    </Form.Item>
                </Form>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
};

export default EditModal;
