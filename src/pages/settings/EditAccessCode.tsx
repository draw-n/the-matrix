// Description: EditAccessCode component for editing and saving access codes for different user roles.
import axios from "axios";
import { useEffect, useState } from "react";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Flex, Input, message, Tooltip } from "antd";


interface EditAccessCodeProps {
    initialEditMode: boolean;
    role: string;
}

const EditAccessCode: React.FC<EditAccessCodeProps> = ({
    role,
    initialEditMode,
}: EditAccessCodeProps) => {
    const [editMode, setEditMode] = useState(initialEditMode);
    const [accessCode, setAccessCode] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/accesses/${role}`
                );

                setAccessCode(response.data.accessCode);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [role]);

    const handleSave = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/accesses/${role}`,
                { accessCode }
            );
            message.success(`Successfully updated access code for ${role}.`);
        } catch (err: any) {
            if (err.status === 404) {
                try {
                    await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/accesses/`,
                        { role, accessCode }
                    );
                    message.success(
                        `Successfully updated access code for ${role}.`
                    );
                } catch (err) {
                    console.error("Failed to create access code:", err);
                    message.error(
                        `Unsuccessfully updated access code for ${role}.`
                    );

                    return;
                }
            } else {
                console.error("Failed to update access code:", err);
                message.error(
                    `Unsuccessfully updated access code for ${role}.`
                );

                return;
            }
        }
    };

    return (
        <Flex justify="space-between" align="center" gap="small">
            <p style={{ textTransform: "capitalize" }}>{role}</p>
            <Input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={!editMode}
            />
            {editMode ? (
                <Tooltip title="Save Access Code">
                    <Button
                        size="small"
                        icon={<SaveOutlined />}
                        onClick={() => {
                            handleSave();
                            setEditMode(false);
                        }}
                    />
                </Tooltip>
            ) : (
                <Tooltip title="Edit Access Code">
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                    />
                </Tooltip>
            )}
        </Flex>
    );
};

export default EditAccessCode;
