// Description: Profile page component for displaying and editing user profile information.

import { useAuth } from "../../contexts/AuthContext";
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
import { WithUser } from "../../types/user";
import RemotePrintCard from "../../components/dashboard/RemotePrintCard";
import TotalFilamentUsedCard from "../../components/dashboard/TotalFilamentUsedCard";
import { useEditUserById } from "../../hooks/useUsers";

const Profile: React.FC<WithUser> = ({ user: propUser }) => {
    const { user: currentUser } = useAuth();
    const user = propUser || currentUser;
    const { mutateAsync: editUserById } = useEditUserById();

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
        if (editMode && user) {
            editUserById({
                userId: user?.uuid,
                editedUser: {
                    ...user,
                    firstName: firstName || "",
                    lastName: lastName || "",
                },
            });
        }
        setEditMode((prev) => !prev);
    };

    const handleChangePassword = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
                {
                    currentPassword,
                    newPassword,
                },
            );
            message.success("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            message.error("Can't change password at the moment.");
            console.error("Issue changing password", error);
        }
    };

    const descriptionsItems = [
        {
            key: "1",
            label: "First Name",
            children: editMode ? (
                <Input
                    style={{ textTransform: "capitalize" }}
                    size="small"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            ) : (
                <p style={{ textTransform: "capitalize" }}>
                    {firstName ? firstName : user?.firstName}
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
                    onChange={(e) => setLastName(e.target.value)}
                />
            ) : (
                <p>{lastName ? lastName : user?.lastName}</p>
            ),
        },
        {
            key: "3",
            label: "Email",
            children: <p>{user?.email}</p>,
        },
        {
            key: "4",
            label: "Status",
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
        {
            key: "5",
            label: "Graduation Year",
            children: (
                <p
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {user && user.graduationDate
                        ? new Date(user.graduationDate).getFullYear()
                        : "N/A"}
                </p>
            ),
        },
        {
            key: "6",
            label: "Department(s)",
            children: (
                <p
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {user?.departments?.join(", ") || "N/A"}
                </p>
            ),
        },
    ];

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
                {currentUser?.uuid === user?.uuid && (
                    <Card hidden={currentUser?.uuid !== user?.uuid}>
                        <Space
                            style={{ width: "100%" }}
                            direction="vertical"
                            size="large"
                        >
                            <Alert
                                message="To have your access role changed, contact Dr. David Florian by email directly."
                                type="info"
                                style={{ width: "100%", textAlign: "center" }}
                            />
                            <Flex
                                justify="space-between"
                                style={{ width: "100%" }}
                            >
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
                                items={descriptionsItems}
                            />
                        </Space>
                    </Card>
                )}

                {currentUser?.uuid !== user?.uuid && (
                    <RemotePrintCard userId={user?.uuid} />
                )}

                {currentUser?.uuid !== user?.uuid && (
                    <TotalFilamentUsedCard userId={user?.uuid} />
                )}

                <Card hidden={currentUser?.uuid !== user?.uuid}>
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
