import {
    Alert,
    Button,
    Card,
    Col,
    Descriptions,
    DescriptionsProps,
    Flex,
    Input,
    Row,
    Space,
} from "antd";
import { useAuth } from "../../hooks/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

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
                _id: user?._id,
                firstName: firstName,
                lastName: lastName,
                email: user?.email,
                access: user?.access,
            };
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/${user?._id}`,
                editedUser
            );
        } catch (error) {
            console.error("Issue updating user", error);
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
                            <Button onClick={handleClick}>
                                {editMode ? "Save" : "Edit"}
                            </Button>
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
                    <h2>Change Password</h2>
                    <h3>Current Password</h3>
                    <Input.Password />
                    <h3>New Password</h3>
                    <Input.Password />
                    <Flex justify="end">
                        <Button>Submit</Button>
                    </Flex>
                </Card>
            </Space>
        </>
    );
};

export default Profile;
