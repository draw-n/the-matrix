import { Button, Card, Flex, Select, Space } from "antd";
import { useAuth, type User } from "../../hooks/AuthContext";
import { useState } from "react";
import axios from "axios";
import { UserSwitchOutlined } from "@ant-design/icons";

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
            <Card
                title={cardUser.firstName + " " + cardUser.lastName}
                extra={
                    <Flex gap="5px">
                        {editMode && (
                            <Button onClick={() => deleteUser(cardUser._id)}>
                                Delete
                            </Button>
                        )}
                        {user?._id != cardUser._id && (
                            <Button
                                onClick={handleClick}
                                className="primary-button-outlined"
                            >
                                {editMode ? "Save" : "Edit"}
                            </Button>
                        )}
                    </Flex>
                }
                bordered={false}
            >
                <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                >
                    <p>Email: {cardUser.email}</p>
                    <Space style={{ width: "100%" }}>
                        <p>Access:</p>
                        <Select
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
                </Space>
            </Card>
        </>
    );
};

export default UserCard;
