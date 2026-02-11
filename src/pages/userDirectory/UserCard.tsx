// Description: UserCard component for displaying and editing user information in the user directory.

import { Button, Card, Flex, Popconfirm, Select, Space } from "antd";
import { useAuth } from "../../hooks/AuthContext";
import {  UserAccess,  WithUser } from "../../types/user";
import { useState } from "react";
import axios from "axios";
import {
    CaretDownFilled,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deleteUserById, editUserById } from "../../api/user";

const UserCard: React.FC<WithUser> = ({
    user: cardUser,
}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editAccess, setEditAccess] = useState<string>(cardUser?.access || "novice");
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleClick = () => {
        if (editMode && cardUser) {
            editUserById(cardUser.uuid, {...cardUser, access: editAccess as UserAccess});
        }
        setEditMode((prev) => !prev);
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
                        {cardUser?.firstName + " " + cardUser?.lastName}
                    </h3>
                    <p>Email: {cardUser?.email}</p>
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
                                onConfirm={() => deleteUserById(cardUser?.uuid || "")}
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
                        <Button
                            size="small"
                            onClick={() => navigate(`/users/${cardUser?.uuid || ""}`)}
                        >
                            View Profile
                        </Button>
                        {user?.uuid != cardUser?.uuid && (
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
