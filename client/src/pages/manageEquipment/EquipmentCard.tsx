import { Button, Card, Input, Select } from "antd";
import { useAuth, type User } from "../../hooks/AuthContext";
import { useState } from "react";
import axios from "axios";

interface EquipmentCardProps {
    name: string;
    type: string;
    status: string;
    description: string;
    _id: string;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
    name,
    type,
    description,
    status,
    _id,
}: EquipmentCardProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>(name);
    const [editType, setEditType] = useState<string>(type);
    const [editDescription, setEditDescription] = useState<string>(description);

    const handleClick = () => {
        if (editMode) {
            changeEquipment();
        }
        setEditMode((prev) => !prev);
    };

    const changeEquipment = async () => {
        try {
            const editedEquipment = {
                _id: _id,
                name: editName,
                type: editType,
                description: editDescription,
                status: status,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/${_id}`,
                editedEquipment
            );
        } catch (error) {
            console.error("Issue updating user", error);
        }
    };

    return (
        <>
            <Card
                extra={
                    <Button onClick={handleClick}>
                        {editMode ? "Save" : "Edit"}
                    </Button>
                }
                bordered={false}
            >
                {editMode ? (
                    <>
                        <p>Type: </p>
                        <Select
                            value={editType}
                            onChange={setEditType}
                            options={[
                                {
                                    value: "filament",
                                    label: "Filament Printers",
                                },
                                { value: "resin", label: "Resin Printers" },
                                { value: "powder", label: "Powder Printers" },
                                {
                                    value: "subtractive",
                                    label: "Subtractive/Traditional Manufacturing",
                                },
                                {
                                    value: "computer",
                                    label: "Desktops/TV Monitor",
                                },
                                { value: "wiring", label: "Wiring Tools" },
                                { value: "other", label: "Other" },
                            ]}
                        />
                        <p>Name: </p>
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <p>Name: {editName}</p>
                        <p>Type: {editType}</p>
                        <p>Description: {editDescription}</p>
                        <p>Status: {status}</p>
                    </>
                )}
            </Card>
        </>
    );
};

export default EquipmentCard;
