import { Button, Card, Select } from "antd";
import { useAuth, type User } from "../../hooks/AuthContext";
import { useState } from "react";
import axios from "axios";

interface UserCardProps {
    cardUser: User;
}

const UserCard: React.FC<UserCardProps> = ({ cardUser }: UserCardProps) => {
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
                    user?._id != cardUser._id && (
                        <Button onClick={handleClick}>
                            {editMode ? "Save" : "Edit"}
                        </Button>
                    )
                }
                bordered={false}
            >
                <p>Email: {cardUser.email}</p>
                {editMode ? (
                    <>
                        <p>Access:</p>
                        <Select
                            value={editAccess}
                            onChange={setEditAccess}
                            options={[
                                { value: "view", label: "View" },
                                { value: "edit", label: "Edit" },
                                { value: "admin", label: "Admin" },
                            ]}
                        />
                    </>
                ) : (
                    <p>Access: {editAccess}</p>
                )}
            </Card>
        </>
    );
};

export default UserCard;
