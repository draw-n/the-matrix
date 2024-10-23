import React, { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import { useAuth } from "../../hooks/AuthContext";
import axios from "axios";
import { Equipment } from "../../types/Equipment";

interface EditEquipmentProps {
    equipment: Equipment;
    onUpdate: () => void;
}

const { TextArea } = Input;

const EditEquipment: React.FC<EditEquipmentProps> = ({
    equipment,
    onUpdate
}: EditEquipmentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState(equipment.type);
    const [description, setDescription] = useState(equipment.description);

    const { user } = useAuth();
    const showModal = () => {
        setIsModalOpen(true);
    };

    /*const handleOk = async () => {
        try {
            const editedUpdate = {
                id: equipment._id,
                description: description,
                createdBy: equipment.createdBy,
                dateCreated: equipment.dateCreated,
                type: type,
                lastUpdatedBy: user?._id,
                dateLastUpdated: Date(),
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/announcements/${id}`,
                editedUpdate
            );
            onUpdate();
        } catch (error) {
            console.error("Issue editing update", error);
        }
        setIsModalOpen(false);
    };*/

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
                //onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="Type">
                        <Select
                            value={type}
                            onChange={setType}
                            options={[
                                { value: "event", label: "Event" },
                                { value: "classes", label: "Classes" },
                                { value: "other", label: "Other" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Description">
                        <TextArea
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditEquipment;
