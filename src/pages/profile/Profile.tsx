// Description: Profile page component for displaying and editing user profile information.

import { useAuth } from "../../hooks/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Button,
    Card,
    Descriptions,
    Flex,
    Input,
    message,
    Space,
} from "antd";

import {
    ArrowRightOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState<boolean>(false);

    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user?.firstName);
            setLastName(user?.lastName);
        }
    }, [user]);

    const handleClick = () => {
        if (editMode) {
            saveUserChanges();
        }
        setEditMode((prev) => !prev);
    };

    const saveUserChanges = async () => {
        try {
            const editedUser = {
                uuid: user?.uuid,
                firstName: firstName,
                lastName: lastName,
                email: user?.email,
                access: user?.access,
            };
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/${user?.uuid}`,
                editedUser
            );
        } catch (error) {
            console.error("Issue updating user", error);
        }
    };

    const handleChangePassword = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
                {
                    currentPassword,
                    newPassword,
                }
            );
            message.success("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            message.error("Can't change password at the moment.");
            console.error("Issue changing password", error);
        }
    };

    return (
        <>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Card>
                    <h2>{`${user?.firstName} ${user?.lastName}`}</h2>
                    <p style={{ textTransform: "capitalize" }}>
                        {user?.access}
                    </p>
                    <p>Vanderbilt University</p>
                </Card>
                <Alert
                    message="To have your access role changed, contact Dr. David Florian by email directly."
                    type="info"
                    style={{ width: "100%", textAlign: "center" }}
                />
                <Card>
                    <Space
                        style={{ width: "100%" }}
                        direction="vertical"
                        size="large"
                    >
                        <Flex justify="space-between" style={{ width: "100%" }}>
                            <h2>Personal Information</h2>
                            <Button
                                onClick={handleClick}
                                shape="circle"
                                variant="filled"
                                type="primary"
                                icon={
                                    editMode ? (
                                        <SaveOutlined />
                                    ) : (
                                        <EditOutlined />
                                    )
                                }
                            />
                        </Flex>
                        <Descriptions
                            layout="vertical"
                            colon={false}
                            items={[
                                {
                                    key: "1",
                                    label: "First Name",
                                    children: editMode ? (
                                        <Input
                                            size="small"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                        />
                                    ) : (
                                        <p>
                                            {firstName
                                                ? firstName
                                                : user?.firstName}
                                        </p>
                                    ),
                                },
                                {
                                    key: "2",
                                    label: "Last Name",
                                    children: editMode ? (
                                        <Input
                                            size="small"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                        />
                                    ) : (
                                        <p>
                                            {lastName
                                                ? lastName
                                                : user?.lastName}
                                        </p>
                                    ),
                                },
                                {
                                    key: "3",
                                    label: "Email",
                                    children: <p>{user?.email}</p>,
                                },
                                {
                                    key: "4",
                                    label: "Access Role",
                                    children: (
                                        <p
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {user?.access}
                                        </p>
                                    ),
                                },
                                {
                                    key: "5",
                                    label: "Status",
                                    span: 2,
                                    children: (
                                        <p
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {user?.status}
                                        </p>
                                    ),
                                },
                            ]}
                        />
                    </Space>
                </Card>
                <Card>
                    <Space
                        style={{ width: "100%" }}
                        direction="vertical"
                        size="middle"
                    >
                        <h2>Change Password</h2>
                        <p>Current Password</p>
                        <Input.Password
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <p>New Password</p>
                        <Input.Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Flex justify="end" style={{ width: "100%" }}>
                            <Button
                                iconPosition="end"
                                variant="filled"
                                type="primary"
                                icon={<ArrowRightOutlined />}
                                onClick={handleChangePassword}
                            >
                                Submit
                            </Button>
                        </Flex>
                    </Space>
                </Card>
            </Space>
        </>
    );
};

export default Profile;
