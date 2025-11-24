// Description: UserCard component for displaying and editing user information in the user directory.

import { Button, Card, Flex, Popconfirm, Select, Space } from "antd";
import { useAuth } from "../../hooks/AuthContext";
import { User } from "../../types/user";
import { useState } from "react";
import axios from "axios";
import {
    CaretDownFilled,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";

interface UserCardProps {
    cardUser: User;
    deleteUser: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
    cardUser,
    deleteUser,
}: UserCardProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editAccess, setEditAccess] = useState<string>(cardUser.access);

    const { user } = useAuth();

    const handleClick = () => {
        if (editMode) {
            changeUserAccess();
        }
        setEditMode((prev) => !prev);
    };

    const changeUserAccess = async () => {
        try {
            const editedUser = {
                _id: cardUser._id,
                firstName: cardUser.firstName,
                lastName: cardUser.lastName,
                access: editAccess,
                email: cardUser.email,
            };
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/${cardUser._id}`,
                editedUser
            );
        } catch (error) {
            console.error("Issue updating user", error);
        }
    };

    return (
        <>
            <Card style={{ height: "100%" }}>
                <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                >
                    <h3 style={{ textTransform: "capitalize" }}>
                        {cardUser.firstName + " " + cardUser.lastName}
                    </h3>
                    <p>Email: {cardUser.email}</p>
                    <Space style={{ width: "100%" }}>
                        <p>Access:</p>
                        <Select
                            suffixIcon={<CaretDownFilled />}
                            size="small"
                            style={{ width: "100%" }}
                            disabled={!editMode}
                            value={editAccess}
                            onChange={setEditAccess}
                            options={[
                                { value: "novice", label: "Novice" },
                                { value: "proficient", label: "Proficient" },
                                { value: "expert", label: "Expert" },
                                { value: "moderator", label: "Moderator" },
                                { value: "admin", label: "Admin" },
                            ]}
                        />
                    </Space>
                    <Flex gap="5px" style={{ width: "100%" }} justify="end">
                        {editMode && (
                            <Popconfirm
                                title="Delete User"
                                description="Are you sure you want to delete this user?"
                                onConfirm={() => deleteUser(cardUser._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        )}
                        {user?._id != cardUser._id && (
                            <Button
                                size="small"
                                onClick={handleClick}
                                type={editMode ? "primary" : "default"}
                                icon={
                                    editMode ? (
                                        <SaveOutlined />
                                    ) : (
                                        <EditOutlined />
                                    )
                                }
                            >
                                {editMode ? "Save" : "Edit"}
                            </Button>
                        )}
                    </Flex>
                </Space>
            </Card>
        </>
    );
};

export default UserCard;
